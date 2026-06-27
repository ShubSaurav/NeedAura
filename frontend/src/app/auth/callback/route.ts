import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/marketplace';

  console.log('[Auth Callback] Code exchange triggered. Code present:', !!code);

  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log('[Auth Callback] Code exchange successful. Redirecting to:', next);
        return NextResponse.redirect(`${origin}${next}`);
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
