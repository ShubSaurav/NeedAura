import { NextResponse } from 'next/server';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/marketplace';

  console.log('[Auth Callback] Code exchange triggered. Code present:', !!code);

  if (code) {
    try {
      const cookieStore = await cookies();
      const response = NextResponse.redirect(`${origin}${next}`);

      // Create a Supabase client that writes cookies directly to the Redirect Response object
      const supabase = createSupabaseServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co').trim(),
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key').trim(),
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  console.log(`[Auth Callback] Setting cookie: ${name}, options:`, options);
                  response.cookies.set(name, value, options);
                });
              } catch (err) {
                console.error('[Auth Callback] Failed to set cookies on response:', err);
              }
            },
          },
        }
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log('[Auth Callback] Code exchange successful. Redirecting to:', next);
        return response;
      } else {
        console.error('[Auth Callback] Code exchange failed:', error.message);
      }
    } catch (err) {
      console.error('[Auth Callback] Exception during code exchange:', err);
    }
  }

  // Redirect to login page with error notice on failure
  return NextResponse.redirect(`${origin}/login?error=Could not exchange auth code for session`);
}
