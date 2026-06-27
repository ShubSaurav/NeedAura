'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useApp } from '@/store/AppContext';
import { ShieldAlert, CheckCircle, ArrowLeft, ArrowRight, Zap, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase';

export default function Signup() {
  const router = useRouter();
  const { setUser } = useApp();
  
  // Sign up method: 'email' or 'phone'
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [hostel, setHostel] = useState('');
  const [recognizedUniversity, setRecognizedUniversity] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // OTP States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealSupabase, setIsRealSupabase] = useState(false);

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

  // Registered universities for domain checks
  const recognizedDomains: Record<string, string> = {
    'chitkara.edu.in': 'Chitkara University',
    'lpu.in': 'Lovely Professional University (LPU)',
    'cuchd.in': 'Chandigarh University (CU)',
    'iitd.ac.in': 'IIT Delhi',
    'student.cuchd.in': 'Chandigarh University (Student)',
  };

  // Run domain verification check as the user types their email
  useEffect(() => {
    if (!email.includes('@')) {
      setRecognizedUniversity(null);
      return;
    }

    const domain = email.split('@')[1]?.toLowerCase().trim();
    if (!domain) {
      setRecognizedUniversity(null);
      return;
    }

    if (domain in recognizedDomains) {
      setRecognizedUniversity(recognizedDomains[domain]);
    } else {
      setRecognizedUniversity('Personal / General Email');
    }
  }, [email]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log('[Signup] handleSignup triggered. isRealSupabase =', isRealSupabase);
    console.log('[Signup] Payload details:', { email, fullName, branch, hostel });

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        console.log('[Signup] Initiating supabase.auth.signUp...');
        
        // Timeout helper
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out after 15 seconds. Please check your Supabase project status or SMTP configuration.')), 15000)
        );

        const { data, signupError } = await Promise.race([
          supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                branch: branch,
                hostel: hostel || '',
              }
            }
          }).then(res => ({ data: res.data, signupError: res.error })),
          timeoutPromise
        ]) as any;

        console.log('[Signup] supabase.auth.signUp completed. Response:', { data, signupError });

        setIsLoading(false);
        if (signupError) {
          setError(signupError.message);
        } else {
          if (data.session) {
            setUser({
              id: data.user?.id || 'mock-id',
              full_name: fullName,
              email: email,
              branch: branch,
              role: 'student',
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              is_aadhaar_verified: false,
              onboarding_completed: false,
              created_at: data.user?.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            router.push('/marketplace');
          } else {
            setIsRegistered(true);
          }
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'An error occurred during registration.');
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsRegistered(true);
      }, 1000);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!fullName || !password || !branch) {
      setError('Please fill in all required fields (Name, Password, Branch) first.');
      return;
    }
    setError(null);
    setIsRegistered(false);
    setIsLoading(true);

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
        setError(err.message || 'Failed to send OTP.');
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsOtpSent(true);
        setTimer(30);
      }, 1000);
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

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
            // Update profile fields
            const profileUpdates = {
              full_name: fullName,
              branch: branch,
              hostel: hostel || '',
              onboarding_completed: true,
            };
            
            await supabase
              .from('profiles')
              .update(profileUpdates)
              .eq('id', data.user.id);

            setUser({
              id: data.user.id,
              full_name: fullName,
              email: data.user.email || `${phone}@needaura.phone`,
              phone_number: phone,
              branch: branch,
              hostel: hostel || undefined,
              role: 'student',
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              is_aadhaar_verified: false,
              onboarding_completed: true,
              created_at: data.user.created_at,
              updated_at: new Date().toISOString()
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
      setTimeout(() => {
        setIsLoading(false);
        if (otp === '1234' || otp.length === 4) {
          setUser({
            id: 'user-' + Date.now(),
            full_name: fullName,
            email: `${phone}@needaura.phone`,
            phone_number: phone,
            branch: branch,
            hostel: hostel || undefined,
            role: 'student',
            aura_score: 100,
            aura_points: 0,
            is_verified: false,
            is_aadhaar_verified: false,
            onboarding_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          router.push('/marketplace');
        } else {
          setError('Invalid OTP code. Please enter the 4-digit code (Use 1234).');
        }
      }, 1000);
    }
  };

  const handleGoogleSignup = async () => {
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
        setError(err.message || 'Google Auth failed.');
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setUser({
          id: 'google-user-' + Date.now(),
          full_name: 'Google Student',
          email: 'student.google@gmail.com',
          branch: 'Computer Science',
          role: 'student',
          aura_score: 100,
          aura_points: 0,
          is_verified: false,
          is_aadhaar_verified: false,
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        router.push('/marketplace');
      }, 1000);
    }
  };

  // Enable register button if fields are filled out
  const isEmailValid = email.includes('@') && email.split('@')[1]?.length > 2;
  const isPhoneValid = phone.trim().length >= 10;
  const canSubmit = signupMethod === 'email'
    ? !!(isEmailValid && fullName && password && branch)
    : !!(isPhoneValid && fullName && password && branch);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navigation Return Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="border-brand-blue/20 bg-card-dark shadow-[0_0_20px_rgba(0,102,255,0.05)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="NeedAura Logo"
                width={313} height={200} className="h-20 w-auto object-contain"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-display">Create Student Account</CardTitle>
            <CardDescription>Register using your Google account, email, or mobile number to join your campus marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isRealSupabase && (
              <div className="text-[10px] text-brand-orange bg-brand-orange/5 p-2 rounded border border-brand-orange/20 text-center font-mono leading-relaxed mb-4">
                ⚠️ Demo Mode Active. Please configure keys for real SMS OTP.
              </div>
            )}
            {!isRegistered ? (
              <div className="space-y-6">
                
                {/* Google & Switcher (only show if OTP is not yet sent) */}
                {!(signupMethod === 'phone' && isOtpSent) && (
                  <>
                    {/* Google Signup Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGoogleSignup}
                      className="w-full flex items-center justify-center gap-2 border border-card-border bg-slate-900/40 hover:bg-slate-800/60 font-sans py-2.5 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      Sign up with Google (Gmail)
                    </Button>

                    <div className="relative flex items-center justify-center py-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border/40" /></div>
                      <span className="relative px-3 bg-slate-950 text-slate-500 text-[10px] font-mono uppercase">Or register with details</span>
                    </div>

                    {/* Method Switcher Tabs */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-card-border/60 max-w-xs mx-auto">
                      <button
                        type="button"
                        onClick={() => setSignupMethod('email')}
                        className={`py-2 px-3 rounded-lg text-xs font-mono transition-all duration-300 ${
                          signupMethod === 'email'
                            ? 'bg-brand-blue text-white shadow-[0_0_12px_rgba(0,102,255,0.3)] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                        }`}
                      >
                        Email Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupMethod('phone')}
                        className={`py-2 px-3 rounded-lg text-xs font-mono transition-all duration-300 ${
                          signupMethod === 'phone'
                            ? 'bg-brand-blue text-white shadow-[0_0_12px_rgba(0,102,255,0.3)] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                        }`}
                      >
                        Phone Number
                      </button>
                    </div>
                  </>
                )}

                {/* Conditional Signup form rendering */}
                {signupMethod === 'phone' && isOtpSent ? (
                  /* Phone OTP verification form */
                  <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
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
                          maxLength={4}
                          placeholder="e.g. 1234"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          className="text-center text-lg font-bold tracking-[0.5rem] pl-2 max-w-[140px] bg-slate-900/80 border-brand-blue/30 focus:border-brand-blue/70"
                        />
                      </div>
                      <div className="text-xs text-center text-slate-400">
                        Verification code sent to phone <span className="text-white font-mono font-bold">{phone}</span>. <br />
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
                      Verify & Register Account <ArrowRight className="w-4 h-4 ml-1.5" />
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
                        Change Registration Details
                      </button>
                      {timer > 0 ? (
                        <span className="text-slate-500 font-mono">Resend in {timer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSendOtp(e)}
                          className="text-brand-blue hover:underline font-mono"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  /* Standard Email or Phone input details form */
                  <form onSubmit={signupMethod === 'email' ? handleSignup : handleSendOtp} className="space-y-4 pt-2">
                    
                    {signupMethod === 'email' ? (
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
                          className={recognizedUniversity && !recognizedUniversity.includes('Personal') ? 'border-emerald-500/50' : ''}
                        />
                        
                        {recognizedUniversity && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium font-sans">
                              Detected: {recognizedUniversity}
                            </span>
                          </motion.div>
                        )}
                      </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Full Name</label>
                        <Input type="text" placeholder="Shubham Saurav" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Password</label>
                        <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Course / Branch</label>
                        <Input type="text" placeholder="e.g. CSE, ECE, MBA" value={branch} onChange={(e) => setBranch(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Hostel Room (Optional)</label>
                        <Input type="text" placeholder="e.g. Block A, Rm 302" value={hostel} onChange={(e) => setHostel(e.target.value)} />
                      </div>
                    </div>

                    {error && (
                      <div className="text-sm text-brand-orange bg-brand-orange/5 p-3 rounded border border-brand-orange/20 font-sans">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant={canSubmit && !isLoading ? 'primary' : 'secondary'}
                      glow={canSubmit && !isLoading}
                      className="w-full mt-4 py-3 text-sm font-semibold transition-all duration-300"
                      disabled={!canSubmit || isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Registering Account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          {signupMethod === 'phone' ? 'Send OTP Verification Code' : 'Register Account'} <ArrowRight className="w-4 h-4 ml-1.5" />
                        </span>
                      )}
                    </Button>

                    <div className="text-center pt-2">
                      <span className="text-xs text-slate-500 font-sans">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-blue hover:underline font-medium">
                          Log In
                        </Link>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-emerald-400">Successfully Registered!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    A verification link has been sent to your email (**{signupMethod === 'email' ? email : phone}**). After verifying your email, you can log in to your account.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-2 w-full">
                  <Link href="/login">
                    <Button variant="primary" glow className="w-full">
                      Proceed to Log In
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setIsRegistered(false);
                    setIsOtpSent(false);
                  }}>
                    Try another register method
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
