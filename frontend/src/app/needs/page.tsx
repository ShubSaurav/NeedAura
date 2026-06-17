'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Plus, Search, Tag, AlertCircle, CheckCircle, Cpu, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getActiveNeeds, createNeed, findMatchesForNeed } from '@/actions/needActions';

export default function NeedFeed() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modals & Forms
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postBudget, setPostBudget] = useState('');
  const [postCategory, setPostCategory] = useState('Electronics');
  
  // AI Match Drawer States
  const [matchingResults, setMatchingResults] = useState<Record<string, any[]>>({});
  const [loadingMatches, setLoadingMatches] = useState<Record<string, boolean>>({});

  const categories = ['Electronics', 'Books', 'Hostel Essentials', 'Furniture', 'Cycles', 'Sports', 'Fashion'];

  // Load needs feed
  useEffect(() => {
    loadFeed();
  }, [selectedCategory]);

  const loadFeed = async () => {
    const result = await getActiveNeeds(selectedCategory ? { category: selectedCategory } : {});
    if (result.success) {
      setNeeds(result.data);
    }
  };

  const handlePostNeed = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createNeed({
      title: postTitle,
      description: postDescription,
      budget: parseFloat(postBudget) || undefined,
      category: postCategory,
    });

    if (result.success) {
      setIsPostModalOpen(false);
      setPostTitle('');
      setPostDescription('');
      setPostBudget('');
      loadFeed();
    }
  };

  // Run the AI Match Engine for a specific need card
  const handleRunAI_Match = async (needId: string, title: string, category: string) => {
    // Set loading state for this card
    setLoadingMatches((prev) => ({ ...prev, [needId]: true }));

    const result = await findMatchesForNeed(title, category);
    
    setLoadingMatches((prev) => ({ ...prev, [needId]: false }));
    if (result.success) {
      setMatchingResults((prev) => ({ ...prev, [needId]: result.matches }));
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header bar */}
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
          <Link href="/profile">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsPostModalOpen(true)} className="gap-1.5 font-semibold" glow>
            <Plus className="w-4 h-4" /> Request Something
          </Button>
        </div>
      </header>

      {/* Main Needs Feed Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Filter Sidebar */}
        <div className="md:col-span-3 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-blue" /> Categories
            </h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedCategory === null 
                    ? 'border-brand-blue bg-brand-blue/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                }`}
              >
                All Requirements
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                    selectedCategory === cat 
                      ? 'border-brand-blue bg-brand-blue/5 text-white' 
                      : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Needs List */}
        <div className="md:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white font-display">Active Campus Needs</h3>
            <span className="text-xs text-slate-500 font-mono">{needs.length} Active Requests</span>
          </div>

          <div className="space-y-6">
            {needs.map((need) => (
              <Card key={need.id} className="border-card-border">
                <CardContent className="p-6 space-y-4">
                  {/* Student profile details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-brand-blue/30 flex items-center justify-center text-xs font-bold text-brand-blue font-display">
                        {need.studentName ? need.studentName.split(' ').map((n: string) => n[0]).join('') : 'ST'}
                      </div>
                      <div>
                        <span className="font-semibold text-white text-sm block">{need.studentName}</span>
                        <span className="text-xs text-slate-500 font-mono">Posted recently</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="blue">{need.category}</Badge>
                      {need.budget && (
                        <Badge variant="orange" glow>Budget: Under ₹{need.budget}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Need details */}
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white font-display">{need.title}</h4>
                    <p className="text-sm text-slate-400 font-sans leading-relaxed">{need.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-card-border/30 pt-4">
                    {/* Run AI Match button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRunAI_Match(need.id, need.title, need.category)}
                      disabled={loadingMatches[need.id]}
                      className="gap-1.5"
                    >
                      <Cpu className="w-4 h-4 text-brand-blue" />
                      {loadingMatches[need.id] ? 'Running AI Matcher...' : 'Find Matches with AI'}
                    </Button>

                    <Link href={`/chat?listingId=mock-need-${need.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <MessageSquare className="w-4 h-4 text-brand-orange" /> I Have This!
                      </Button>
                    </Link>
                  </div>

                  {/* Collapsible AI Matches drawer */}
                  {loadingMatches[need.id] && (
                    <div className="p-4 rounded-lg border border-dashed border-brand-blue/20 bg-brand-blue/5 flex items-center justify-center space-y-2">
                      <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-xs text-brand-blue font-mono uppercase tracking-wider animate-pulse">Running semantic pgvector search...</span>
                    </div>
                  )}

                  {!loadingMatches[need.id] && matchingResults[need.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                      <div className="p-4 bg-slate-950/60 rounded-lg border border-brand-blue/15 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-brand-blue font-mono uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" /> AI Match Engine Results
                        </div>
                        
                        {matchingResults[need.id].length > 0 ? (
                          <div className="space-y-2 divide-y divide-card-border/30">
                            {matchingResults[need.id].map((match) => (
                              <div key={match.id} className="flex justify-between items-center pt-2 first:pt-0">
                                <div>
                                  <span className="text-xs font-semibold text-white block">{match.title}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">Seller: {match.profiles?.full_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400 font-mono">₹{match.price}</span>
                                  <Link href={`/chat?listingId=${match.id}`}>
                                    <Badge variant="blue" className="cursor-pointer hover:bg-brand-blue/20">Chat Seller</Badge>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 py-1">
                            <AlertCircle className="w-4 h-4 text-slate-600" />
                            No matching items listed on campus yet. We will notify you when a seller lists one.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </CardContent>
              </Card>
            ))}

            {needs.length === 0 && (
              <div className="border border-dashed border-card-border rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 text-slate-700 mb-3" />
                <h4 className="font-bold text-slate-300">No requests found</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  There are no active need requests in this category. Click "Request Something" to share what you are looking for.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Post Need Modal Drawer */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-brand-blue/30 shadow-[0_0_20px_rgba(0,102,255,0.05)]">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-1.5">
                    <Plus className="w-5 h-5 text-brand-blue" /> Request Item/Service
                  </CardTitle>
                  <CardDescription>Post your requirement to trigger notifications for campus sellers matching this category.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostNeed} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Requirement Title</label>
                      <Input
                        placeholder="e.g. Casio fx-991EX Calculator for exams"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Category</label>
                        <select
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Budget (INR)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 500"
                          value={postBudget}
                          onChange={(e) => setPostBudget(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Detailed description</label>
                      <Textarea
                        placeholder="Describe exact condition, specific versions, or when you need it..."
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        required
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" onClick={() => setIsPostModalOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" glow className="flex-1">
                        Post Request
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
