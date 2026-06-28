'use client';
import Header from '@/components/Header';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  // Testimonials list
  const testimonials = [
    {
      quote: "Needed a scientific calculator for my end-term exam. Found a senior selling it for ₹400 on NeedAura, got it in 15 mins at the library pickup zone. Saved my grade!",
      author: "Rahul Sharma",
      role: "B.Tech CSE, Year 3",
      university: "Chitkara Campus",
      aura: "Verified Student",
      initials: "RS"
    },
    {
      quote: "Sold my second-hand cycle within 2 days of listing. The chat negotiation was super smooth, and we met at the campus cafeteria for the handover.",
      author: "Priya Patel",
      role: "Design & UX, Year 2",
      university: "IIT Delhi",
      aura: "Verified Student",
      initials: "PP"
    },
    {
      quote: "Found all my first-year engineering textbooks in a bundle for cheap. The buyer-seller search and chat interface is extremely clean.",
      author: "Aarav Gupta",
      role: "B.CA, Year 1",
      university: "Chitkara Campus",
      aura: "Verified Student",
      initials: "AG"
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,102,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,102,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-brand-blue/10 blur-[130px] pointer-events-none animate-pulse-glow-blue" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-[130px] pointer-events-none animate-pulse-glow-orange" />

      {/* Navigation Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 relative z-10">
        <section className="py-20 md:py-28 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="blue" glow className="py-1 px-3 flex items-center">
              <img src="/logo.png" alt="Logo" className="h-4.5 w-auto mr-1.5 object-contain" /> Simplest Campus Buy & Sell App
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold font-display tracking-tight leading-[1.05] text-white"
          >
            Your Campus, <br />
            <span className="bg-gradient-to-r from-brand-blue via-purple-500 to-brand-orange bg-clip-text text-transparent">
              Marketplace.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 font-sans max-w-2xl leading-relaxed"
          >
            NeedAura is the easiest way to buy, sell, or exchange items safely with other students in your college.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup">
              <Button variant="primary" size="lg" glow className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" size="lg" className="gap-2 border border-card-border hover:border-brand-blue/30 bg-slate-950/10">
                Browse Marketplace
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Campus Marketplace Feature Cards */}
        <section className="py-20 border-t border-card-border/30 relative">
          <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse-glow-blue" />
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white">Explore Campus Marketplace</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">A secure marketplace built specifically for your college student needs.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="glass-panel border-brand-blue/20 hover:border-brand-blue/35 shadow-[0_0_50px_rgba(0,102,255,0.04)] transition-all duration-500 rounded-3xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-6 space-y-6">
                <Badge variant="blue" glow>BUY & SELL ON CAMPUS</Badge>
                <h3 className="text-3xl md:text-4xl font-bold font-display text-white leading-tight">Buy & Sell Directly with Other Students</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  Buy, sell, rent, borrow, or swap calculators, textbooks, cycles, or hostel appliances inside your campus walls. Save costs, bypass courier charges, and trade safely with peers.
                </p>
                <ul className="space-y-3 text-xs md:text-sm text-slate-300 font-mono">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4.5 h-4.5 text-brand-blue shrink-0" /> Free books donations & item exchanges</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4.5 h-4.5 text-brand-blue shrink-0" /> Simple bidding on popular items</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4.5 h-4.5 text-brand-blue shrink-0" /> Chat directly with buyers & sellers inside the app</li>
                </ul>
                <div className="pt-2">
                  <Link href="/marketplace">
                    <Button variant="primary" size="lg" className="gap-2 font-semibold" glow>
                      Explore Marketplace <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:col-span-6 bg-slate-950/60 p-6 border border-card-border/80 rounded-2xl space-y-4 shadow-2xl">
                <div className="text-[10px] text-slate-500 font-mono border-b border-card-border/30 pb-3 uppercase tracking-wider flex items-center justify-between">
                  <span>POPULAR ITEMS ON YOUR CAMPUS</span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
                <div className="border border-card-border/60 hover:border-brand-blue/30 bg-slate-900/30 p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] duration-300 hover:bg-slate-900/50 cursor-pointer">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm">Casio Scientific Calculator fx-991EX</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Electronics &bull; Library Pickups</span>
                  </div>
                  <Badge variant="blue">₹550</Badge>
                </div>
                <div className="border border-card-border/60 hover:border-emerald-500/30 bg-slate-900/30 p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] duration-300 hover:bg-slate-900/50 cursor-pointer">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm">DBMS Textbook - Korth 6th Edition</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Books &bull; Hostel Block B</span>
                  </div>
                  <Badge variant="green">FREE</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* How It Works Timeline Stepper */}
        <section className="py-20 border-t border-card-border/30">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <Badge variant="blue">EASY 3 STEPS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white">How NeedAura Works</h2>
            <p className="text-slate-400 text-sm">Three easy steps to start listing and buying items on campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="relative p-6 bg-slate-950/20 border border-card-border rounded-2xl flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-bold font-mono">
                1
              </div>
              <h3 className="text-lg font-bold font-display text-white">Quick Signup</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sign up with your email, phone number, or Google account. Instantly start browsing local college deals near you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 bg-slate-950/20 border border-card-border rounded-2xl flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange font-bold font-mono">
                2
              </div>
              <h3 className="text-lg font-bold font-display text-white">List Your Items</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                List your textbooks, calculators, cycles, or hostel appliances. Set your price, select a pickup spot, and list in under a minute.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 bg-slate-950/20 border border-card-border rounded-2xl flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono">
                3
              </div>
              <h3 className="text-lg font-bold font-display text-white">Chat & Trade Safely</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chat directly to agree on a price, meet at a safe spot on campus, and complete your trade.
              </p>
            </div>

          </div>
        </section>

        {/* Student Testimonials */}
        <section className="py-20 border-t border-card-border/30">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <Badge variant="purple">WHAT STUDENTS SAY</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white">Loved by Students</h2>
            <p className="text-slate-400 text-sm">Hear what students in Chitkara Campus and other colleges say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((test, index) => (
              <Card key={index} className="border-card-border bg-card-dark flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-card-border/20 pt-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-brand-blue/30 flex items-center justify-center text-xs font-bold text-brand-blue shrink-0">
                        {test.initials}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">{test.author}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{test.role} &bull; {test.university}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 bg-slate-950 px-2 py-1 rounded border border-card-border text-[9px] font-mono text-brand-orange">
                      <Zap className="w-2.5 h-2.5 fill-brand-orange" /> {test.aura}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action Section */}
        <section className="py-20 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-brand-orange/5 blur-[80px] pointer-events-none" />
          <div className="max-w-4xl mx-auto p-12 bg-slate-950/30 border border-brand-blue/15 rounded-3xl space-y-6 relative z-10 shadow-2xl backdrop-blur-md">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white">Start Buying & Selling on Campus</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Ready to buy, sell, or rent items in your college? Register an account today.
            </p>
            <div className="pt-2 flex justify-center gap-4 flex-wrap">
              <Link href="/signup">
                <Button variant="primary" size="lg" glow className="gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" size="lg" className="gap-2 bg-slate-900/40">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-card-border/40 py-8 bg-bg-darker relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500 font-mono">
            &copy; 2026 NeedAura. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-slate-500 font-mono">
            <span className="hover:text-brand-blue cursor-pointer">Security</span>
            <span className="hover:text-brand-blue cursor-pointer">Terms</span>
            <span className="hover:text-brand-blue cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
