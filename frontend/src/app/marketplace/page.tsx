'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Sparkles, Cpu, Zap, ShieldCheck, Award, MessageSquare, Plus, ArrowLeft, MapPin, Filter, X, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { fetchListings, placeBid } from '@/actions/listingActions';
import { Listing } from '@shared/types/database';

export default function MarketplaceFeed() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Detail Modal state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidStatus, setBidStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isBidding, setIsBidding] = useState(false);

  const categories = ['Electronics', 'Books', 'Hostel Essentials', 'Furniture', 'Cycles', 'Sports', 'Fashion', 'Others'];
  const listingTypes = [
    { value: 'sell', label: 'Buy/Sell' },
    { value: 'donate', label: 'Donations/Free' },
    { value: 'rent', label: 'Rent/Borrow' },
    { value: 'exchange', label: 'Exchange Swaps' },
    { value: 'auction', label: 'Auctions' }
  ];

  // Fetch listings on load & when filters update
  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      const filters: any = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedType) filters.listingType = selectedType;
      if (searchQuery) filters.searchQuery = searchQuery;

      const result = await fetchListings(filters);
      if (result.success) {
        setListings(result.data);
      }
      setLoading(false);
    }
    loadListings();
  }, [selectedCategory, selectedType, searchQuery]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !bidAmount) return;

    setIsBidding(true);
    setBidStatus(null);

    // Bids must target an auction
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
      // Update local state to reflect new price
      setListings((prev) =>
        prev.map((item) => (item.id === selectedListing.id ? { ...item, price: bidValue } : item))
      );
      setSelectedListing((prev) => (prev ? { ...prev, price: bidValue } : null));
      setBidAmount('');
    } else {
      setBidStatus({ success: false, error: result.error || 'Failed to place bid.' });
    }
  };

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
          <Link href="/needs">
            <Button variant="ghost" size="sm">Needs Feed</Button>
          </Link>
          <Link href="/collaborate">
            <Button variant="ghost" size="sm">Collaborate</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link href="/sell">
            <Button variant="primary" size="sm" className="gap-1.5" glow>
              <Plus className="w-4 h-4" /> List Item
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Interactive Sidebar Filters */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Search Panel */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Search Campus</label>
            <div className="relative">
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
          <div className="space-y-3">
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
        <div className="md:col-span-9 space-y-6">
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
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <motion.div
                  key={listing.id}
                  whileHover={{ y: -4 }}
                  className="glass-panel border-card-border hover:border-brand-blue/30 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[380px] group transition-all duration-300 bg-card-dark"
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
                    </div>
                    
                    {listing.condition_score && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="slate" className="text-[10px] bg-slate-900/90 text-brand-blue font-semibold">
                          {listing.condition_score}% Cond.
                        </Badge>
                      </div>
                    )}
                    
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-card-border flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform duration-300">
                      <Cpu className="w-8 h-8 text-slate-600" />
                    </div>
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
            <div className="border border-dashed border-card-border rounded-2xl p-16 text-center bg-slate-900/10 flex flex-col items-center justify-center">
              <X className="w-12 h-12 text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-300 text-lg">No listings available</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
                We couldn't find any listings matching these categories. Adjust filters or post a listing yourself!
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
                  {/* Detailed Description */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Description</span>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-lg border border-card-border/40">
                      {selectedListing.description}
                    </p>
                  </div>

                  {/* Item Condition Percentage */}
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

                  {/* Gemini Lens Valuation Indicator */}
                  {selectedListing.suggested_price && (
                    <div className="p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/15 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-brand-blue" /> Gemini Vision Resale Check</span>
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
                        SS
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">Shubham Saurav</span>
                        <span className="text-[10px] text-slate-500 font-mono">Chitkara University (CS)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-card-border">
                      <Zap className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                      <span className="text-xs font-bold text-white font-mono">120 Aura</span>
                    </div>
                  </div>

                  {/* Auction bidding form OR chat request */}
                  {selectedListing.listing_type === 'auction' ? (
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
                        <Button variant="primary" glow className="w-full gap-2">
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
    </div>
  );
}
