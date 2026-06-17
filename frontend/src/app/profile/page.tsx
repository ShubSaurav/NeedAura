'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Award, TrendingUp, Calendar, MapPin, Sparkles, BookOpen, Clock, Heart, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { verifyStudentID } from '@/actions/authActions';

export default function ProfileDashboard() {
  const [isUploadingID, setIsUploadingID] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [auraScore, setAuraScore] = useState(120);
  const [auraPoints, setAuraPoints] = useState(350);

  // Reusable mock profile details
  const profile = {
    fullName: 'Shubham Saurav',
    email: 'shubham.s@chitkara.edu.in',
    university: 'Chitkara University',
    branch: 'Computer Science',
    hostel: 'Block A, Room 302',
    memberSince: 'June 2026',
  };

  // Badges grid mapping
  const badges = [
    { name: 'Verified Member', desc: 'Completed college email and ID verification.', unlocked: true, icon: ShieldCheck, color: 'blue' as const },
    { name: 'Top Seller', desc: 'Completed 10+ listings sales.', unlocked: false, icon: Award, color: 'slate' as const },
    { name: 'Top Donor', desc: 'Donated 5+ academic items for free.', unlocked: true, icon: Heart, color: 'orange' as const },
    { name: 'Campus Helper', desc: 'Responded to 3+ emergency SOS alerts.', unlocked: false, icon: Sparkles, color: 'slate' as const },
  ];

  const handleIDUpload = async () => {
    setIsUploadingID(true);
    // Simulate image upload to storage and Server Action OCR processing
    setTimeout(async () => {
      const result = await verifyStudentID('current-user-id', '/student-id-upload.jpg');
      setIsUploadingID(false);
      if (result.success && result.autoVerified) {
        setVerificationStatus('verified');
        setAuraScore((prev) => prev + 50); // Increment Aura Score for verification
        setAuraPoints((prev) => prev + 50);
      } else {
        setVerificationStatus('pending');
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Profile Header */}
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
          <Link href="/collaborate">
            <Button variant="ghost" size="sm">Collaborate</Button>
          </Link>
          <Link href="/vendors">
            <Button variant="ghost" size="sm">Vendors</Button>
          </Link>
          <Badge variant="blue" glow>Active Session</Badge>
        </div>
      </header>

      {/* Main Profile Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Student Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-brand-blue/20">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand-blue/50 flex items-center justify-center text-3xl font-bold font-display text-brand-blue">
                SS
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-display flex items-center justify-center gap-1.5">
                  {profile.fullName}
                  {verificationStatus === 'verified' && (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  )}
                </h2>
                <p className="text-slate-400 text-sm">{profile.email}</p>
              </div>

              {/* Verified Badge Trigger */}
              {verificationStatus === 'unverified' && (
                <div className="w-full pt-2">
                  <Button variant="secondary" size="sm" onClick={handleIDUpload} className="w-full" disabled={isUploadingID}>
                    {isUploadingID ? 'AI OCR Processing...' : 'Verify Student ID Card'}
                  </Button>
                </div>
              )}
              {verificationStatus === 'pending' && (
                <Badge variant="orange" glow className="py-1 px-4">Verification Pending</Badge>
              )}
              {verificationStatus === 'verified' && (
                <Badge variant="green" glow className="py-1 px-4">Verified Member</Badge>
              )}

              <hr className="w-full border-card-border/50" />

              {/* Sub-details list */}
              <div className="w-full space-y-3 text-sm text-slate-400 text-left">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{profile.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>{profile.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{profile.hostel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Joined {profile.memberSince}</span>
                </div>
              </div>

              <hr className="w-full border-card-border/50" />

              {/* Moderator shortcut */}
              <div className="w-full pt-1">
                <Link href="/moderator" className="w-full block">
                  <Button variant="ghost" size="sm" className="w-full text-xs font-mono text-slate-400 border border-card-border hover:text-white hover:border-brand-blue/30 gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-blue" /> Moderator Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Gamification Stats display */}
          <Card className="border-brand-orange/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-orange" /> Ecosystem Rank
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                <span className="text-xs text-slate-500 block">Aura Score</span>
                <span className="text-2xl font-bold font-display text-brand-orange">{auraScore}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                <span className="text-xs text-slate-500 block">Aura Points</span>
                <span className="text-2xl font-bold font-display text-white">{auraPoints}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Badges & Listing Feed */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Badge Achievements */}
          <div>
            <h3 className="text-xl font-bold text-white font-display mb-4">Aura Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, idx) => {
                const Icon = badge.icon;
                const isUnlocked = badge.unlocked || (badge.name === 'Verified Member' && verificationStatus === 'verified');
                return (
                  <Card key={idx} className={isUnlocked ? 'border-brand-blue/30 bg-slate-900/10' : 'opacity-50 border-card-border'}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg border ${
                        isUnlocked 
                          ? badge.color === 'orange' 
                            ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' 
                            : 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
                          : 'bg-slate-950/60 border-card-border text-slate-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                          {isUnlocked ? (
                            <Badge variant={badge.color} className="text-[10px] py-0 px-1.5">Unlocked</Badge>
                          ) : (
                            <Badge variant="slate" className="text-[10px] py-0 px-1.5">Locked</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{badge.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Active Listings Grid / Empty state preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white font-display">Active Campus Listings</h3>
              <Link href="/sell">
                <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Create Listing</Button>
              </Link>
            </div>

            <div className="border border-dashed border-card-border rounded-xl p-8 text-center bg-slate-900/10 flex flex-col items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-700 mb-3" />
              <h4 className="font-bold text-slate-300">No active listings yet</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                You haven't listed any items, notes, or services yet. Click "Create Listing" to start sharing on your campus.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
