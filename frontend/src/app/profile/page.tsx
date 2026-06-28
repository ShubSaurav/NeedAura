'use client';
import Header from '@/components/Header';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, BookOpen, Clock, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/store/AppContext';

const renderProductVisual = (category: string) => {
  switch (category) {
    case 'Electronics':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-slate-950 to-indigo-950 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.15),transparent_60%)]" />
          <svg className="w-10 h-10 text-brand-blue drop-shadow-[0_0_10px_rgba(0,102,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            <rect x="8" y="5" width="8" height="4" />
            <line x1="8" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="16" y2="12" />
            <line x1="8" y1="15" x2="10" y2="15" />
            <line x1="14" y1="15" x2="16" y2="15" />
          </svg>
        </div>
      );
    case 'Books':
      return (
        <div className="w-full h-full bg-gradient-to-br from-brand-orange/15 via-slate-950 to-orange-950/40 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.12),transparent_60%)]" />
          <svg className="w-10 h-10 text-brand-orange drop-shadow-[0_0_10px_rgba(255,122,0,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
      );
    case 'Cycles':
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 via-slate-950 to-teal-950/40 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)]" />
          <svg className="w-11 h-11 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
        </div>
      );
    case 'Furniture':
      return (
        <div className="w-full h-full bg-gradient-to-br from-amber-600/15 via-slate-950 to-yellow-950/30 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_60%)]" />
          <svg className="w-10 h-10 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11V9a4 4 0 0 1 8 0v2m0 0V9a4 4 0 0 1 8 0v2" />
            <path d="M2 14h20v2H2z" />
            <path d="M4 16v5m16-5v5" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700/15 via-slate-950 to-slate-900/30 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
          <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
      );
  }
};

export default function ProfileDashboard() {
  const { user, listings } = useApp();

  const profile = {
    fullName: user?.full_name || 'Student Member',
    email: user?.email || 'student@campus.edu.in',
    university: user?.university_id === 'uni-1' ? 'Chitkara Campus' : user?.university_id === 'uni-2' ? 'IIT Delhi' : user?.university_id === 'uni-3' ? 'Lovely Professional Campus (LPU)' : 'Chitkara Campus',
    branch: user?.branch || 'Computer Science',
    hostel: user?.hostel || 'Hostel Block A, Room 302',
    memberSince: 'June 2026',
  };

  const myListings = listings.filter(item => item.seller_id === user?.id || item.seller_id === 'current-user-id');

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Header />

      {/* Main Profile Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Student Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-brand-blue/20">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand-blue/50 flex items-center justify-center text-3xl font-bold font-display text-brand-blue overflow-hidden">
                {user?.avatar_url && user.avatar_url.startsWith('data:') ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-display flex items-center justify-center gap-1.5">
                  {profile.fullName}
                </h2>
                <p className="text-slate-400 text-sm">{profile.email}</p>
              </div>

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
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Listing Feed */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Listings Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white font-display">Active Campus Listings</h3>
              <Link href="/sell">
                <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Create Listing</Button>
              </Link>
            </div>

            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myListings.map((listing) => (
                  <Card key={listing.id} className="border-card-border overflow-hidden bg-card-dark flex">
                    <div className="w-24 h-24 bg-slate-950 relative flex items-center justify-center overflow-hidden border-r border-card-border/30 shrink-0">
                      {listing.image_urls && listing.image_urls[0] && !listing.image_urls[0].includes('mock-') ? (
                        <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        renderProductVisual(listing.category)
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-white text-sm truncate">{listing.title}</h4>
                          <Badge variant="blue" className="text-[9px] uppercase font-mono py-0 shrink-0">{listing.listing_type}</Badge>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{listing.category} &bull; {listing.pickup_zone}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold text-brand-orange font-mono">₹{listing.price}</span>
                        <Badge variant={listing.status === 'active' ? 'green' : 'slate'} className="text-[9px] py-0">{listing.status}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-card-border bg-slate-950/20 py-12 text-center flex flex-col items-center justify-center">
                <Package className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-slate-400 text-sm">No active listings created yet.</span>
                <Link href="/sell" className="mt-3">
                  <Button size="sm" variant="secondary">List Your First Item</Button>
                </Link>
              </Card>
            )}
          </div>

        </div>
        
      </main>
    </div>
  );
}
