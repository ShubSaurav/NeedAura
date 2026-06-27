'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Cpu, Zap, ShieldCheck, Award, MessageSquare, Plus, ArrowLeft, MapPin, Filter, X, ChevronRight, HelpCircle, AlertTriangle, CreditCard, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { placeBid } from '@/actions/listingActions';
import { Listing } from '@shared/types/database';
import { useApp, translations } from '@/store/AppContext';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

const renderProductVisual = (category: string) => {
  switch (category) {
    case 'Electronics':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-slate-950 to-indigo-950 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.15),transparent_60%)]" />
          <svg className="w-14 h-14 text-brand-blue drop-shadow-[0_0_10px_rgba(0,102,255,0.4)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            <rect x="8" y="5" width="8" height="4" />
            <line x1="8" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="16" y2="12" />
            <line x1="8" y1="15" x2="10" y2="15" />
            <line x1="14" y1="15" x2="16" y2="15" />
          </svg>
          <span className="text-[9px] font-mono text-brand-blue/80 tracking-widest uppercase mt-2">Electronics Ring</span>
        </div>
      );
    case 'Books':
      return (
        <div className="w-full h-full bg-gradient-to-br from-brand-orange/15 via-slate-950 to-orange-950/40 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.12),transparent_60%)]" />
          <svg className="w-14 h-14 text-brand-orange drop-shadow-[0_0_10px_rgba(255,122,0,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-[9px] font-mono text-brand-orange/80 tracking-widest uppercase mt-2">Study Desk Library</span>
        </div>
      );
    case 'Cycles':
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 via-slate-950 to-teal-950/40 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)]" />
          <svg className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
          <span className="text-[9px] font-mono text-emerald-400/80 tracking-widest uppercase mt-2">Active Mobility</span>
        </div>
      );
    case 'Furniture':
      return (
        <div className="w-full h-full bg-gradient-to-br from-amber-600/15 via-slate-950 to-yellow-950/30 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_60%)]" />
          <svg className="w-14 h-14 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11V9a4 4 0 0 1 8 0v2m0 0V9a4 4 0 0 1 8 0v2" />
            <path d="M2 14h20v2H2z" />
            <path d="M4 16v5m16-5v5" />
          </svg>
          <span className="text-[9px] font-mono text-amber-500/80 tracking-widest uppercase mt-2">Hostel Comfort</span>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700/15 via-slate-950 to-slate-900/30 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
          <svg className="w-14 h-14 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-2">Campus Package</span>
        </div>
      );
  }
};

