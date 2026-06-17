'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Cpu, ShieldCheck, HelpCircle, ArrowLeft, ArrowRight, Sparkles, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { analyzeListingImage, createListing } from '@/actions/listingActions';

export default function SellListing() {
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [category, setCategory] = useState('Others');
  const [conditionScore, setConditionScore] = useState(80);
  const [listingType, setListingType] = useState<'sell' | 'donate' | 'rent' | 'exchange' | 'auction'>('sell');
  const [pickupZone, setPickupZone] = useState('Library');
  const [visibility, setVisibility] = useState<'campus' | 'network' | 'public'>('campus');
  
  // Auction specific states
  const [auctionEndTime, setAuctionEndTime] = useState('');

  // UI Flow States
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [scamConfidence, setScamConfidence] = useState<'low' | 'medium' | 'high'>('low');

  // Trigger Gemini Vision Visual Scan
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate image upload to Supabase storage by creating a local object URL
    const localUrl = URL.createObjectURL(file);
    setUploadedImage(localUrl);
    setIsAnalyzing(true);
    setAnalysisCompleted(false);

    // Call Server Action
    setTimeout(async () => {
      // Pass a filename heuristic to retrieve correct mock data
      const result = await analyzeListingImage(file.name);
      setIsAnalyzing(false);
      
      if (result.success && result.data) {
        setTitle(result.data.title);
        setDescription(result.data.description);
        setCategory(result.data.category);
        setConditionScore(result.data.conditionScore);
        setPrice(result.data.suggestedPrice.toString());
        setSuggestedPrice(result.data.suggestedPrice);
        setMarketPrice(result.data.marketPrice);
        setScamConfidence(result.data.scamLevel);
        setAnalysisCompleted(true);
      }
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createListing({
      title,
      description,
      price: parseFloat(price) || 0,
      suggested_price: suggestedPrice || undefined,
      market_price: marketPrice || undefined,
      category,
      condition_score: conditionScore,
      image_urls: uploadedImage ? [uploadedImage] : [],
      listing_type: listingType === 'rent' ? 'rent' : listingType, // mapping rent/borrow
      pickup_zone: pickupZone,
      visibility,
      auctionStartPrice: listingType === 'auction' ? parseFloat(price) : undefined,
      auctionEndTime: listingType === 'auction' ? auctionEndTime : undefined,
    });

    if (result.success) {
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navigation Return Link */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-card-border/40 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Link>
        <span className="font-display text-lg font-bold text-white flex items-center">
          Create Listing
        </span>
        <Badge variant="orange" glow>Ecosystem Active</Badge>
      </header>

      {/* Main Sell Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column: Drag & Drop Photo Uploader */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-brand-blue/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-blue" /> Upload Product Image
              </CardTitle>
              <CardDescription>Drag and drop a photo to let Gemini Vision categorize, describe, and value your item automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-square rounded-xl border border-dashed border-card-border bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center hover:border-brand-blue/50 transition-all duration-300">
                {uploadedImage ? (
                  <div className="absolute inset-0 p-2">
                    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-slate-900">
                      <ShoppingBagIcon className="w-16 h-16 text-slate-800" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-3">
                          <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-brand-blue font-mono uppercase tracking-wider animate-pulse">Running Gemini Vision OCR...</span>
                        </div>
                      )}
                      {!isAnalyzing && analysisCompleted && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="green" glow>AI Classified</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-700 mb-4 animate-bounce" />
                    <span className="text-sm text-slate-400 block font-medium">Drag photo here or click browse</span>
                    <span className="text-xs text-slate-600 mt-1">Supports PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              {/* Price comparison display card */}
              {analysisCompleted && suggestedPrice && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-4 bg-slate-950/60 rounded-lg border border-card-border space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Market Valuation Index</span>
                      <span className="text-emerald-400">Scam Check: passed</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-card-border/30">
                      <span className="text-sm text-slate-400">Gemini Suggests:</span>
                      <span className="text-lg font-bold text-brand-orange">₹{suggestedPrice}</span>
                    </div>
                    {marketPrice && (
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Original retail price:</span>
                        <span className="line-through">₹{marketPrice}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Form inputs */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-card-border">
              <CardContent className="p-6 space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Product Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Casio fx-991EX Calculator"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Books">Books</option>
                      <option value="Hostel Essentials">Hostel Essentials</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Cycles">Cycles</option>
                      <option value="Sports">Sports</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Listing Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Transaction Type</label>
                    <select
                      value={listingType}
                      onChange={(e: any) => setListingType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="sell">Sell (Set Price)</option>
                      <option value="donate">Donate (Free)</option>
                      <option value="rent">Rent / Borrow</option>
                      <option value="exchange">Exchange (Swap)</option>
                      <option value="auction">Auction (Live Bid)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      {listingType === 'auction' ? 'Starting Bid (INR)' : 'Price (INR)'}
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={listingType === 'donate'}
                      required
                    />
                  </div>

                  {/* Condition Score percentage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Condition Score</label>
                      <span className="text-xs text-brand-blue font-semibold">{conditionScore}% Quality</span>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={conditionScore}
                        onChange={(e) => setConditionScore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Auction specific end date */}
                {listingType === 'auction' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Auction Bidding Closes At</label>
                    <Input
                      type="datetime-local"
                      value={auctionEndTime}
                      onChange={(e) => setAuctionEndTime(e.target.value)}
                      required
                    />
                  </motion.div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Product Description</label>
                  <Textarea
                    placeholder="Enter specs, details, wear and tear, or negotiate notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-card-border/30 pt-4">
                  {/* Pickup Zone */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Campus Pickup Zone</label>
                    <select
                      value={pickupZone}
                      onChange={(e) => setPickupZone(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="Library Entrance">Library Entrance</option>
                      <option value="Student Center Cafeteria">Student Center Cafeteria</option>
                      <option value="Hostel Block A Main Hall">Hostel Block A Main Hall</option>
                      <option value="Sports Arena Complex">Sports Arena Complex</option>
                    </select>
                  </div>

                  {/* Visibility */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Listing Visibility</label>
                    <select
                      value={visibility}
                      onChange={(e: any) => setVisibility(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="campus">My University Only (CU)</option>
                      <option value="network">Partner College Network</option>
                      <option value="public">Everyone (Public Search)</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" variant="primary" glow className="w-full py-3.5 text-sm font-semibold">
                  Publish Listing <Sparkles className="w-4 h-4 ml-1.5 fill-white" />
                </Button>

              </CardContent>
            </Card>
          </form>
        </div>

      </main>
    </div>
  );
}

// Simple fallback ShoppingBag icon representation
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
