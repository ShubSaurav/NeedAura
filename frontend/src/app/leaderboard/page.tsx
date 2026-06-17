'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, Trophy, Heart, Sparkles, Building, Bookmark, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fetchLeaderboard } from '@/actions/authActions';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [groupBy, setGroupBy] = useState<'university' | 'branch' | 'hostel'>('university');
  const [loading, setLoading] = useState(true);

  // Fetch ranking data
  useEffect(() => {
    async function loadRankings() {
      setLoading(true);
      const result = await fetchLeaderboard(groupBy);
      if (result.success) {
        setLeaderboard(result.data);
      }
      setLoading(false);
    }
    loadRankings();
  }, [groupBy]);

  // Points breakdown documentation
  const scoringRules = [
    { action: 'Student ID Verification', points: '+50 Aura', desc: 'Proof of campus enrollment verified by AI.' },
    { action: 'Academic Item Donation', points: '+30 Aura', desc: 'Listing and giving away tools/books for free.' },
    { action: 'Responding to SOS Alert', points: '+40 Aura', desc: 'Helping a student in urgent need.' },
    { action: 'Positive Review Received', points: '+15 Aura', desc: 'Receiving a positive rating after trade handover.' },
    { action: 'Successful Listing Sale', points: '+10 Aura', desc: 'Completing a buyout or auction exchange.' }
  ];

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-card-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NeedAura Logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">Marketplace</Button>
          </Link>
          <Link href="/needs">
            <Button variant="ghost" size="sm">Needs Feed</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Leaderboard Standings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-8 h-8 text-brand-orange" /> Aura Leaderboard
            </h2>
            <p className="text-slate-400 text-sm">
              Verify your student status and trade fairly to earn Aura points. Standout contributors unlock premium campus badges.
            </p>
          </div>

          {/* Group Tabs Selection */}
          <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-card-border/60 max-w-md">
            <button
              onClick={() => setGroupBy('university')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                groupBy === 'university' 
                  ? 'bg-brand-blue/10 border border-brand-blue/20 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              University Wide
            </button>
            <button
              onClick={() => setGroupBy('branch')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                groupBy === 'branch' 
                  ? 'bg-brand-blue/10 border border-brand-blue/20 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Branch (CS)
            </button>
            <button
              onClick={() => setGroupBy('hostel')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                groupBy === 'hostel' 
                  ? 'bg-brand-blue/10 border border-brand-blue/20 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Hostel Hall
            </button>
          </div>

          {/* Leaderboard Rankings List */}
          <Card className="border-card-border overflow-hidden">
            <CardContent className="p-0 divide-y divide-card-border/30">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="p-6 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-slate-950/60 rounded" />
                      <div className="w-10 h-10 bg-slate-950/60 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-950/60 rounded w-28" />
                        <div className="h-3 bg-slate-950/60 rounded w-20" />
                      </div>
                    </div>
                    <div className="h-6 bg-slate-950/60 rounded w-16" />
                  </div>
                ))
              ) : leaderboard.length > 0 ? (
                leaderboard.map((student, idx) => (
                  <div 
                    key={student.id} 
                    className={`p-5 flex items-center justify-between hover:bg-slate-900/10 transition-colors duration-300 ${
                      idx === 0 ? 'bg-brand-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Indicator */}
                      <span className="w-8 text-center text-sm font-mono font-bold text-slate-500">
                        {getRankEmoji(idx)}
                      </span>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-950 border border-card-border/60 flex items-center justify-center text-sm font-bold text-brand-blue">
                        {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>

                      {/* Name Details */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-sm font-display">{student.full_name}</span>
                          {student.is_verified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {student.branch} &bull; {student.hostel || 'Hosteller'}
                        </span>
                      </div>
                    </div>

                    {/* Aura Score details */}
                    <div className="flex items-center gap-6">
                      {/* Badges Earned */}
                      <div className="hidden sm:flex items-center gap-1.5">
                        {student.is_verified && (
                          <Badge variant="blue" className="text-[9px] py-0.5 px-2">Verified</Badge>
                        )}
                        {student.aura_score >= 200 && (
                          <Badge variant="orange" className="text-[9px] py-0.5 px-2 gap-0.5">
                            <Award className="w-2.5 h-2.5" /> Top Seller
                          </Badge>
                        )}
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-1 bg-slate-950 px-3 py-2 rounded-xl border border-card-border">
                        <Zap className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                        <span className="text-sm font-bold text-white font-mono">{student.aura_score}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 font-mono">
                  No rankings found. Start trading to get ranked!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Scoring Guidelines & Calculations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Points Manual Card */}
          <Card className="border-brand-blue/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" /> How Aura Works
              </CardTitle>
              <CardDescription>Aura trust is built on positive campus interactions. Here is how your score accumulates:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {scoringRules.map((rule, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed border-b border-card-border/20 last:border-b-0 pb-3.5 last:pb-0">
                  <div className="w-5 h-5 rounded-full bg-slate-950 border border-card-border flex items-center justify-center text-[10px] text-brand-blue font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-white">{rule.action}</span>
                      <span className="font-mono font-bold text-brand-orange">{rule.points}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-sans">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Badges Showcase card */}
          <Card className="border-card-border bg-card-dark/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-blue" /> Campus Badges
              </CardTitle>
              <CardDescription>Complete challenges to unlock badges and display them on your public profile card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-8 h-8 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-xs font-display">Verified Member</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">Unlocks by uploading Student ID and confirming email domain.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-card-border/20 pt-3">
                <Heart className="w-8 h-8 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-xs font-display">Top Donor</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">Unlocks by donating 5 or more academic tools/notes for free.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-card-border/20 pt-3">
                <Sparkles className="w-8 h-8 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-xs font-display">Campus Helper</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">Unlocks by responding to 3 or more SOS needs listed by peers.</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </main>
    </div>
  );
}
