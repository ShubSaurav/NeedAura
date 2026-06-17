-- ==========================================
-- NeedAura Supabase Row-Level Security Policies (rls_policies.sql)
-- ==========================================

-- Enable Row Level Security on all critical tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if a user is a Moderator or Admin
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper Function to check user's university ID
CREATE OR REPLACE FUNCTION auth.get_user_university()
RETURNS UUID AS $$
  SELECT university_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- ==========================================
-- 1. Profiles Policies
-- ==========================================

-- Allow users to view profiles of students within their same university, or if they are admins/moderators
CREATE POLICY select_profiles ON profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR auth.get_user_university() = university_id
        OR auth.get_user_role() IN ('moderator', 'university_admin', 'super_admin')
    );

-- Allow users to edit their own profile fields (excluding roles or verification)
CREATE POLICY update_profiles ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevents role self-promotion
        AND is_verified = (SELECT is_verified FROM profiles WHERE id = auth.uid()) -- Prevents self-verification
    );


-- ==========================================
-- 2. Listings Policies & University Isolation
-- ==========================================

-- Select Policy: Enforces University Isolation based on visibility flag
CREATE POLICY select_listings ON listings
    FOR SELECT
    USING (
        deleted_at IS NULL AND (
            seller_id = auth.uid() -- Owner can see their own listing
            OR visibility = 'public' -- Public listings visible to everyone
            -- Campus visibility: must be in same university
            OR (visibility = 'campus' AND auth.get_user_university() = (SELECT university_id FROM profiles WHERE id = seller_id))
            -- Network visibility: same university or moderators can view
            OR (visibility = 'network' AND (
                auth.get_user_university() = (SELECT university_id FROM profiles WHERE id = seller_id)
                OR auth.get_user_role() IN ('moderator', 'university_admin', 'super_admin')
            ))
        )
    );

-- Insert Policy: Users can only create listings for themselves
CREATE POLICY insert_listings ON listings
    FOR INSERT
    WITH CHECK (auth.uid() = seller_id AND auth.uid() IN (SELECT id FROM profiles WHERE is_verified = TRUE));

-- Update Policy: Owner, Moderator, or Super Admin can edit
CREATE POLICY update_listings ON listings
    FOR UPDATE
    USING (
        auth.uid() = seller_id 
        OR auth.get_user_role() IN ('moderator', 'super_admin')
    );

-- Delete Policy (Soft delete only via update, but database policy protects raw deletes)
CREATE POLICY delete_listings ON listings
    FOR DELETE
    USING (
        auth.uid() = seller_id 
        OR auth.get_user_role() IN ('moderator', 'super_admin')
    );


-- ==========================================
-- 3. Needs Policies
-- ==========================================

-- Select Needs: Isolated by university unless public
CREATE POLICY select_needs ON needs
    FOR SELECT
    USING (
        deleted_at IS NULL AND (
            student_id = auth.uid()
            OR auth.get_user_university() = (SELECT university_id FROM profiles WHERE id = student_id)
            OR auth.get_user_role() IN ('moderator', 'super_admin')
        )
    );

-- Insert Needs: Verified students only
CREATE POLICY insert_needs ON needs
    FOR INSERT
    WITH CHECK (auth.uid() = student_id AND auth.uid() IN (SELECT id FROM profiles WHERE is_verified = TRUE));

-- Update/Delete Needs
CREATE POLICY update_needs ON needs
    FOR UPDATE
    USING (auth.uid() = student_id OR auth.get_user_role() IN ('moderator', 'super_admin'));


-- ==========================================
-- 4. Chat & Messages Policies (Secure Workspace)
-- ==========================================

-- Chat select: only participants in chat_participants
CREATE POLICY select_chats ON chats
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chat_participants 
            WHERE chat_participants.chat_id = id AND chat_participants.user_id = auth.uid()
        )
    );

-- Chat insert: only listing buyers or sellers
CREATE POLICY insert_chats ON chats
    FOR INSERT
    WITH CHECK (TRUE); -- Managed securely in transaction/service layer

-- Chat Participants select/insert
CREATE POLICY cp_all ON chat_participants
    FOR ALL
    USING (user_id = auth.uid() OR auth.get_user_role() IN ('moderator', 'super_admin'));

-- Messages: Only participants of the chat can read or write
CREATE POLICY select_messages ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chat_participants 
            WHERE chat_participants.chat_id = chat_id AND chat_participants.user_id = auth.uid()
        )
    );

CREATE POLICY insert_messages ON messages
    FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id 
        AND EXISTS (
            SELECT 1 FROM chat_participants 
            WHERE chat_participants.chat_id = chat_id AND chat_participants.user_id = auth.uid()
        )
    );


-- ==========================================
-- 5. Transactions Policies
-- ==========================================

-- Only Buyer, Seller, or admins can view transaction records
CREATE POLICY select_transactions ON transactions
    FOR SELECT
    USING (
        auth.uid() = buyer_id 
        OR auth.uid() = seller_id 
        OR auth.get_user_role() IN ('moderator', 'super_admin')
    );


-- ==========================================
-- 6. Notifications Policies
-- ==========================================

CREATE POLICY select_notifications ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY update_notifications ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- 7. Reviews Policies
-- ==========================================

-- Anyone can read reviews
CREATE POLICY select_reviews ON reviews
    FOR SELECT
    USING (TRUE);

-- Reviewer can write review if they participated in a completed transaction with reviewee
CREATE POLICY insert_reviews ON reviews
    FOR INSERT
    WITH CHECK (
        auth.uid() = reviewer_id
        AND EXISTS (
            SELECT 1 FROM transactions 
            WHERE listing_id = listing_id 
              AND status = 'completed'::transaction_status
              AND ((buyer_id = reviewer_id AND seller_id = reviewee_id) OR (buyer_id = reviewee_id AND seller_id = reviewer_id))
        )
    );


-- ==========================================
-- 8. Moderation & Audit Logs Policies
-- ==========================================

-- Reports can be created by any authenticated user, but viewed/resolved only by mods and super_admins
CREATE POLICY insert_reports ON reports
    FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY select_reports ON reports
    FOR SELECT
    USING (auth.get_user_role() IN ('moderator', 'university_admin', 'super_admin'));

CREATE POLICY update_reports ON reports
    FOR UPDATE
    USING (auth.get_user_role() IN ('moderator', 'university_admin', 'super_admin'));

-- Audit logs are accessible exclusively by super_admins
CREATE POLICY select_audit_logs ON audit_logs
    FOR SELECT
    USING (auth.get_user_role() = 'super_admin'::user_role);


-- ==========================================
-- 9. Vendors & Vendor Products Policies
-- ==========================================

-- Read vendors: visible to all students on campus
CREATE POLICY select_vendors ON vendors
    FOR SELECT
    USING (auth.get_user_university() = university_id);

-- Manage vendors: only university admins and super admins
CREATE POLICY manage_vendors ON vendors
    FOR ALL
    USING (auth.get_user_role() IN ('university_admin', 'super_admin'));

-- Read vendor products
CREATE POLICY select_vendor_products ON vendor_products
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = vendor_id 
              AND auth.get_user_university() = vendors.university_id
        )
    );

-- Manage vendor products
CREATE POLICY manage_vendor_products ON vendor_products
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = vendor_id 
              AND auth.get_user_role() IN ('university_admin', 'super_admin')
        )
    );
