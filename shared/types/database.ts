// Database Role & Status Types
export type UserRole = 'student' | 'moderator' | 'university_admin' | 'super_admin';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type ListingStatus = 'active' | 'sold' | 'pending' | 'expired';
export type NeedStatus = 'active' | 'fulfilled' | 'cancelled';
export type VisibilityType = 'campus' | 'network' | 'public';

// Entity Interfaces
export interface University {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UniversityDomain {
  id: string;
  university_id: string;
  domain: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email: string;
  university_id?: string;
  branch?: string;
  hostel?: string;
  role: UserRole;
  aura_score: number;
  aura_points: number;
  avatar_url?: string;
  is_verified: boolean;
  student_id_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  suggested_price?: number;
  market_price?: number;
  category: string;
  condition_score?: number; // 0 to 100 percentage
  image_urls: string[];
  listing_type: 'buy' | 'sell' | 'exchange' | 'donate' | 'borrow' | 'rent' | 'auction';
  pickup_zone: string;
  status: ListingStatus;
  visibility: VisibilityType;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Auction {
  id: string;
  listing_id: string;
  start_price: number;
  current_price: number;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
}

export interface Need {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  budget?: number;
  category?: string;
  status: NeedStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Transaction {
  id: string;
  listing_id?: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: TransactionStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  listing_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  chat_id: string;
  user_id: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  category?: string;
  max_price?: number;
  search_query?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  query: string;
  filters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  listing_id?: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number; // 1 to 5
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  listing_id?: string;
  need_id?: string;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  awarded_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  university_id: string;
  verified: boolean;
  logo_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  action: string;
  target_table: string;
  target_id: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  created_at: string;
}
