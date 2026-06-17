'use server';

import { AIService, AIAnalysisResult } from '@/services/AIService';
import { ListingService } from '@/services/ListingService';
import { createServerClient } from '@/lib/supabase';
import { Listing } from '@shared/types/database';

/**
 * Server Action: Calls Gemini Vision API to analyze product photos and retrieve description/resale details
 */
export async function analyzeListingImage(imageUrl: string): Promise<{ success: boolean; data?: AIAnalysisResult; error?: string }> {
  try {
    if (!imageUrl) {
      return { success: false, error: 'No image URL provided.' };
    }

    console.log(`Starting Server-side Gemini Visual Scan for product: ${imageUrl}`);
    const analysis = await AIService.analyzeProductImage(imageUrl);
    
    return { success: true, data: analysis };
  } catch (error: any) {
    console.error('Error in analyzeListingImage Server Action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Saves a completed listing to the database (linked to authenticated user)
 */
export async function createListing(
  formData: Omit<Listing, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'> & {
    auctionStartPrice?: number;
    auctionEndTime?: string;
  }
): Promise<{ success: boolean; listingId?: string; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Retrieve currently logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Fallback buyer/seller UUID for dev mock testing
    const activeUserId = user?.id || 'mock-current-student-uuid';

    const result = await ListingService.createListing(activeUserId, formData);
    return result;
  } catch (error: any) {
    console.error('Error in createListing Server Action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Fetches active listings from the marketplace
 */
export async function fetchListings(filters: {
  category?: string;
  listingType?: string;
  searchQuery?: string;
} = {}): Promise<{ success: boolean; data: Listing[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Retrieve user university_id if possible
    let universityId = 'mock-university-uuid';
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('university_id')
        .eq('id', user.id)
        .single();
      if (profile?.university_id) {
        universityId = profile.university_id;
      }
    }

    const listings = await ListingService.getListings(universityId, filters);
    return { success: true, data: listings };
  } catch (error: any) {
    console.error('Error in fetchListings Server Action:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Server Action: Places a bid on an auction listing
 */
export async function placeBid(auctionId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const activeUserId = user?.id || 'mock-current-student-uuid';

    return await ListingService.placeAuctionBid(auctionId, activeUserId, amount);
  } catch (error: any) {
    console.error('Error in placeBid Server Action:', error);
    return { success: false, error: error.message };
  }
}

