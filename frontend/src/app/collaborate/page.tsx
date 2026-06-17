'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Plus, Award, MessageSquare, Briefcase, Zap, HelpCircle, Code, Palette, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getCollabListings, createCollabListing, CollabItem } from '@/actions/collabActions';

export default function CollaborateHub() {
  const [items, setItems] = useState<CollabItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'skill' | 'team'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Post modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postType, setPostType] = useState<'skill' | 'team'>('skill');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postTags, setPostTags] = useState('');

  const quickTags = ['Figma', 'ReactJS', 'UI Design', 'Python', 'DSA', 'Hackathon', 'React Native', 'Mobile'];

  useEffect(() => {
    async function loadCollab() {
      setLoading(true);
      const filterType = selectedType === 'all' ? undefined : selectedType;
      const result = await getCollabListings(filterType);
      if (result.success) {
        let list = result.data;
        
        // Client side filtering for search & tags
        if (searchQuery) {
          list = list.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedTag) {
          list = list.filter((item) => item.tags.includes(selectedTag));
        }

        setItems(list);
      }
      setLoading(false);
    }
    loadCollab();
  }, [selectedType, searchQuery, selectedTag]);

  const handlePostCollab = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArr = postTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);

    const result = await createCollabListing({
      type: postType,
      title: postTitle,
      description: postDescription,
      tags: tagsArr
    });

    if (result.success) {
      setIsPostModalOpen(false);
      setPostTitle('');
      setPostDescription('');
      setPostTags('');
      
      // Refresh list
      setLoading(true);
      const filterType = selectedType === 'all' ? undefined : selectedType;
      const refResult = await getCollabListings(filterType);
      if (refResult.success) {
        setItems(refResult.data);
      }
      setLoading(false);
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
          <Link href="/needs">
            <Button variant="ghost" size="sm">Needs Feed</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm">Leaderboard</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsPostModalOpen(true)} className="gap-1.5 font-semibold" glow>
            <Plus className="w-4 h-4" /> Post Collaboration
          </Button>
        </div>
      </header>

      {/* Main Workspace grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Collaboration types and tags */}
        <div className="md:col-span-3 space-y-6">
          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-medium">Search Listings</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search skills, hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Section Filters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-blue" /> Channel
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedType('all')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedType === 'all' 
                    ? 'border-brand-blue bg-brand-blue/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                }`}
              >
                All Collaboration
              </button>
              <button
                onClick={() => setSelectedType('skill')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedType === 'skill' 
                    ? 'border-brand-blue bg-brand-blue/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                }`}
              >
                🎓 Peer Skill Swaps
              </button>
              <button
                onClick={() => setSelectedType('team')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedType === 'team' 
                    ? 'border-brand-blue bg-brand-blue/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
                }`}
              >
                🚀 Project Team Finder
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-brand-orange" /> Tech & Skills
            </h3>
            <div className="flex flex-wrap md:flex-col gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                  selectedTag === null 
                    ? 'border-brand-orange bg-brand-orange/5 text-white' 
                    : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-orange/30'
                }`}
              >
                All Skills
              </button>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                    selectedTag === tag 
                      ? 'border-brand-orange bg-brand-orange/5 text-white' 
                      : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-orange/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Listings Feed */}
        <div className="md:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display text-white">Skill Swapping & Team Ups</h2>
            <span className="text-xs text-slate-500 font-mono">{items.length} offers listed</span>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2].map((n) => (
                <div key={n} className="h-44 border border-card-border rounded-xl bg-card-dark/40 animate-pulse p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-950/60 rounded w-1/3" />
                    <div className="h-4 bg-slate-950/60 rounded w-16" />
                  </div>
                  <div className="h-3 bg-slate-950/60 rounded w-2/3" />
                  <div className="h-3 bg-slate-950/60 rounded w-1/2" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((item) => (
                <Card key={item.id} className="border-card-border">
                  <CardContent className="p-6 space-y-4">
                    {/* Top Row: Type and Title */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <Badge variant={item.type === 'skill' ? 'blue' : 'orange'} glow>
                          {item.type === 'skill' ? 'SKILL SWAP' : 'TEAM FINDER'}
                        </Badge>
                        <h3 className="text-lg font-bold text-white font-display mt-1.5">{item.title}</h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Posted recently</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">{item.description}</p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="slate" className="text-[9px] bg-slate-950/50 border-card-border text-slate-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Bottom Row: User trust and connect action */}
                    <div className="flex items-center justify-between border-t border-card-border/30 pt-4 flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-950 border border-brand-orange/30 flex items-center justify-center text-xs font-bold text-brand-orange">
                          {item.ownerName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">{item.ownerName}</span>
                          <div className="flex items-center gap-1 font-mono text-[9px] text-brand-orange">
                            <Zap className="w-2.5 h-2.5 fill-brand-orange" /> {item.ownerAura} Aura Score
                          </div>
                        </div>
                      </div>

                      <Link href={`/chat?listingId=mock-collab-${item.id}`}>
                        <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold">
                          <MessageSquare className="w-4 h-4 text-brand-blue" /> Start Chat
                        </Button>
                      </Link>
                    </div>

                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="border border-dashed border-card-border rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                <Users className="w-10 h-10 text-slate-700 mb-3" />
                <h4 className="font-bold text-slate-300">No collaboration listings found</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  Adjust filters or click "Post Collaboration" to swap skills or hire hackathon teammates.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Post Modal Drawer */}
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
                    <Plus className="w-5 h-5 text-brand-blue" /> Create Collaboration Post
                  </CardTitle>
                  <CardDescription>Advertise your skills to swap with other peers, or invite members to join your hackathon project.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostCollab} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-1 rounded-lg border border-card-border/60">
                      <button
                        type="button"
                        onClick={() => setPostType('skill')}
                        className={`py-2 rounded text-xs font-mono font-medium transition-all ${
                          postType === 'skill' ? 'bg-brand-blue/10 text-white border border-brand-blue/20' : 'text-slate-400'
                        }`}
                      >
                        🎓 Skill Swap
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostType('team')}
                        className={`py-2 rounded text-xs font-mono font-medium transition-all ${
                          postType === 'team' ? 'bg-brand-blue/10 text-white border border-brand-blue/20' : 'text-slate-400'
                        }`}
                      >
                        🚀 Team Finder
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Listing Title</label>
                      <Input
                        placeholder={postType === 'skill' ? 'e.g. Teaching ReactJS for Python practice' : 'e.g. Need mobile app developer for Hackathon'}
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Skill tags (comma separated)</label>
                      <Input
                        placeholder="e.g. React, Figma, Python, DSA"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Description Details</label>
                      <Textarea
                        placeholder="Detail exactly what you offer, what you seek, project scopes, or timelines..."
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
                        Post Advertisement
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
