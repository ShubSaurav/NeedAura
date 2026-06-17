'use server';

import { ChatService } from '@/services/ChatService';
import { createServerClient } from '@/lib/supabase';
import { Chat, Message } from '@shared/types/database';

/**
 * Server Action: Fetches all chat channels involving the current user
 */
export async function getUserChats(): Promise<{ success: boolean; data: (Chat & { latestMessage?: string; otherParticipantName?: string })[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Fallback current student UUID in development dev environments
    const userId = user?.id || 'mock-current-student-uuid';
    
    const chats = await ChatService.getUserChats(userId);
    return { success: true, data: chats };
  } catch (error: any) {
    console.error('Error in getUserChats Server Action:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Server Action: Fetches message history inside a chat thread
 */
export async function getMessages(chatId: string): Promise<{ success: boolean; data: Message[]; error?: string }> {
  try {
    const messages = await ChatService.getMessages(chatId);
    return { success: true, data: messages };
  } catch (error: any) {
    console.error('Error in getMessages Server Action:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Server Action: Sends a message inside a chat thread
 */
export async function sendMessage(chatId: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Fallback sender UUID
    const senderId = user?.id || 'current-user-id';

    const result = await ChatService.sendMessage(chatId, senderId, content);
    return result;
  } catch (error: any) {
    console.error('Error in sendMessage Server Action:', error);
    return { success: false, error: error.message };
  }
}
