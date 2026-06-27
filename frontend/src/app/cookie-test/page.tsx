'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function CookieTest() {
  const [cookies, setCookies] = useState('');
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read browser cookies
    if (typeof document !== 'undefined') {
      setCookies(document.cookie || 'No cookies found in document.cookie');
    }

    // Read localStorage
    if (typeof window !== 'undefined') {
      const storage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key) || '';
        }
      }
      setLocalStorageData(storage);
    }

    // Check Supabase session
    const checkSupabase = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setError(`Session check error: ${sessionError.message}`);
          return;
        }

        setSupabaseSession(session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            setError(`Profile query error: ${profileError.message}`);
          } else {
            setProfileData(profile);
          }
        }
      } catch (err: any) {
        setError(`Exception: ${err.message}`);
      }
    };

    checkSupabase();
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', backgroundColor: '#0f172a', color: '#f1f5f9', minHeight: '100vh' }}>
      <h1>NeedAura Auth Diagnostics</h1>
      <p>Use this page to check why session synchronization is failing.</p>
      
      {error && (
        <div style={{ padding: '12px', border: '1px solid #ef4444', backgroundColor: '#7f1d1d', color: '#fca5a5', borderRadius: '6px', marginBottom: '16px' }}>
          <strong>Error detected:</strong> {error}
        </div>
      )}

      <h2>1. document.cookie</h2>
      <pre style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
        {cookies}
      </pre>

      <h2>2. localStorage</h2>
      <pre style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
        {JSON.stringify(localStorageData, null, 2)}
      </pre>

      <h2>3. Supabase Auth Session</h2>
      <pre style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
        {supabaseSession ? JSON.stringify(supabaseSession, null, 2) : 'No active session found'}
      </pre>

      <h2>4. Profiles Table Record</h2>
      <pre style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', overflowX: 'auto' }}>
        {profileData ? JSON.stringify(profileData, null, 2) : 'No database profile found'}
      </pre>
    </div>
  );
}