export default function MarketplaceFeed() {
  const router = useRouter();
  const { listings, boostListing, language, user } = useApp();
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Detail Modal state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidStatus, setBidStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isBidding, setIsBidding] = useState(false);

  // Verification Alert State
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  // Aura Lens AI check state
  const [lensListing, setLensListing] = useState<Listing | null>(null);
  const [isLensScanning, setIsLensScanning] = useState(false);
  const [lensLogs, setLensLogs] = useState<string[]>([]);

  // Payment Boost listing state
  const [boostTarget, setBoostTarget] = useState<Listing | null>(null);
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const categories = ['Electronics', 'Books', 'Hostel Essentials', 'Furniture', 'Cycles', 'Sports', 'Fashion', 'Others'];
  const listingTypes = [
    { value: 'sell', label: 'Buy/Sell' },
    { value: 'donate', label: 'Donations/Free' },
    { value: 'rent', label: 'Rent/Borrow' },
    { value: 'exchange', label: 'Exchange Swaps' },
    { value: 'auction', label: 'Auctions' }
  ];

  // Simulation loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !bidAmount) return;

    setIsBidding(true);
    setBidStatus(null);

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= (selectedListing.price || 0)) {
      setBidStatus({ success: false, error: `Bid must be higher than current price (₹${selectedListing.price})` });
      setIsBidding(false);
      return;
    }

    // Call placing bid action
    const result = await placeBid(selectedListing.id, bidValue);
    setIsBidding(false);

    if (result.success) {
      setBidStatus({ success: true });
      setSelectedListing(prev => (prev ? { ...prev, price: bidValue } : null));
      setBidAmount('');
    } else {
      setBidStatus({ success: false, error: result.error || 'Failed to place bid.' });
    }
  };

  const handleOpenLensCheck = (listing: Listing) => {
    setLensListing(listing);
    setIsLensScanning(true);
    setLensLogs([]);

    const logs = [
      '🔍 Scanning target image layout via Aura Lens AI...',
      '🏷️ Identified brand: CASIO / Book / Cycle specs...',
      '🌐 Indexing Amazon, Flipkart & OLX used databases...',
      '📊 Computing price distribution index...'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setLensLogs(prev => [...prev, log]);
      }, (index + 1) * 450);
    });

    setTimeout(() => {
      setIsLensScanning(false);
    }, 2000);
  };

  const handleStartBoost = (listing: Listing) => {
    setBoostTarget(listing);
    setPaySuccess(false);
    setIsPaying(false);
    setCardNumber('');
  };

  const handleCompletePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      if (boostTarget) {
        boostListing(boostTarget.id);
      }
      setTimeout(() => {
        setBoostTarget(null);
      }, 1500);
    }, 2000);
  };

  // Client side filtering & pinning sort
  const filteredListings = listings.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedType && item.listing_type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query) || false;
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'sell': return 'blue';
      case 'donate': return 'green';
      case 'auction': return 'orange';
      default: return 'slate';
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header navbar */}
      <Header />

      {/* Main Workspace Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Interactive Sidebar Filters */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Search Panel */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Search Campus</label>
            <div id="tour-search" className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Find calculators, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Transaction Type Filters */}
          <div id="tour-filters" className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-brand-blue" /> Trade Filters
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedType(null)}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedType === null 
                    ? 'border-brand-blue bg-brand-blue/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                }`}
              >
                All Listings
              </button>
              {listingTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                    selectedType === type.value 
                      ? 'border-brand-blue bg-brand-blue/5 text-white' 
                      : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-orange" /> Categories
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedCategory === null 
                    ? 'border-brand-orange bg-brand-orange/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-orange/30'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                    selectedCategory === cat 
                      ? 'border-brand-orange bg-brand-orange/5 text-white' 
                      : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-orange/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Active Listings Feed */}
        <div id="tour-listings-grid" className="md:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display text-white">Campus Marketplace</h2>
            <span className="text-xs text-slate-500 font-mono">{listings.length} items active</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 border border-card-border/50 rounded-2xl bg-card-dark/40 animate-pulse flex flex-col p-4 space-y-4">
                  <div className="w-full h-40 bg-slate-950/60 rounded-xl" />
                  <div className="h-4 bg-slate-950/60 rounded w-2/3" />
                  <div className="h-3 bg-slate-950/60 rounded w-1/2" />
                  <div className="h-6 bg-slate-950/60 rounded w-1/4 mt-auto" />
                </div>
              ))}
            </div>
          ) : sortedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  whileHover={{ y: -4 }}
                  className="glass-panel border-card-border hover:border-brand-blue/30 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[380px] group transition-all duration-300 bg-card-dark relative"
                  onClick={() => {
                    setSelectedListing(listing);
                    setBidStatus(null);
                    setBidAmount('');
                  }}
                >
                  {/* Photo area */}
                  <div className="h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-card-border/30">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      <Badge variant={getBadgeVariant(listing.listing_type)} glow>
                        {listing.listing_type.toUpperCase()}
                      </Badge>
                      {listing.is_pinned && (
                        <Badge variant="orange" glow className="gap-1 animate-pulse text-[9px] py-0.5 px-2">
                          <img src="/logo.png" alt="Logo" className="w-3 h-auto object-contain shrink-0" /> PINNED
                        </Badge>
                      )}
                    </div>
                    
                    {listing.condition_score && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="slate" className="text-[10px] bg-slate-900/90 text-brand-blue font-semibold">
                          {listing.condition_score}% Cond.
                        </Badge>
                      </div>
                    )}
                    
                    {listing.image_urls && listing.image_urls[0] && !listing.image_urls[0].includes('mock-') ? (
                      <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      renderProductVisual(listing.category)
                    )}

                    {/* Aura Lens corner button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLensCheck(listing);
                      }}
                      className="absolute bottom-3 right-3 z-20 p-2 bg-slate-900/95 hover:bg-brand-blue border border-card-border hover:border-brand-blue rounded-xl text-brand-blue hover:text-slate-950 transition-all shadow-md group/lens"
                      title="Aura Lens AI Valuation"
                    >
                      <Cpu className="w-4 h-4 group-hover/lens:animate-pulse" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base truncate group-hover:text-brand-blue transition-colors font-display">
                        {listing.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                        <span className="truncate">{listing.pickup_zone}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-card-border/20 pt-3">
                        <span className="text-lg font-bold text-white font-mono">
                          {listing.price === 0 ? 'FREE' : `₹${listing.price}`}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          View details <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-card-border rounded-2xl p-16 text-center bg-slate-950/20 flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 relative flex items-center justify-center mb-2">
                {/* Background glow and rings */}
                <div className="absolute inset-0 rounded-full bg-brand-blue/5 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-brand-blue/10" />
                
                {/* Custom SVG empty state illustration */}
                <svg className="w-20 h-20 text-slate-700 relative z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* Empty Box/crate perspective */}
                  <path d="M50 15 L85 30 L85 70 L50 85 L15 70 L15 30 Z" className="text-slate-800" strokeWidth="1.5" />
                  <path d="M50 15 L50 85" className="text-slate-800" strokeWidth="1.5" />
                  <path d="M15 30 L50 45 L85 30" className="text-slate-800" strokeWidth="1.5" />
                  
                  {/* Floating particles */}
                  <circle cx="28" cy="22" r="1.5" className="text-brand-orange animate-pulse" fill="currentColor" />
                  <circle cx="72" cy="25" r="1.5" className="text-brand-blue animate-pulse" fill="currentColor" />
                  <circle cx="80" cy="62" r="2" className="text-slate-600" />
                  <circle cx="20" cy="65" r="2" className="text-slate-600" />
                  
                  {/* Magnifying Glass looking for items */}
                  <g className="text-brand-blue">
                    <circle cx="50" cy="45" r="12" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <line x1="58.5" y1="53.5" x2="72" y2="67" stroke="currentColor" strokeWidth="3" />
                  </g>
                </svg>
              </div>
              <h4 className="font-bold text-slate-300 text-lg font-display">No Campus Listings Found</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Adjust your category or search filters, or list a new item to start the trading ring in your university today!
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Details & Negotiation Overlay Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card className="border-brand-blue/30 shadow-[0_0_20px_rgba(0,102,255,0.05)] bg-card-dark relative overflow-hidden">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <CardHeader className="pr-12">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(selectedListing.listing_type)} glow>
                      {selectedListing.listing_type.toUpperCase()}
                    </Badge>
                    <Badge variant="blue">{selectedListing.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl mt-2 font-display">{selectedListing.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-slate-500 font-mono text-xs">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" /> Pickup Zone: {selectedListing.pickup_zone}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Description</span>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-lg border border-card-border/40">
                      {selectedListing.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                      <span className="text-xs text-slate-500 block">Condition Check</span>
                      <span className="font-semibold text-brand-blue font-display">{selectedListing.condition_score}% Quality Score</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-lg border border-card-border">
                      <span className="text-xs text-slate-500 block">Price / Starting Bid</span>
                      <span className="font-semibold text-white font-mono">₹{selectedListing.price}</span>
                    </div>
                  </div>

                  {selectedListing.suggested_price && (
                    <div className="p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/15 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-brand-blue" /> Aura Lens AI Valuation Check</span>
                        <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Checked</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-card-border/20">
                        <span className="text-xs text-slate-400">Estimated Resale Price:</span>
                        <span className="text-sm font-bold text-brand-orange">₹{selectedListing.suggested_price}</span>
                      </div>
                      {selectedListing.market_price && (
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span>Original retail market value:</span>
                          <span className="line-through">₹{selectedListing.market_price}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seller trust scoring */}
                  <div className="p-3 bg-slate-900/30 rounded-lg border border-card-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-950 border border-brand-orange/30 flex items-center justify-center text-xs font-bold text-brand-orange">
                        {selectedListing.seller_id === user?.id ? 'ME' : 'SS'}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {selectedListing.seller_id === user?.id ? `${user.full_name} (You)` : 'Shubham Saurav'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Chitkara University (CS)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-card-border">
                      <Zap className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                      <span className="text-xs font-bold text-white font-mono">120 Aura</span>
                    </div>
                  </div>

                  {/* Action forms/buttons */}
                  {selectedListing.seller_id === user?.id || selectedListing.seller_id === 'current-user-id' ? (
                    <div className="border-t border-card-border/30 pt-4 space-y-3">
                      {!selectedListing.is_pinned ? (
                        <div className="p-4 bg-brand-orange/5 border border-brand-orange/15 rounded-2xl space-y-2 text-center">
                          <p className="text-xs font-bold text-white flex justify-center items-center gap-1.5">
                            <img src="/logo.png" alt="Logo" className="w-4.5 h-auto object-contain shrink-0" /> Want to sell 10x faster?
                          </p>
                          <p className="text-[10px] text-slate-400">Pin this listing to the very top of your university marketplace feed.</p>
                          <Button 
                            variant="accent" 
                            glow 
                            size="sm"
                            className="w-full mt-1.5 py-2.5 font-bold"
                            onClick={() => {
                              setSelectedListing(null);
                              handleStartBoost(selectedListing);
                            }}
                          >
                            Boost Listing for ₹99
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-center">
                          <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 font-mono">
                            <img src="/logo.png" alt="Logo" className="w-4.5 h-auto object-contain shrink-0" /> ACTIVE BOOST: PINNED TO TOP
                          </p>
                        </div>
                      )}
                      <Button variant="secondary" onClick={() => setSelectedListing(null)} className="w-full">
                        Close
                      </Button>
                    </div>
                  ) : selectedListing.listing_type === 'auction' ? (
                    <form onSubmit={handlePlaceBid} className="border-t border-card-border/30 pt-4 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder={`Bid higher than ₹${selectedListing.price}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          required
                          disabled={isBidding}
                          className="flex-1"
                        />
                        <Button type="submit" variant="primary" glow disabled={isBidding} className="px-5 font-semibold text-sm">
                          {isBidding ? 'Placing bid...' : 'Place Bid'}
                        </Button>
                      </div>

                      {bidStatus && (
                        <div className={`text-xs font-semibold py-1 px-2.5 rounded ${
                          bidStatus.success ? 'text-emerald-400 bg-emerald-950/20' : 'text-rose-400 bg-rose-950/20'
                        }`}>
                          {bidStatus.success ? 'Success! Bid placed.' : bidStatus.error}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="border-t border-card-border/30 pt-4 flex gap-2">
                      <Button variant="secondary" onClick={() => setSelectedListing(null)} className="flex-1">
                        Close
                      </Button>
                      <Link href={`/chat?listingId=${selectedListing.id}`} className="flex-1">
                        <Button variant="primary" glow className="w-full gap-2 font-semibold">
                          <MessageSquare className="w-4 h-4" /> Start Negotiation
                        </Button>
                      </Link>
                    </div>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Aura Lens AI Comparison Modal */}
      <AnimatePresence>
        {lensListing && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card-dark border border-brand-blue/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setLensListing(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="blue" glow>
                  <Cpu className="w-3.5 h-3.5 mr-1" /> Aura Lens AI Valuation
                </Badge>
                <span className="text-xs text-slate-500 font-mono">Resale Index Check</span>
              </div>

              <h3 className="text-xl font-bold text-white font-display mb-1">{lensListing.title}</h3>
              <p className="text-xs text-slate-400 mb-6">Original Listed Price: ₹{lensListing.price}</p>

              {isLensScanning ? (
                <div className="h-60 border border-card-border bg-slate-950/80 rounded-2xl flex flex-col justify-center items-center p-5 overflow-hidden relative">
                  {/* Pulsing circular radar sweep animation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <div className="w-32 h-32 rounded-full border border-brand-blue/40 animate-ping absolute" style={{ animationDuration: '3s' }} />
                    <div className="w-48 h-48 rounded-full border border-brand-blue/20 animate-ping absolute" style={{ animationDuration: '4s' }} />
                    <div className="w-56 h-56 rounded-full border border-card-border/10 absolute" />
                    <motion.div
                      className="w-48 h-48 rounded-full border-t border-r border-brand-blue/40 absolute"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    />
                  </div>

                  {/* scanning scanner line */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_15px_rgba(0,102,255,0.8)] z-10"
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  />
                  <div className="w-full space-y-1.5 text-left font-mono text-[10px] text-brand-blue/90 z-20 mt-auto">
                    {lensLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Chart representation */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-card-border space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      Pricing Distribution
                    </h4>

                    {/* Comparison Bars */}
                    <div className="space-y-3.5 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Amazon (New):</span>
                          <span className="font-bold text-white">₹{lensListing.market_price || Math.round(lensListing.price * 2.2)}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-card-border/40 relative">
                          <motion.div
                            className="bg-gradient-to-r from-red-600 via-rose-500 to-rose-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Flipkart (New):</span>
                          <span className="font-bold text-white">₹{Math.round((lensListing.market_price || lensListing.price * 2.2) * 0.94)}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-card-border/40 relative">
                          <motion.div
                            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '94%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">OLX Used Average:</span>
                          <span className="font-bold text-white">₹{Math.round(lensListing.price * 1.3)}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-card-border/40 relative">
                          <motion.div
                            className="bg-gradient-to-r from-orange-600 via-brand-orange to-yellow-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '62%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-brand-blue font-semibold">NeedAura (This Listing):</span>
                          <span className="font-bold text-emerald-400">₹{lensListing.price}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-card-border/40 relative">
                          <motion.div
                            className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-300 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '42%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="secondary" onClick={() => setLensListing(null)} className="w-full">
                    Close
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Boost Listing Payment Simulation Modal */}
      <AnimatePresence>
        {boostTarget && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card-dark border border-brand-orange/30 rounded-3xl p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setBoostTarget(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white"
                disabled={isPaying}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="w-6 h-auto object-contain animate-pulse shrink-0" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Pin listing to Top</h3>
                  <p className="text-xs text-slate-400">Increase visibility and sell your items 10x faster.</p>
                </div>
              </div>

              {paySuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Payment Confirmed!</h4>
                    <p className="text-xs text-slate-500">Your listing is now featured at the top of the feed.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 mt-6">
                  {/* Select Payment Method */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-card-border">
                    <button
                      onClick={() => setPayMethod('card')}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium flex justify-center items-center gap-1.5 transition-all ${
                        payMethod === 'card' ? 'bg-slate-900 border border-slate-700 text-white' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Debit/Credit Card
                    </button>
                    <button
                      onClick={() => setPayMethod('upi')}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium flex justify-center items-center gap-1.5 transition-all ${
                        payMethod === 'upi' ? 'bg-slate-900 border border-slate-700 text-white' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> UPI QR Code
                    </button>
                  </div>

                  {payMethod === 'card' ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Card Number</label>
                        <Input
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Expiry</label>
                          <Input placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CVV</label>
                          <Input placeholder="000" type="password" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-white rounded-2xl flex flex-col items-center gap-3">
                      <div className="w-36 h-36 bg-slate-100 border border-slate-200 flex items-center justify-center p-2 rounded-xl">
                        <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Top-Left Finder */}
                          <rect x="5" y="5" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="3" />
                          <rect x="11" y="11" width="14" height="14" rx="2" fill="currentColor" />
                          
                          {/* Top-Right Finder */}
                          <rect x="69" y="5" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="3" />
                          <rect x="75" y="11" width="14" height="14" rx="2" fill="currentColor" />
                          
                          {/* Bottom-Left Finder */}
                          <rect x="5" y="69" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="3" />
                          <rect x="11" y="75" width="14" height="14" rx="2" fill="currentColor" />

                          {/* Alignment Pattern */}
                          <rect x="73" y="73" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
                          <rect x="77" y="77" width="2" height="2" fill="currentColor" />

                          {/* Timing Lines */}
                          <line x1="34" y1="18" x2="66" y2="18" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="18" y1="34" x2="18" y2="66" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />

                          {/* Bits */}
                          <path d="M38,8h4 M44,8h4 M44,12h2 M38,14h6 M48,14h2 M54,8h6 M54,12h4 M54,16h2 M60,14h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M8,38h4 M8,44h6 M14,38h2 M12,48h4 M14,54h6 M8,58h2 M8,62h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          
                          <path d="M38,38h4v4h-4z M46,38h8v4h-8z M38,46h8v8h-8z M50,46h4v4h-4z M58,38h8v4h-8z M58,46h4v8h-4z M66,46h6v4h-6z M38,58h12v4h-12z M54,58h8v12h-8z M66,54h6v8h-6z M38,66h4v8h-4z M46,66h4v4h-4z M70,66h4v4h-4z M82,54h8v4h-8z M86,62h4v8h-4z M78,62h4v4h-4z" fill="currentColor" />
                          
                          {/* Center badge */}
                          <rect x="42" y="42" width="16" height="16" rx="4" fill="#0066FF" />
                          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono font-bold">Scan QR to Pay ₹99 via UPI (PhonePe/GPay/BHIM)</span>
                      <span className="text-[10px] text-slate-500 font-sans font-medium">After scanning, click button below to confirm payment.</span>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    glow
                    className="w-full py-3"
                    disabled={isPaying || (payMethod === 'card' && cardNumber.length !== 16)}
                    onClick={handleCompletePayment}
                  >
                    {isPaying ? 'Confirming payment gateway...' : 'Pay ₹99 & Promote Listing'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Aadhaar Verification Required Alert Dialog */}
      <AnimatePresence>
        {showVerificationAlert && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card-dark border border-brand-orange/30 rounded-3xl p-8 text-center shadow-2xl space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
                  <AlertTriangle className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-white">Verification Required</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Please complete your Aadhaar verification to proceed with negotiations.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link href="/onboarding" className="w-full block">
                  <Button variant="primary" glow className="w-full py-3">
                    Verify Now
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => setShowVerificationAlert(false)} className="w-full">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
