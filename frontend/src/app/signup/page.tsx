'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [hostel, setHostel] = useState('');
  const [recognizedUniversity, setRecognizedUniversity] = useState<string | null>(null);
  const [isDomainInvalid, setIsDomainInvalid] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

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
      setIsDomainInvalid(false);
      return;
    }

    const domain = email.split('@')[1]?.toLowerCase().trim();
    if (!domain) {
      setRecognizedUniversity(null);
      setIsDomainInvalid(false);
      return;
    }

    if (domain in recognizedDomains) {
      setRecognizedUniversity(recognizedDomains[domain]);
      setIsDomainInvalid(false);
    } else {
      setRecognizedUniversity(null);
      setIsDomainInvalid(true);
    }
  }, [email]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recognizedUniversity) return;

    // Simulate Server Action registration call
    setIsRegistered(true);
  };

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
        <Card className="border-brand-blue/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center">
                Need<span className="text-brand-blue flex items-center">Aura <Zap className="w-4 h-4 ml-1 fill-brand-orange text-brand-orange" /></span>
              </span>
            </div>
            <CardTitle className="text-3xl">Create Student Account</CardTitle>
            <CardDescription>Enter your official university email domain to join your campus ecosystem.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isRegistered ? (
              <form onSubmit={handleSignup} className="space-y-6">
                
                {/* Email Input & Domain Indicator */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Official College Email</label>
                  <Input
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={recognizedUniversity ? 'border-emerald-500/50' : isDomainInvalid ? 'border-brand-orange/50' : ''}
                  />
                  
                  {/* Dynamic verification feedback tags */}
                  {recognizedUniversity && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium font-sans">
                        Locked to: {recognizedUniversity}
                      </span>
                    </motion.div>
                  )}
                  {isDomainInvalid && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-2">
                      <ShieldAlert className="w-4 h-4 text-brand-orange" />
                      <span className="text-xs text-brand-orange font-medium font-sans">
                        Unrecognized campus domain. Locked environment.
                      </span>
                    </motion.div>
                  )}
                </div>

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
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Academic Branch</label>
                    <Input type="text" placeholder="e.g. CSE, ECE, MBA" value={branch} onChange={(e) => setBranch(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Hostel Room (Optional)</label>
                    <Input type="text" placeholder="e.g. Block A, Rm 302" value={hostel} onChange={(e) => setHostel(e.target.value)} />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={recognizedUniversity ? 'primary' : 'secondary'}
                  glow={!!recognizedUniversity}
                  className="w-full mt-4 py-3 text-sm font-semibold"
                  disabled={!recognizedUniversity}
                >
                  Verify and Register <ArrowRight className="w-4 h-4 ml-1.5" />
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
                  <h3 className="text-2xl font-bold font-display text-white">Verification Link Sent</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    We have dispatched a verification link to **{email}**. Please click the link to confirm your enrollment and activate your account.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-2 w-full">
                  <Link href="/login">
                    <Button variant="primary" glow className="w-full">
                      Proceed to Log In
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setIsRegistered(false)}>
                    Try another email address
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
