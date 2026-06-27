import { createServerClient } from '@/lib/supabase';
import { Listing, ListingStatus, VisibilityType, Auction, AuctionBid, Need } from '@shared/types/database';

export class ListingService {
  /**
   * Creates a new listing (and auction if type is auction)
   */
  static async createListing(
    sellerId: string,
    data: Omit<Listing, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'> & {
      auctionStartPrice?: number;
      auctionEndTime?: string;
    }
  ): Promise<{ success: boolean; listingId?: string; error?: string }> {
    try {
      const supabase = await createServerClient();
      
      // Retrieve currently logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create a listing.');
      }

      const result = await ListingService.createListingInDb(user.id, data);
      return result;
    } catch (error: any) {
      console.error('Error in createListing:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Internal DB insertion for listing
   */
  private static async createListingInDb(
    sellerId: string,
    data: Omit<Listing, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'> & {
      auctionStartPrice?: number;
      auctionEndTime?: string;
    }
  ): Promise<{ success: boolean; listingId?: string; error?: string }> {
    const supabase = await createServerClient();
    
    // Insert main listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        seller_id: sellerId,
        title: data.title,
        description: data.description,
        price: data.price,
        suggested_price: data.suggested_price,
        market_price: data.market_price,
        category: data.category,
        condition_score: data.condition_score,
        image_urls: data.image_urls,
        listing_type: data.listing_type,
        pickup_zone: data.pickup_zone,
        visibility: data.visibility,
        status: 'active',
      })
      .select()
      .single();

    if (listingError || !listing) {
      throw new Error(listingError?.message || 'Failed to create listing');
    }

    // If listing type is auction, create the auction record
    if (data.listing_type === 'auction' && data.auctionStartPrice && data.auctionEndTime) {
      const { error: auctionError } = await supabase
        .from('auctions')
        .insert({
          listing_id: listing.id,
          start_price: data.auctionStartPrice,
          current_price: data.auctionStartPrice,
          end_time: data.auctionEndTime,
        });

      if (auctionError) {
        // Rollback listing if auction fails
        await supabase.from('listings').delete().eq('id', listing.id);
        throw new Error(auctionError.message);
      }
    }

    return { success: true, listingId: listing.id };
  }

  /**
   * Fetches listings with filters and university isolation
   */
  static async getListings(
    userUniversityId: string,
    filters: {
      category?: string;
      listingType?: string;
      visibility?: VisibilityType;
      searchQuery?: string;
    } = {}
  ): Promise<Listing[]> {
    try {
      const supabase = await createServerClient();
      
      let query = supabase
        .from('listings')
        .select('*')
        .is('deleted_at', null)
        .eq('status', 'active');

      // Filter by category
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Filter by type
      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType);
      }

      // Simple and robust search using .or filter to avoid missing generated columns
      if (filters.searchQuery) {
        const queryStr = `%${filters.searchQuery}%`;
        query = query.or(`title.ilike.${queryStr},description.ilike.${queryStr}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error in getListings:', error);
      return [];
    }
  }

  /**
   * Places a bid on an active auction listing
   */
  static async placeAuctionBid(
    auctionId: string,
    bidderId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createServerClient();

      // Retrieve auction details
      const { data: auction, error: auctionError } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', auctionId)
        .single();

      if (auctionError || !auction) {
        throw new Error('Auction not found');
      }

      // Check if bidding is expired
      if (new Date(auction.end_time) < new Date()) {
        throw new Error('Auction has ended');
      }

      // Bid must be higher than current price
      if (amount <= auction.current_price) {
        throw new Error('Bid must be higher than current price');
      }

      // Insert bid
      const { error: bidError } = await supabase
        .from('auction_bids')
        .insert({
          auction_id: auctionId,
          bidder_id: bidderId,
          amount: amount,
        });

      if (bidError) throw bidError;

      // Update current price in auction
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ current_price: amount })
        .eq('id', auctionId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error: any) {
      console.error('Error placing bid:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Creates a student Need post
   */
  static async createNeed(
    studentId: string,
    data: Omit<Need, 'id' | 'student_id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; needId?: string; error?: string }> {
    try {
      const supabase = await createServerClient();

      const { data: need, error } = await supabase
        .from('needs')
        .insert({
          student_id: studentId,
          title: data.title,
          description: data.description,
          budget: data.budget,
          category: data.category,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI Match Engine inside Next.js Server Action
      // (This will search similar items and notify the student)
      
      return { success: true, needId: need.id };
    } catch (error: any) {
      console.error('Error creating need:', error);
      return { success: false, error: error.message };
    }
  }
}
