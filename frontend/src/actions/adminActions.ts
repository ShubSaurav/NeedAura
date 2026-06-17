'use server';

import { createServerClient } from '@/lib/supabase';
import { UserService } from '@/services/UserService';

export interface PendingVerification {
  id: string;
  fullName: string;
  email: string;
  university: string;
  branch: string;
  studentIdUrl: string;
  auraScore: number;
}

export interface FlaggedReport {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  listingTitle?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

/**
 * Server Action: Fetches pending student ID verifications
 */
export async function getPendingVerifications(): Promise<{ success: boolean; data: PendingVerification[] }> {
  try {
    const supabase = await createServerClient();
    
    // Dev mock queue
    const mockPending: PendingVerification[] = [
      {
        id: 'p-user-1',
        fullName: 'Ishita Kapoor',
        email: 'ishita.k@chitkara.edu.in',
        university: 'Chitkara University',
        branch: 'Electronics',
        studentIdUrl: '/mock-id-card-ishita.jpg',
        auraScore: 100
      },
      {
        id: 'p-user-2',
        fullName: 'Kabir Verma',
        email: 'kabir@lpu.in',
        university: 'Lovely Professional University (LPU)',
        branch: 'Mechanical Eng.',
        studentIdUrl: '/mock-id-card-kabir.jpg',
        auraScore: 100
      }
    ];

    return { success: true, data: mockPending };
  } catch (error: any) {
    console.error('Error fetching pending verifications:', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Approves or rejects a student ID card verification
 */
export async function verifyStudentStatus(userId: string, approve: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const moderatorId = user?.id || 'mock-moderator-uuid';

    // In production, update profiles in database:
    // Update profiles is_verified = approve, aura_score = aura_score + 50
    console.log(`Moderator ${moderatorId} resolved student ID for ${userId}: ${approve ? 'APPROVED' : 'REJECTED'}`);

    // Log administrative moderator audits
    await UserService.logAdminAudit(
      moderatorId,
      approve ? 'APPROVE_STUDENT_ID' : 'REJECT_STUDENT_ID',
      'profiles',
      userId,
      { is_verified: false },
      { is_verified: approve }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Fetches active user reports
 */
export async function getFlaggedReports(): Promise<{ success: boolean; data: FlaggedReport[] }> {
  try {
    const supabase = await createServerClient();

    // Dev mock reports
    const mockReports: FlaggedReport[] = [
      {
        id: 'rep-1',
        reporterName: 'Aditya Raj',
        reportedName: 'Unknown Student',
        reason: 'Unrealistic price for Casio calculator (listing ₹12,000 for a used fx-991EX). Suspicion of scam.',
        listingTitle: 'Casio Calculator fx-991EX Premium Edition',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 'rep-2',
        reporterName: 'Aarav Sharma',
        reportedName: 'Random Junior',
        reason: 'Spam description containing non-university links.',
        listingTitle: 'DBMS Textbook Course notes download links',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    return { success: true, data: mockReports };
  } catch (error: any) {
    console.error('Error fetching flagged reports:', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Dismisses or resolves a flagged listing report
 */
export async function resolveReport(reportId: string, action: 'resolve' | 'dismiss'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const moderatorId = user?.id || 'mock-moderator-uuid';

    console.log(`Moderator ${moderatorId} resolved report ${reportId} with action: ${action}`);

    // Log administrative moderator audits
    await UserService.logAdminAudit(
      moderatorId,
      action === 'resolve' ? 'RESOLVE_REPORT' : 'DISMISS_REPORT',
      'reports',
      reportId,
      { status: 'pending' },
      { status: action === 'resolve' ? 'resolved' : 'dismissed' }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
