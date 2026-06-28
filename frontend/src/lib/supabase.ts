import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Environment variables checks
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-anon-key').trim();

if (typeof window !== 'undefined') {
  console.log('[Supabase Init] Browser Client configured with URL:', supabaseUrl);
}

let browserClient: ReturnType<typeof createSupabaseClient> | undefined;

/**
 * Creates a Supabase client for use in browser components.
 * Uses standard supabase-js client to guarantee localStorage persistence.
 */
export function createClient() {
  if (typeof window === 'undefined') {
    // For SSR rendering fallback
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }

  return browserClient;
}

/**
 * Creates a Supabase client for use in Server Actions, SSR Pages, and API routes.
 */
export async function createServerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  const client = createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored in Server Components
          }
        },
      },
    }
  );

  // Manually authenticate the server client if our synchronized cookies exist
  if (accessToken && refreshToken) {
    try {
      await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (err) {
      console.error('[Supabase Server Init] Failed to set session from cookies:', err);
    }
  }

  return client;
}
