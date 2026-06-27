import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr';

// Environment variables checks
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-anon-key').trim();

if (typeof window !== 'undefined') {
  console.log('[Supabase Init] Browser Client configured with URL:', supabaseUrl);
}

/**
 * Creates a Supabase client for use in browser components.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates a Supabase client for use in Server Actions, SSR Pages, and API routes.
 */
export async function createServerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createSupabaseServerClient(
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
