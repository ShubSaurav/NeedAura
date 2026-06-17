import { createServerClient } from '@/lib/supabase';
import { Chat, Message } from '@shared/types/database';

export class ChatService {
  /**
   * Retrieves all chat channels for a user
   */
  static async getUserChats(userId: string): Promise<(Chat & { latestMessage?: string; otherParticipantName?: string })[]> {
    try {
      const supabase = await createServerClient();

      // Get chats where the user is a participant
      const { data: participants, error: pError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', userId);

      if (pError || !participants || participants.length === 0) {
        return [];
      }

      const chatIds = participants.map((p) => p.chat_id);

      // Get chats info
      const { data: chats, error: cError } = await supabase
        .from('chats')
        .select(`
          *,
          listings (title, seller_id),
          chat_participants!inner (user_id, profiles (full_name, avatar_url))
        `)
        .in('id', chatIds);

      if (cError) throw cError;

      // Map chats with participant details
      return (chats || []).map((chat: any) => {
        const otherParticipant = chat.chat_participants.find((p: any) => p.user_id !== userId);
        return {
          id: chat.id,
          listing_id: chat.listing_id,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
          otherParticipantName: otherParticipant?.profiles?.full_name || 'Student',
          latestMessage: 'Click to open chat thread',
        };
      });
    } catch (error) {
      console.error('Error fetching chats, returning mock chat list:', error);
      
      // Fallback mock chats for development
      return [
        {
          id: 'mock-chat-1',
          listing_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          otherParticipantName: 'Aarav Sharma',
          latestMessage: 'Hey, is the Casio calculator price negotiable?'
        },
        {
          id: 'mock-chat-2',
          listing_id: '2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          otherParticipantName: 'Priya Patel',
          latestMessage: 'I would love to pick up the DBMS book today.'
        }
      ];
    }
  }

  /**
   * Retrieves message logs within a chat thread
   */
  static async getMessages(chatId: string): Promise<Message[]> {
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages, returning mock message logs:', error);

      // Fallback mock message log
      return [
        {
          id: 'msg-1',
          chat_id: chatId,
          sender_id: 'other-user-id',
          content: 'Hey Shubham! I saw your calculator listing. Is it still available?',
          is_read: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'msg-2',
          chat_id: chatId,
          sender_id: 'current-user-id',
          content: 'Hey! Yes, it is still active. I can meet near the library entrance to hand it over.',
          is_read: true,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'msg-3',
          chat_id: chatId,
          sender_id: 'other-user-id',
          content: 'Awesome! Can we meet today at 4 PM?',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Creates a new chat thread for negotiation
   */
  static async createChatThread(listingId: string, buyerId: string, sellerId: string): Promise<{ success: boolean; chatId?: string; error?: string }> {
    try {
      const supabase = await createServerClient();

      // Create new chat room
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({ listing_id: listingId })
        .select()
        .single();

      if (chatError || !chat) throw chatError;

      // Add participants
      const { error: pError } = await supabase
        .from('chat_participants')
        .insert([
          { chat_id: chat.id, user_id: buyerId },
          { chat_id: chat.id, user_id: sellerId }
        ]);

      if (pError) {
        // Rollback chat if participants insert fails
        await supabase.from('chats').delete().eq('id', chat.id);
        throw pError;
      }

      return { success: true, chatId: chat.id };
    } catch (error: any) {
      console.error('Error creating chat thread:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sends a message inside a chat room
   */
  static async sendMessage(chatId: string, senderId: string, content: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createServerClient();

      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          content: content,
          is_read: false
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }
}
