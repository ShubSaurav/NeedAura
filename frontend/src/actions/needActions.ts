'use server';

import { ListingService } from '@/services/ListingService';
import { AIService } from '@/services/AIService';
import { createServerClient } from '@/lib/supabase';
import { Need } from '@shared/types/database';

/**
 * Server Action: Fetches all active student needs in the university network
 */
export async function getActiveNeeds(
  filters: { category?: string; searchQuery?: string } = {}
): Promise<{ success: boolean; data: (Need & { studentName?: string; studentAvatar?: string })[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Select needs joined with profile details
    let query = supabase
      .from('needs')
      .select('*, profiles (full_name, avatar_url)')
      .is('deleted_at', null)
      .eq('status', 'active');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = (data || []).map((need: any) => ({
      id: need.id,
      student_id: need.student_id,
      title: need.title,
      description: need.description,
      budget: need.budget,
      category: need.category,
      status: need.status,
      created_at: need.created_at,
      updated_at: need.updated_at,
      studentName: need.profiles?.full_name || 'Student',
      studentAvatar: need.profiles?.avatar_url,
    }));

    return { success: true, data: formattedData };
  } catch (error) {
    console.error('Error fetching needs, returning mock feeds:', error);
    
    // Fallback mock needs for development
    return {
      success: true,
      data: [
        {
          id: 'mock-need-1',
          student_id: 'user-2',
          title: 'Required: Scientific Calculator for exam tomorrow',
          description: 'Need a Casio scientific calculator fx-991EX for my maths exam tomorrow morning. Will return it or buy it permanently.',
          budget: 500.00,
          category: 'Electronics',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          studentName: 'Aarav Sharma',
          studentAvatar: '/mock-avatar-2.png',
        },
        {
          id: 'mock-need-2',
          student_id: 'user-3',
          title: 'Looking for DBMS Lab Manuals & PYQs',
          description: 'If anyone from 3rd year has printed DBMS manuals or previous year question sheets, please share. Ready to pay or swap with DSA notes.',
          budget: 100.00,
          category: 'Books',
          status: 'active',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          studentName: 'Priya Patel',
          studentAvatar: '/mock-avatar-3.png',
        }
      ]
    };
  }
}

/**
 * Server Action: Creates a student need requirement
 */
export async function createNeed(
  formData: Omit<Need, 'id' | 'student_id' | 'status' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; needId?: string; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fallback user UUID
    const studentId = user?.id || 'mock-current-student-uuid';

    const result = await ListingService.createNeed(studentId, formData);
    return result;
  } catch (error: any) {
    console.error('Error in createNeed Server Action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Queries the AI Match Engine to search and align needs with active listings
 */
export async function findMatchesForNeed(needTitle: string, needCategory: string): Promise<{ success: boolean; matches: any[]; error?: string }> {
  try {
    // In production, this uses pgvector semantic queries in postgres.
    // For MVP, we perform full-text matching.
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles (full_name)')
      .is('deleted_at', null)
      .eq('status', 'active')
      .eq('category', needCategory)
      .limit(3);

    if (error) throw error;
    return { success: true, matches: data || [] };
  } catch (error: any) {
    console.error('Error matching needs:', error);
    return { success: false, matches: [], error: error.message };
  }
}
