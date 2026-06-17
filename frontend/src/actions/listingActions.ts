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
