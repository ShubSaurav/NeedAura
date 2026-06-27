'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useApp, translations } from '@/store/AppContext';
import { Lock, Mail, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const { setUser, language } = useApp();
  const t = translations[language];
  
  // Login method: 'email' or 'phone'
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealSupabase, setIsRealSupabase] = useState(false);

  // Check if real Supabase keys are configured in environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && url.trim() !== 'https://mock-supabase.supabase.co') {
      setIsRealSupabase(true);
    }
  }, []);

  // OTP Countdown Timer
  useEffect(() => {
    let interval: any;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // Real Supabase Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('[Login] handleLogin triggered. isRealSupabase =', isRealSupabase);
    console.log('[Login] Attempting login with email:', email);

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        console.log('[Login] Initiating supabase.auth.signInWithPassword...');
        
        // Timeout helper
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out after 15 seconds. Please check your Supabase project status or internet connection.')), 15000)
        );

        const { data, loginError } = await Promise.race([
          supabase.auth.signInWithPassword({
            email,
            password,
          }).then(res => ({ data: res.data, loginError: res.error })),
          timeoutPromise
        ]) as any;

        console.log('[Login] supabase.auth.signInWithPassword completed. Response:', { data, loginError });

        if (loginError) {
          setError(loginError.message);
          setIsLoading(false);
        } else {
          if (data.user) {
            setUser({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || email.split('@')[0].toUpperCase(),
              email: data.user.email || email,
              branch: data.user.user_metadata?.branch || 'Computer Science',
              role: 'student',
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              is_aadhaar_verified: false,
              onboarding_completed: false,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || new Date().toISOString()
            });
          }
          setIsLoading(false);
          router.push('/marketplace');
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'An error occurred during authentication.');
      }
    } else {
      // Offline mock fallback
      setTimeout(() => {
        setIsLoading(false);
        setUser({
          id: 'user-' + Date.now(),
          full_name: email.split('@')[0].toUpperCase(),
          email: email,
          branch: 'Computer Science',
          role: 'student',
          aura_score: 100,
          aura_points: 0,
          is_verified: false,
          is_aadhaar_verified: false,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        router.push('/marketplace');
      }, 1200);
    }
  };

  // Real Supabase Phone OTP Request
  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    setError(null);

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\s+/g, '')}`;

        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        setIsLoading(false);
        if (otpError) {
          setError(otpError.message);
        } else {
          setIsOtpSent(true);
          setTimer(30);
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'An error occurred while sending OTP.');
      }
    } else {
      // Offline mock fallback
      setTimeout(() => {
        setIsLoading(false);
        setIsOtpSent(true);
        setTimer(30);
      }, 1000);
    }
  };

  // Real Supabase Phone OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\s+/g, '')}`;

        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp,
          type: 'sms',
        });

        if (verifyError) {
          setError(verifyError.message);
          setIsLoading(false);
        } else {
          if (data.user) {
            setUser({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || 'Verified Student',
              email: data.user.email || `${phone}@needaura.phone`,
              phone_number: data.user.phone || phone,
              branch: data.user.user_metadata?.branch || 'Computer Science',
              role: 'student',
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              is_aadhaar_verified: false,
              onboarding_completed: false,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || new Date().toISOString()
            });
          }
          setIsLoading(false);
          router.push('/marketplace');
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'Failed to verify OTP.');
      }
    } else {
      // Offline mock fallback
      setTimeout(() => {
        setIsLoading(false);
        if (otp === '1234' || otp.length === 4) {
          setUser({
            id: 'user-' + Date.now(),
            full_name: 'Verified Phone Student (Demo)',
            email: `${phone}@needaura.phone`,
            phone_number: phone,
            branch: 'Computer Science',
            role: 'student',
            aura_score: 100,
            aura_points: 0,
            is_verified: false,
            is_aadhaar_verified: false,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          router.push('/marketplace');
        } else {
          setError('Invalid OTP code. Please enter 1234 for testing.');
        }
      }, 1000);
    }
  };

  // Real Supabase Google OAuth Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        const { error: googleError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/marketplace`,
          }
        });
        if (googleError) {
          setError(googleError.message);
          setIsLoading(false);
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'Google Auth initiation failed.');
      }
    } else {
      // Offline mock fallback
      setTimeout(() => {
        setIsLoading(false);
        setUser({
          id: 'google-user-' + Date.now(),
          full_name: 'Google Student',
          email: 'student.google@gmail.com',
          branch: 'Information Technology',
          role: 'student',
          aura_score: 100,
          aura_points: 0,
          is_verified: false,
          is_aadhaar_verified: false,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        router.push('/marketplace');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-brand-blue/20 shadow-[0_0_20px_rgba(0,102,255,0.05)] bg-card-dark">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="NeedAura Logo"
                width={313} height={200} className="h-20 w-auto object-contain"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-display">Sign In to Campus Marketplace</CardTitle>
            <CardDescription>Log in using Google, email, or mobile number to browse local campus deals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Supabase Status Banner */}
            {!isRealSupabase && (
              <div className="text-[10px] text-brand-orange bg-brand-orange/5 p-2 rounded border border-brand-orange/20 text-center font-mono leading-relaxed">
                ⚠️ Demo Mode Active. Please configure keys for real SMS OTP.
              </div>
            )}

            {!isOtpSent && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 border border-card-border bg-slate-900/40 hover:bg-slate-800/60 font-sans py-2.5 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Login with Google Account
                </Button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border/40" /></div>
                  <span className="relative px-3 bg-slate-950 text-slate-500 text-[10px] font-mono uppercase">Or sign in with details</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-card-border/60 max-w-[280px] mx-auto mb-2">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all duration-300 ${
                      loginMethod === 'email'
                        ? 'bg-brand-blue text-white shadow-[0_0_12px_rgba(0,102,255,0.3)] font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                  >
                    Email Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all duration-300 ${
                      loginMethod === 'phone'
                        ? 'bg-brand-blue text-white shadow-[0_0_12px_rgba(0,102,255,0.3)] font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                  >
                    Phone Number
                  </button>
                </div>
              </>
            )}

            {loginMethod === 'phone' && isOtpSent ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-center">
                    <span className="text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider">
                      OTP SENT
                    </span>
                  </div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block text-center">
                    Enter 4-Digit OTP Code
                  </label>
                  <div className="flex gap-2 justify-center py-2">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="text-center text-lg font-bold tracking-[0.5rem] pl-2 max-w-[140px] bg-slate-900/80 border-brand-blue/30 focus:border-brand-blue/70"
                    />
                  </div>
                  <div className="text-xs text-center text-slate-400">
                    Verification code sent to <span className="text-white font-mono font-bold">{phone}</span>. <br />
                    {!isRealSupabase && <span className="text-[10px] text-slate-500 font-mono">Hint: Enter 1234 to bypass</span>}
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-brand-orange bg-brand-orange/5 p-2.5 rounded border border-brand-orange/20 text-center font-sans">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  glow
                  className="w-full mt-2 py-3 text-sm font-semibold transition-all duration-300"
                  disabled={isLoading || otp.length < 4}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Log In'} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtp('');
                      setError(null);
                    }}
                    className="text-slate-400 hover:text-white underline font-mono"
                  >
                    Change Phone Number
                  </button>
                  {timer > 0 ? (
                    <span className="text-slate-500 font-mono">Resend in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-brand-blue hover:underline font-mono"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginMethod === 'email' ? (
                  <>
                    <div className="space-y-2 animate-fadeIn">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-brand-blue" /> Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@gmail.com or you@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-brand-blue" /> Password
                        </label>
                        <span className="text-xs text-brand-orange hover:underline cursor-pointer font-sans font-medium">
                          Forgot Password?
                        </span>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-blue" /> Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="text-sm text-brand-orange bg-brand-orange/5 p-3 rounded border border-brand-orange/20 font-sans">
                    {error}
                  </div>
                )}

                {loginMethod === 'phone' ? (
                  <Button
                    type="button"
                    variant="primary"
                    glow
                    onClick={handleSendOtp}
                    className="w-full mt-2 py-3 text-sm font-semibold transition-all duration-300"
                    disabled={isLoading || phone.length < 10}
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP Verification Code'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    glow
                    className="w-full mt-2 py-3 text-sm font-semibold transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Log In'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500 font-sans">
                    Don't have an account yet?{' '}
                    <Link href="/signup" className="text-brand-orange hover:underline font-medium">
                      Register Here
                    </Link>
                  </span>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
