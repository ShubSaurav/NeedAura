'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, CheckCircle, ShieldAlert, Sparkles, Star, UserCheck, MessageSquare, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getUserChats, getMessages, sendMessage } from '@/actions/chatActions';
import { Message } from '@shared/types/database';

export default function ChatPortal() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  
  // Modals / Flow States
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealRating, setDealRating] = useState(5);
  const [dealComment, setDealComment] = useState('');
  const [dealCompleted, setDealCompleted] = useState(false);

  // Quick Chat Suggestions (Gen-Z Fast Replies)
  const quickReplies = [
    'Is the price negotiable?',
    'Can we meet near the Library today?',
    'Deal! Let’s meet at the Student Center.',
  ];

  // Fetch threads on load
  useEffect(() => {
    async function loadThreads() {
      const result = await getUserChats();
      if (result.success) {
        setThreads(result.data);
      }
    }
    loadThreads();
  }, []);

  // Fetch messages when thread selection changes
  useEffect(() => {
    if (!selectedThread) return;

    async function loadMessages() {
      const result = await getMessages(selectedThread.id);
      if (result.success) {
        setMessages(result.data);
      }
    }
    loadMessages();
  }, [selectedThread]);

  const handleSendMessage = async (textToSend: string) => {
    if (!selectedThread || !textToSend.trim()) return;

    // Optimistically update message feed
    const tempMsg: Message = {
      id: Math.random().toString(),
      chat_id: selectedThread.id,
      sender_id: 'current-user-id',
      content: textToSend,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessageText('');

    // Send to server
    await sendMessage(selectedThread.id, textToSend);
  };

  const handleCompleteDeal = () => {
    // Simulate transaction saving & Aura point updates
    setDealCompleted(true);
    setTimeout(() => {
      setIsDealModalOpen(false);
      setDealCompleted(false);
      
      // Remove or mark completed thread
      if (selectedThread) {
        setSelectedThread(null);
      }
    }, 2000);
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
          <Link href="/profile">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Badge variant="blue" glow>1 New Message</Badge>
        </div>
      </header>

      {/* Split Window Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex gap-6 relative z-10 overflow-hidden h-[calc(100vh-90px)]">
        
        {/* Left Side: Threads List */}
        <div className="w-full md:w-80 flex flex-col space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-blue" /> Negotiation Threads
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`
                  glass-panel rounded-xl p-4 cursor-pointer border transition-all duration-300
                  ${selectedThread?.id === thread.id 
                    ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_15px_rgba(0,102,255,0.1)]' 
                    : 'border-card-border hover:border-brand-blue/30'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white text-sm">{thread.otherParticipantName}</span>
                  <Badge variant="slate" className="text-[9px]">Calculators</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 truncate">{thread.latestMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Message Thread View */}
        <div className="flex-1 flex flex-col glass-panel border-card-border rounded-2xl overflow-hidden bg-card-dark">
          {selectedThread ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-card-border/50 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{selectedThread.otherParticipantName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Pickup Zone: Library Entrance</span>
                  </div>
                </div>
                <Button variant="accent" size="sm" onClick={() => setIsDealModalOpen(true)} className="gap-1.5 font-semibold">
                  <UserCheck className="w-4 h-4" /> Complete Deal
                </Button>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isCurrentUser = msg.sender_id === 'current-user-id';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[70%] rounded-2xl px-4 py-2.5 text-sm font-sans
                          ${isCurrentUser 
                            ? 'bg-brand-blue text-white rounded-tr-none' 
                            : 'bg-slate-950/80 text-slate-200 border border-card-border rounded-tl-none'}
                        `}
                      >
                        {msg.content}
                        <span className="block text-[9px] text-slate-400 mt-1 text-right font-mono">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input & Quick Replies Footer */}
              <div className="p-4 border-t border-card-border/50 bg-slate-950/30 space-y-3">
                {/* Gen-Z Quick replies selection */}
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs font-sans text-slate-400 bg-slate-900 border border-card-border/60 hover:border-brand-blue/40 hover:text-white rounded-full px-3 py-1.5 transition-all duration-300"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type negotiation message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(newMessageText)}
                  />
                  <Button variant="primary" onClick={() => handleSendMessage(newMessageText)} className="px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="w-12 h-12 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-400 text-lg">No Thread Selected</h4>
              <p className="text-sm text-slate-600 max-w-sm mt-1">
                Select a student thread from the left menu to coordinate hanovers or negotiate resale pricing.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Complete Deal Modal / review trigger */}
      <AnimatePresence>
        {isDealModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-brand-orange/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-brand-orange" /> Complete Transaction
                  </CardTitle>
                  <CardDescription>Confirming this deal updates transaction logs and recalculates Aura scores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!dealCompleted ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Rate other student</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onClick={() => setDealRating(star)}
                              className={`w-6 h-6 cursor-pointer ${star <= dealRating ? 'text-brand-orange fill-brand-orange' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Deal Feedback</label>
                        <Input
                          placeholder="e.g. Quick exchange, item condition matched description perfectly!"
                          value={dealComment}
                          onChange={(e) => setDealComment(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setIsDealModalOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button variant="accent" onClick={handleCompleteDeal} className="flex-1">
                          Confirm Sale
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 space-y-4 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white">Deal Logged Successfully!</h4>
                        <p className="text-xs text-slate-500">Aura points updated and index entries saved.</p>
                      </div>
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
