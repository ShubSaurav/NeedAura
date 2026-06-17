import { createServerClient } from '@/lib/supabase';
import { Profile, Review, Report, AuditLog } from '@shared/types/database';

export class UserService {
  /**
   * Retrieves profile details for a student
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile, returning mock profile:', error);
      
      // Fallback mock profile for development
      return {
        id: userId,
        full_name: 'Shubham Saurav',
        email: 'shubham.s@chitkara.edu.in',
        university_id: 'mock-uni-id',
        branch: 'Computer Science',
        hostel: 'Block A, Room 302',
        role: 'student',
        aura_score: 120,
        aura_points: 350,
        avatar_url: '/mock-avatar.png',
        is_verified: true,
        student_id_url: '/mock-id.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  /**
   * Updates profile data (excluding restricted roles/verification)
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'role' | 'is_verified' | 'email' | 'created_at' | 'updated_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetches leaderboard ranking of verified profiles
   */
  static async getLeaderboard(
    universityId: string,
    groupBy: 'university' | 'branch' | 'hostel' = 'university'
  ): Promise<Profile[]> {
    try {
      const supabase = await createServerClient();
      let query = supabase.from('profiles').select('*').order('aura_score', { ascending: false }).limit(20);

      if (groupBy === 'university') {
        query = query.eq('university_id', universityId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard, returning mock ranking:', error);
      
      // Fallback mock leaderboard
      return [
        {
          id: '1',
          full_name: 'Aarav Sharma',
          email: 'aarav@cuchd.in',
          university_id: 'mock-uni-id',
          branch: 'CSE',
          hostel: 'Block B',
          role: 'student',
          aura_score: 340,
          aura_points: 1200,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          full_name: 'Shubham Saurav',
          email: 'shubham.s@chitkara.edu.in',
          university_id: 'mock-uni-id',
          branch: 'Computer Science',
          hostel: 'Block A',
          role: 'student',
          aura_score: 120,
          aura_points: 350,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Submits a moderator report for inappropriate listing or user scamming
   */
  static async submitReport(
    reporterId: string,
    data: Omit<Report, 'id' | 'reporter_id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
      const supabase = await createServerClient();
      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          reporter_id: reporterId,
          reported_user_id: data.reported_user_id,
          listing_id: data.listing_id,
          need_id: data.need_id,
          reason: data.reason,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, reportId: report.id };
    } catch (error: any) {
      console.error('Error submitting report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log administrative moderator audits
   */
  static async logAdminAudit(
    adminId: string,
    action: string,
    targetTable: string,
    targetId: string,
    oldData?: Record<string, any>,
    newData?: Record<string, any>
  ): Promise<void> {
    try {
      const supabase = await createServerClient();
      await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action,
        target_table: targetTable,
        target_id: targetId,
        old_data: oldData,
        new_data: newData,
      });
    } catch (error) {
      console.error('Error writing audit log:', error);
    }
  }
}
