'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, ShoppingBag, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [isLensSimulating, setIsLensSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<any>(null);

  const universities = [
    { name: 'Chitkara University', domain: 'chitkara.edu.in' },
    { name: 'Lovely Professional University (LPU)', domain: 'lpu.in' },
    { name: 'Chandigarh University (CU)', domain: 'cuchd.in' },
    { name: 'IIT Delhi', domain: 'iitd.ac.in' },
  ];

  // Simulates the Google Lens Price Check feature on the landing page
  const handleLensSimulation = () => {
    setIsLensSimulating(true);
    setSimulatedResult(null);
    setTimeout(() => {
      setIsLensSimulating(false);
      setSimulatedResult({
        title: 'Casio fx-991EX Calculator',
        category: 'Electronics',
        condition: '95% (Like New)',
        suggested: '₹600',
        market: '₹1,250',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk Grid Gridline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-card-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="NeedAura Logo"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" glow>Join Ecosystem</Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center relative z-10">
        
        {/* Glow Element */}
        <div className="absolute top-20 w-[400px] h-[400px] rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl flex flex-col items-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="blue" glow className="py-1 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Exclusively for Verified Students
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-none text-white"
          >
            Your Campus, <br />
            <span className="bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">
              Supercharged.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 font-sans max-w-2xl"
          >
            NeedAura is the AI-powered student super app. Buy, sell, exchange, rent, borrow, or request items inside a trusted, university-locked network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup">
              <Button variant="primary" size="lg" glow className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={handleLensSimulation} className="gap-2">
              <Cpu className="w-4 h-4 text-brand-orange" /> Try AI Price Lens
            </Button>
          </motion.div>
        </div>

        {/* AI Lens Interactive Preview Card */}
        <div className="w-full max-w-4xl mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Simulation Controller */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-display text-white">Google Lens Price Check</h2>
                <p className="text-slate-400 text-sm">
                  Upload any photo. Our Server-side Gemini Vision scans details, evaluates condition, and returns marketplace estimates instantly.
                </p>
              </div>

              <Card className="border-brand-blue/20">
                <CardContent className="p-4 space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-card-border/50 bg-slate-950 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-slate-700" />
                    {isLensSimulating && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-3">
                        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-brand-blue font-mono">Gemini Vision Scanning...</span>
                      </div>
                    )}
                    {simulatedResult && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                        <Badge variant="blue" glow className="absolute top-2 right-2">Scan Successful</Badge>
                        <span className="text-slate-300 font-medium text-center px-4 font-mono text-xs bg-slate-950/80 py-2 rounded border border-card-border">
                          Found: {simulatedResult.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleLensSimulation} className="w-full" disabled={isLensSimulating}>
                    {isLensSimulating ? 'Processing...' : 'Upload Mock Listing Image'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Simulation Results Display */}
            <div className="md:col-span-7">
              {simulatedResult ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <Card className="border-brand-orange/30 shadow-[0_0_20px_rgba(255,122,0,0.05)]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="orange" glow>AI Match Engine</Badge>
                        <span className="text-xs text-slate-500 font-mono">Resale Index: 92%</span>
                      </div>
                      <CardTitle className="mt-2 text-2xl">{simulatedResult.title}</CardTitle>
                      <CardDescription>Estimated category: {simulatedResult.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                          <span className="text-xs text-slate-500 block">Condition Check</span>
                          <span className="font-semibold text-white">{simulatedResult.condition}</span>
                        </div>
                        <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                          <span className="text-xs text-slate-500 block">Suggested Price</span>
                          <span className="font-semibold text-brand-orange">{simulatedResult.suggested}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/20 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Online Retail Market Value:</span>
                        <span className="font-bold text-white line-through text-slate-400">{simulatedResult.market}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-60 border border-dashed border-card-border rounded-xl flex flex-col items-center justify-center p-6 text-center bg-slate-900/10">
                  <Cpu className="w-8 h-8 text-slate-600 mb-3" />
                  <span className="text-slate-400 font-medium">Click "Try AI Price Lens" or Upload Mock Image</span>
                  <span className="text-slate-600 text-xs mt-1">Simulates visual analysis and suggestions.</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-36 w-full">
          <Card>
            <CardHeader>
              <ShieldCheck className="w-8 h-8 text-brand-blue mb-2" />
              <CardTitle>University Email Lock</CardTitle>
              <CardDescription>Hyperlocal campus security.</CardDescription>
            </CardHeader>
            <CardContent>
              Signups are verified against campus domains. Students upload ID cards to prove enrollment before trading.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-brand-orange mb-2" />
              <CardTitle>Aura Scores & Badges</CardTitle>
              <CardDescription>Gamified campus trust.</CardDescription>
            </CardHeader>
            <CardContent>
              Earn points for donations, reviews, and helping in emergency SOS alerts. Unlocks leaderboard spots and Top Contributor badges.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Complete Support Feed</CardTitle>
              <CardDescription>Beyond simple trading.</CardDescription>
            </CardHeader>
            <CardContent>
              Lost & Found portals, skill swaps, roommate matching, team finders, and local vendor pre-ordering all in one super app.
            </CardContent>
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-card-border/40 py-8 bg-bg-darker">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500 font-mono">
            &copy; 2026 NeedAura. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-slate-500 font-mono">
            <span className="hover:text-brand-blue cursor-pointer">Security</span>
            <span className="hover:text-brand-blue cursor-pointer">Terms</span>
            <span className="hover:text-brand-blue cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
