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
      
      // Manually construct a mutable redirect response
      const response = new NextResponse(null, {
        status: 307,
        headers: {
          Location: `${origin}${next}`,
        },
      });

      // Create a Supabase client that writes cookies directly to the Response object
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
                  
                  // Manually serialize the Set-Cookie header to guarantee it is sent raw
                  const cookieParts = [`${name}=${value}`];
                  if (options.path) cookieParts.push(`Path=${options.path}`);
                  if (options.domain) cookieParts.push(`Domain=${options.domain}`);
                  if (options.maxAge !== undefined) cookieParts.push(`Max-Age=${options.maxAge}`);
                  if (options.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
                  if (options.httpOnly) cookieParts.push(`HttpOnly`);
                  if (options.secure) cookieParts.push(`Secure`);
                  
                  const rawCookieStr = cookieParts.join('; ');
                  console.log('[Auth Callback] Appending raw header:', rawCookieStr);
                  response.headers.append('Set-Cookie', rawCookieStr);
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
  const errorResponse = new NextResponse(null, {
    status: 307,
    headers: {
      Location: `${origin}/login?error=Could not exchange auth code for session`,
    },
  });
  return errorResponse;
}
