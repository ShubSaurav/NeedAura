'use client';
import Header from '@/components/Header';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck, ShieldAlert, FileText, Check, X, Eye, Users, Zap, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getPendingVerifications, verifyStudentStatus, getFlaggedReports, resolveReport, PendingVerification, FlaggedReport } from '@/actions/adminActions';

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState<'ids' | 'reports' | 'audits'>('ids');
  const [pendingIDs, setPendingIDs] = useState<PendingVerification[]>([]);
  const [reports, setReports] = useState<FlaggedReport[]>([]);
  const [loading, setLoading] = useState(true);

  // ID Modal Detail view
  const [selectedID, setSelectedID] = useState<PendingVerification | null>(null);

  // Audits logs
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 'a1', admin: 'Shubham Saurav (Admin)', action: 'RESOLVE_REPORT', target: 'reports (rep-4)', timestamp: 'Recently', desc: 'Resolved scam report on fake note copies.' },
    { id: 'a2', admin: 'System Trigger', action: 'AUTO_VERIFIED_STUDENT_ID', target: 'profiles (student-5)', timestamp: '1 hour ago', desc: 'Auto-verified CS student ID card using Aura Lens AI OCR.' },
    { id: 'a3', admin: 'Shubham Saurav (Admin)', action: 'APPROVE_STUDENT_ID', target: 'profiles (user-8)', timestamp: '3 hours ago', desc: 'Manually verified hostel student card for Block B.' }
  ]);

  // Load moderation data
  useEffect(() => {
    async function loadModData() {
      setLoading(true);
      if (activeTab === 'ids') {
        const result = await getPendingVerifications();
        if (result.success) setPendingIDs(result.data);
      } else if (activeTab === 'reports') {
        const result = await getFlaggedReports();
        if (result.success) setReports(result.data);
      }
      setLoading(false);
    }
    loadModData();
  }, [activeTab]);

  const handleIDVerification = async (id: string, approve: boolean) => {
    const result = await verifyStudentStatus(id, approve);
    if (result.success) {
      setPendingIDs((prev) => prev.filter((item) => item.id !== id));
      setSelectedID(null);
      // Append to mock audit logs
      setAuditLogs((prev) => [
        {
          id: Math.random().toString(),
          admin: 'Shubham Saurav (Admin)',
          action: approve ? 'APPROVE_STUDENT_ID' : 'REJECT_STUDENT_ID',
          target: `profiles (${id})`,
          timestamp: 'Just now',
          desc: `${approve ? 'Approved' : 'Rejected'} student ID card verification.`
        },
        ...prev
      ]);
    }
  };

  const handleReportAction = async (id: string, action: 'resolve' | 'dismiss') => {
    const result = await resolveReport(id, action);
    if (result.success) {
      setReports((prev) => prev.filter((item) => item.id !== id));
      // Append to mock audit logs
      setAuditLogs((prev) => [
        {
          id: Math.random().toString(),
          admin: 'Shubham Saurav (Admin)',
          action: action === 'resolve' ? 'RESOLVE_REPORT' : 'DISMISS_REPORT',
          target: `reports (${id})`,
          timestamp: 'Just now',
          desc: `${action === 'resolve' ? 'Resolved' : 'Dismissed'} user flagged report.`
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header navbar */}
      <Header />

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Admin Navigation Tabs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-brand-blue" /> Admin Panel
            </h2>
            <p className="text-xs text-slate-500 font-mono">Campus Moderation</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('ids')}
              className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium flex items-center justify-between ${
                activeTab === 'ids' 
                  ? 'border-brand-blue bg-brand-blue/5 text-white shadow-[0_0_15px_rgba(0,102,255,0.05)]' 
                  : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Pending Student ID Cards
              </span>
              {!loading && activeTab !== 'ids' && pendingIDs.length > 0 && (
                <Badge variant="orange" className="text-[9px] px-1 py-0.5">{pendingIDs.length}</Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium flex items-center justify-between ${
                activeTab === 'reports' 
                  ? 'border-brand-blue bg-brand-blue/5 text-white shadow-[0_0_15px_rgba(0,102,255,0.05)]' 
                  : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Flagged Spam & Scams
              </span>
              {!loading && activeTab !== 'reports' && reports.length > 0 && (
                <Badge variant="orange" className="text-[9px] px-1 py-0.5">{reports.length}</Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300 font-medium ${
                activeTab === 'audits' 
                  ? 'border-brand-blue bg-brand-blue/5 text-white shadow-[0_0_15px_rgba(0,102,255,0.05)]' 
                  : 'border-card-border bg-slate-900/10 text-slate-400 hover:text-white hover:border-brand-blue/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Moderator Audit Logs
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Content Feed */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Header Title details */}
          <div className="flex justify-between items-center border-b border-card-border/30 pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                {activeTab === 'ids' && 'Pending Verification Queue'}
                {activeTab === 'reports' && 'User Flagged Action Queue'}
                {activeTab === 'audits' && 'Moderator Activity Audits'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-mono">
                {activeTab === 'ids' && 'Students who have uploaded ID cards. Approve to grant verified badge and +50 Aura points.'}
                {activeTab === 'reports' && 'Scam alerts and spam reports. Suspend or dismiss listings to keep campus secure.'}
                {activeTab === 'audits' && 'Audit traces logging administrator operations to enforce accountability.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {loading && activeTab !== 'audits' ? (
              [1, 2].map((n) => (
                <div key={n} className="h-28 border border-card-border rounded-xl bg-card-dark/40 animate-pulse" />
              ))
            ) : activeTab === 'ids' ? (
              pendingIDs.length > 0 ? (
                pendingIDs.map((id) => (
                  <Card key={id.id} className="border-card-border hover:border-brand-blue/20 transition-colors">
                    <CardContent className="p-5 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h4 className="font-bold text-white text-base font-display">{id.fullName}</h4>
                        <span className="text-xs text-slate-400 block mt-0.5">{id.email}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                          {id.university} &bull; Branch: {id.branch}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => setSelectedID(id)}
                          className="gap-1.5"
                        >
                          <Eye className="w-4 h-4 text-brand-blue" /> Review ID
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleIDVerification(id.id, true)} 
                          className="gap-1" 
                          glow
                        >
                          <Check className="w-4 h-4" /> Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleIDVerification(id.id, false)} 
                          className="hover:bg-rose-950/20 text-rose-400"
                        >
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="border border-dashed border-card-border rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                  <UserCheck className="w-10 h-10 text-slate-700 mb-3" />
                  <h4 className="font-bold text-slate-300">All caught up!</h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    There are no pending student ID uploads left to review in your campus network.
                  </p>
                </div>
              )
            ) : activeTab === 'reports' ? (
              reports.length > 0 ? (
                reports.map((rep) => (
                  <Card key={rep.id} className="border-card-border hover:border-brand-orange/20 transition-colors">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <Badge variant="orange" className="gap-1">
                            <AlertTriangle className="w-3 h-3" /> SCAM FLAG
                          </Badge>
                          <h4 className="font-bold text-white text-base font-display mt-2">
                            Listing: {rep.listingTitle}
                          </h4>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            Reporter: {rep.reporterName} &bull; Accused: {rep.reportedName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Reported recently</span>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-card-border/40 font-mono leading-relaxed">
                        Reason: {rep.reason}
                      </p>

                      <div className="flex gap-2 pt-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleReportAction(rep.id, 'dismiss')}
                          className="text-slate-400 hover:text-white"
                        >
                          Dismiss Flag
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleReportAction(rep.id, 'resolve')}
                          className="bg-rose-500 border-rose-600 hover:bg-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.1)] text-white"
                        >
                          Resolve & Remove Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="border border-dashed border-card-border rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-slate-700 mb-3" />
                  <h4 className="font-bold text-slate-300">Clean security history</h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    No active abuse reports or scam complaints have been submitted by campus members.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-950/40 border border-card-border/50 rounded-xl flex items-center justify-between text-xs flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="blue" className="text-[9px] font-mono py-0.5 px-2">{log.action}</Badge>
                        <span className="font-semibold text-slate-300 font-mono">{log.admin}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-sans">{log.desc}</p>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Target: {log.target} &bull; {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* ID Detail review Overlay Modal */}
      <AnimatePresence>
        {selectedID && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-brand-blue/30 shadow-[0_0_20px_rgba(0,102,255,0.05)] relative overflow-hidden bg-card-dark">
                <button
                  onClick={() => setSelectedID(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-1.5 font-display">
                    <UserCheck className="w-5 h-5 text-brand-blue" /> ID Verification Details
                  </CardTitle>
                  <CardDescription>Review the submitted student ID card image below to ensure details match the registration.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Student ID Card Card Template */}
                  <div className="aspect-[1.6/1] w-full bg-slate-950 border border-card-border/60 rounded-xl relative flex flex-col justify-between p-4 overflow-hidden">
                    {/* Watermark glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-blue/10 blur-[40px] pointer-events-none" />
                    
                    <div className="flex justify-between items-start border-b border-card-border/20 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-brand-blue font-bold tracking-widest block">STUDENT IDENTIFICATION</span>
                        <span className="text-[8px] text-slate-500 font-mono block mt-0.5">{selectedID.university}</span>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-brand-blue" />
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-14 bg-slate-900 border border-card-border rounded flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                        PHOTO
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">{selectedID.fullName}</span>
                        <span className="text-[9px] text-slate-500 block font-mono">Branch: {selectedID.branch}</span>
                        <span className="text-[9px] text-slate-500 block font-mono">ID: CARD-{selectedID.id.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-card-border/20 pt-2 text-[8px] text-slate-500 font-mono">
                      <span>ISSUED 2026 &bull; EXPIRES 2029</span>
                      <span className="text-emerald-400 font-semibold uppercase">OCR MATCH SUCCESS</span>
                    </div>
                  </div>

                  {/* Summary match fields */}
                  <div className="space-y-2 p-3 bg-slate-950/60 rounded-lg border border-card-border/40 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Registered Name:</span>
                      <span className="text-white font-semibold">{selectedID.fullName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Registered Domain:</span>
                      <span className="text-white font-mono">{selectedID.email.split('@')[1]}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleIDVerification(selectedID.id, false)}
                      className="flex-1 text-rose-400 hover:bg-rose-950/20"
                    >
                      Reject Verification
                    </Button>
                    <Button 
                      variant="primary" 
                      glow
                      onClick={() => handleIDVerification(selectedID.id, true)}
                      className="flex-1"
                    >
                      Approve Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
