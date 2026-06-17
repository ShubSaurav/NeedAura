'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate login server authentication checks
    setTimeout(() => {
      setIsLoading(false);
      // Hardcode redirection for preview flow
      router.push('/');
    }, 1500);
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
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-brand-blue/20 shadow-[0_0_20px_rgba(0,102,255,0.05)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center">
                Need<span className="text-brand-blue flex items-center">Aura <Zap className="w-4 h-4 ml-1 fill-brand-orange text-brand-orange" /></span>
              </span>
            </div>
            <CardTitle className="text-3xl">Access Campus Portal</CardTitle>
            <CardDescription>Enter your credentials to manage listings, needs, and chat with students.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-blue" /> College Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
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

              {error && (
                <div className="text-sm text-brand-orange bg-brand-orange/5 p-3 rounded border border-brand-orange/20 font-sans">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                glow
                className="w-full mt-2 py-3 text-sm font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying Sessions...' : 'Authenticate'} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 font-sans">
                  New to the campus network?{' '}
                  <Link href="/signup" className="text-brand-orange hover:underline font-medium">
                    Register Account
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
