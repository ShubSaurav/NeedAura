'use server';

import { createServerClient } from '@/lib/supabase';

export interface CollabItem {
  id: string;
  type: 'skill' | 'team';
  title: string;
  description: string;
  tags: string[];
  ownerName: string;
  ownerAura: number;
  contactId: string;
  created_at: string;
}

/**
 * Server Action: Fetches active skill swaps and team finders
 */
export async function getCollabListings(type?: 'skill' | 'team'): Promise<{ success: boolean; data: CollabItem[] }> {
  try {
    const supabase = await createServerClient();
    
    // In dev mock fallback
    const mockListings: CollabItem[] = [
      {
        id: 'c1',
        type: 'skill',
        title: 'Teaching ReactJS for DSA/Python practice',
        description: 'I am proficient in React and Next.js. Looking for someone to tutor me in Python data structures for upcoming technical interviews.',
        tags: ['ReactJS', 'Python', 'DSA', 'Peer Tutoring'],
        ownerName: 'Shubham Saurav',
        ownerAura: 120,
        contactId: 'mock-shubham-uuid',
        created_at: new Date().toISOString()
      },
      {
        id: 'c2',
        type: 'skill',
        title: 'Figma UI/UX Mockups & Wireframing help',
        description: 'Can design high-fidelity landing pages or mobile wireframes in Figma. Swap for frontend styling or video editing advice.',
        tags: ['Figma', 'UI Design', 'Framer'],
        ownerName: 'Aditya Raj',
        ownerAura: 180,
        contactId: 'mock-aditya-uuid',
        created_at: new Date().toISOString()
      },
      {
        id: 'c3',
        type: 'team',
        title: 'Need React Native Developer for Smart Campus Hackathon',
        description: 'Building a smart parking allocator app. We have UI wireframes and database setup, just need someone to help with React Native integrations.',
        tags: ['React Native', 'Hackathon', 'Tailwind', 'Mobile'],
        ownerName: 'Aarav Sharma',
        ownerAura: 340,
        contactId: 'mock-aarav-uuid',
        created_at: new Date().toISOString()
      },
      {
        id: 'c4',
        type: 'team',
        title: 'UI Designer Needed for FinTech Course Project',
        description: 'Looking for a student designer to create dashboard mockups. Course project runs for 4 weeks. Easy work, nice team!',
        tags: ['Figma', 'FinTech', 'Course Project'],
        ownerName: 'Ishita Kapoor',
        ownerAura: 150,
        contactId: 'mock-ishita-uuid',
        created_at: new Date().toISOString()
      }
    ];

    const filtered = type ? mockListings.filter((item) => item.type === type) : mockListings;
    return { success: true, data: filtered };
  } catch (error: any) {
    console.error('Error fetching collaborate listings:', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Creates a new collaborate listing
 */
export async function createCollabListing(input: Omit<CollabItem, 'id' | 'ownerName' | 'ownerAura' | 'contactId' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Simulation logging
    console.log('Creating collaborate listing:', input);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
