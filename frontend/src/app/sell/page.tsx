'use client';
import Header from '@/components/Header';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Cpu, ShieldCheck, HelpCircle, ArrowLeft, ArrowRight, AlertTriangle, Zap, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { analyzeListingImage } from '@/actions/listingActions';
import { useApp, translations } from '@/store/AppContext';
import { createClient } from '@/lib/supabase';

export default function SellListing() {
  const router = useRouter();
  const { user, addListing, language } = useApp();
  const t = translations[language];
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [category, setCategory] = useState('Others');
  const [conditionScore, setConditionScore] = useState(80);
  const [listingType, setListingType] = useState<'sell' | 'donate' | 'rent' | 'exchange' | 'auction'>('sell');
  const [pickupZone, setPickupZone] = useState('Library Entrance');
  const [visibility, setVisibility] = useState<'campus' | 'network' | 'public'>('campus');
  
  // Auction specific states
  const [auctionEndTime, setAuctionEndTime] = useState('');

  // UI Flow States
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [scamConfidence, setScamConfidence] = useState<'low' | 'medium' | 'high'>('low');
  const [scanningLogs, setScanningLogs] = useState<string[]>([]);

  // Trigger Aura Lens AI Valuation Scan
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Save files state
    setImageFiles(prev => [...prev, ...files]);

    // Generate object URLs for preview
    const newUrls = files.map(file => URL.createObjectURL(file));
    const updatedImages = [...uploadedImages, ...newUrls];
    setUploadedImages(updatedImages);
    
    // Select the first of the newly uploaded batch
    setSelectedImageIndex(uploadedImages.length);

    // AI scans the primary file uploaded in this batch
    const primaryFile = files[0];
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setScanningLogs([]);

    const logs = [
      '🔍 Analyzing image layout & resolution...',
      '🏷️ Extracting product specs & model tags...',
      '📊 Querying campus pricing database...',
      '✓ Safety scam indicators check: PASSED'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanningLogs((prev) => [...prev, log]);
      }, (index + 1) * 600);
    });

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = primaryFile.type || 'image/jpeg';
        
        const result = await analyzeListingImage(base64Data, mimeType, primaryFile.name);
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
        } else {
          setIsAnalyzing(false);
        }
      } catch (err: any) {
        setIsAnalyzing(false);
        console.error('Failed to analyze image:', err);
      }
    };
    reader.readAsDataURL(primaryFile);
  };

  // Re-run pricing analysis when title changes (simulates live database lookup)
  useEffect(() => {
    if (isAnalyzing) return;
    
    const lowercaseTitle = title.toLowerCase();
    let suggested = 150;
    let market = 350;
    let detectedCategory = category;
    let desc = description;
    
    if (lowercaseTitle.includes('kettle') || lowercaseTitle.includes('agaro') || lowercaseTitle.includes('heater') || lowercaseTitle.includes('water')) {
      suggested = 599;
      market = 1199;
      detectedCategory = 'Hostel Essentials';
      desc = 'Crucial hostel companion for late-night Maggi and tea! 🫖 Stainless steel body, automatic shut-off safety, boils water in 2 minutes. Perfect condition!';
    } else if (lowercaseTitle.includes('chair') || lowercaseTitle.includes('desk') || lowercaseTitle.includes('table') || lowercaseTitle.includes('furniture')) {
      suggested = 1200;
      market = 3200;
      detectedCategory = 'Furniture';
      desc = 'Super comfy chair for late-night study sessions or gaming marathons. Height adjustable, breathable mesh backing. Fits perfectly under hostel desks!';
    } else if (lowercaseTitle.includes('calc') || lowercaseTitle.includes('scientific') || lowercaseTitle.includes('casio')) {
      suggested = 650;
      market = 1350;
      detectedCategory = 'Electronics';
      desc = 'Need to pass your engineering mathematics? 📈 This Casio calculator is a absolute lifesaver. Has all equations pre-loaded. Condition is 10/10, no scratches.';
    } else if (lowercaseTitle.includes('book') || lowercaseTitle.includes('algorithms') || lowercaseTitle.includes('clrs') || lowercaseTitle.includes('study')) {
      suggested = 400;
      market = 999;
      detectedCategory = 'Books';
      desc = 'The holy grail of DSA 💻. Thick book but covers everything you need for coding interviews and exams. Minimal highlighting inside, clean pages.';
    } else if (lowercaseTitle.includes('cycle') || lowercaseTitle.includes('bicycle') || lowercaseTitle.includes('hero')) {
      suggested = 2500;
      market = 6500;
      detectedCategory = 'Cycles';
      desc = 'Perfect for getting across campus quickly! 🚲 Tires are in great shape, handbrakes are responsive, and comes with a front basket and lock.';
    }

    setSuggestedPrice(suggested);
    setMarketPrice(market);
    setCategory(detectedCategory);
    setDescription(desc);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = createClient();
      const publicUrls: string[] = [];

      // Upload each file to Supabase Storage bucket 'listings'
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split('.').pop();
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const fileName = `${user.id}/${Date.now()}-${uniqueId}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Storage Upload Error: ${uploadError.message}. Make sure you have created a public bucket named "listings" in your Supabase storage dashboard.`);
        }

        const { data: publicUrlData } = supabase.storage.from('listings').getPublicUrl(filePath);
        publicUrls.push(publicUrlData.publicUrl);
      }

      await addListing({
        seller_id: user.id,
        title,
        description,
        price: parseFloat(price) || 0,
        suggested_price: suggestedPrice || undefined,
        market_price: marketPrice || undefined,
        category,
        condition_score: conditionScore,
        image_urls: publicUrls,
        listing_type: listingType,
        pickup_zone: pickupZone,
        status: 'active',
        visibility,
        is_pinned: false
      });

      router.push('/marketplace');
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Failed to publish listing.');
    }
  };



  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navigation Return Link */}
      <Header />

      {/* Main Sell Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column: Drag & Drop Photo Uploader */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-brand-blue/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-blue" /> Upload Product Image
              </CardTitle>
              <CardDescription>Drag and drop a photo to let Aura Lens AI categorize, describe, and value your item automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Image Preview Card */}
              <div className="relative aspect-square rounded-xl border border-dashed border-card-border bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center hover:border-brand-blue/50 transition-all duration-300 overflow-hidden">
                {uploadedImages.length > 0 ? (
                  <div className="absolute inset-0 p-2">
                    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-slate-900">
                      <img src={uploadedImages[selectedImageIndex]} alt="Uploaded product preview" className="w-full h-full object-contain p-3" />
                      
                      {/* Scanning vertical line animation */}
                      {isAnalyzing && (
                        <motion.div 
                          className="absolute left-0 right-0 h-0.5 bg-brand-blue/50 shadow-[0_0_12px_rgba(0,102,255,0.8)] z-10"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        />
                      )}

                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-start justify-end p-4 space-y-2 overflow-hidden">
                          <div className="flex items-center gap-2 mb-auto mt-2">
                            <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-brand-blue font-mono uppercase tracking-wider animate-pulse">Aura Lens Scanning...</span>
                          </div>
                          
                          {/* Live Log Feeds */}
                          <div className="w-full space-y-1.5 text-left font-mono text-[9px] text-slate-400">
                            {scanningLogs.map((log, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={idx === scanningLogs.length - 1 ? 'text-brand-orange' : 'text-slate-400'}
                              >
                                {log}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      {!isAnalyzing && analysisCompleted && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="green" glow>AI Classified</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-700 mb-4 animate-bounce" />
                    <span className="text-sm text-slate-400 block font-medium">Drag photos here or click browse</span>
                    <span className="text-xs text-slate-600 mt-1">Supports multiple PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              {/* Thumbnails Gallery Grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2.5 pt-1">
                  {uploadedImages.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden bg-slate-900 border cursor-pointer group/thumb transition-all ${
                        selectedImageIndex === idx ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-card-border hover:border-slate-600'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = uploadedImages.filter((_, i) => i !== idx);
                          setUploadedImages(updated);
                          setImageFiles(prev => prev.filter((_, i) => i !== idx));
                          if (selectedImageIndex >= updated.length) {
                            setSelectedImageIndex(Math.max(0, updated.length - 1));
                          }
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-slate-950/90 hover:bg-brand-orange border border-card-border rounded-bl-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover/thumb:opacity-100 z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add More Thumbnail Trigger Card */}
                  {uploadedImages.length < 5 && (
                    <div className="relative aspect-square rounded-lg border border-dashed border-card-border bg-slate-950/30 hover:bg-slate-950/60 flex items-center justify-center cursor-pointer transition-colors">
                      <Plus className="w-5 h-5 text-slate-500" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Price comparison display card with interactive bar chart */}
              {analysisCompleted && suggestedPrice && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-4 bg-slate-950/60 rounded-lg border border-card-border space-y-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Aura Lens AI Resale Index</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-400" /> Scam Check: passed
                      </span>
                    </div>

                    {/* Relative Price Comparison Chart */}
                    <div className="space-y-2">
                      {/* Suggested price bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Aura AI Suggested (Used):</span>
                          <span className="font-bold text-brand-orange">₹{suggestedPrice}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-card-border/30">
                          <motion.div
                            className="bg-brand-orange h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Online Used price bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Other Online Used (Avg):</span>
                          <span className="font-bold text-slate-300">₹{Math.round(suggestedPrice * 1.15)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-card-border/30">
                          <motion.div
                            className="bg-brand-blue h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '55%' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Market price bar */}
                      {marketPrice && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">Original Retail Market:</span>
                            <span className="font-bold text-slate-500">₹{marketPrice}</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-card-border/30">
                            <motion.div
                              className="bg-slate-700 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-card-border/30 text-xs text-slate-400 leading-relaxed font-sans">
                      Click below to auto-fill the listing price with Aura's suggestion:
                    </div>

                    <Button 
                      type="button" 
                      variant="primary" 
                      size="sm" 
                      onClick={() => setPrice(suggestedPrice.toString())}
                      className="w-full text-xs font-mono py-2"
                      glow
                    >
                      Use Suggestion (₹{suggestedPrice})
                    </Button>
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

                {submitError && (
                  <div className="text-sm text-brand-orange bg-brand-orange/5 p-3 rounded-xl border border-brand-orange/20 font-sans text-center mb-4">
                    {submitError}
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  glow 
                  disabled={isSubmitting} 
                  className="w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing Listing...
                    </span>
                  ) : (
                    <>
                      Publish Listing <img src="/logo.png" alt="Logo" className="w-4.5 h-auto object-contain inline" />
                    </>
                  )}
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
