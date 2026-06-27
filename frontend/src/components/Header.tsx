'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp, translations } from '@/store/AppContext';
import { Sun, Moon, Bell, ShieldCheck, LogOut, Globe, User, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function Header() {
  const {
    user,
    language,
    theme,
    notifications,
    setLanguage,
    setTheme,
    markNotificationsAsRead,
    setUser
  } = useApp();

  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageSelect = (lang: 'en' | 'hi' | 'es') => {
    setLanguage(lang);
    setShowLanguages(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <header className="w-full border-b border-card-border/40 bg-bg-darker/60 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left: Branding Logo */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NeedAura Logo"
              width={250}
              height={160}
              className="h-16 w-auto object-contain hover:scale-[1.02] transition-transform"
              priority
            />
          </Link>

          {user && user.onboarding_completed && (
            <Badge variant="blue" className="hidden md:flex items-center gap-1 py-0.5 px-2 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
              {user.university_id === 'uni-1' ? 'Chitkara' : user.university_id === 'uni-2' ? 'IIT Delhi' : 'LPU'}
            </Badge>
          )}
        </div>

        {/* Center/Right: Navigation Links */}
        <div className="flex items-center gap-3">
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            <Link href="/marketplace">
              <Button variant="ghost" size="sm" className="font-sans font-medium text-xs">
                {t.marketplace}
              </Button>
            </Link>
            {user && (
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="font-sans font-medium text-xs">
                  {t.dashboard}
                </Button>
              </Link>
            )}
          </div>

          {/* Theme Switcher Icon */}
          <button
            onClick={handleToggleTheme}
            className="p-2 bg-slate-900/40 border border-card-border hover:border-brand-blue/30 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-brand-orange" /> : <Moon className="w-4 h-4 text-brand-blue" />}
          </button>

          {/* Take Tour Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('start-needaura-tour'))}
            className="p-2 bg-slate-900/40 border border-card-border hover:border-brand-blue/30 rounded-xl text-slate-400 hover:text-white flex items-center gap-1 transition-all"
            title="Take Onboarding Tour"
          >
            <HelpCircle className="w-4 h-4 text-brand-blue" />
            <span className="text-[10px] font-mono font-bold uppercase hidden md:inline">Tour</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLanguages(!showLanguages);
                setShowNotifications(false);
              }}
              className="p-2 bg-slate-900/40 border border-card-border hover:border-brand-blue/30 rounded-xl text-slate-400 hover:text-white flex items-center gap-1 transition-all"
              title="Select Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase">{language}</span>
            </button>

            {showLanguages && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-card-border rounded-xl shadow-2xl py-1 z-50">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'es', label: 'Español' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code as any)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-900/80 text-xs font-sans text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-brand-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell (Only for logged in) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLanguages(false);
                  if (!showNotifications) markNotificationsAsRead();
                }}
                className="p-2 bg-slate-900/40 border border-card-border hover:border-brand-blue/30 rounded-xl text-slate-400 hover:text-white relative transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-slate-950 text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 flex flex-col">
                  <div className="p-3 border-b border-card-border/40 font-mono text-[10px] text-slate-500 flex justify-between items-center">
                    <span>{t.notifications.toUpperCase()}</span>
                    <span>{notifications.length} Alerts</span>
                  </div>
                  <div className="overflow-y-auto divide-y divide-card-border/20 flex-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3.5 hover:bg-slate-900/40 space-y-1">
                          <span className="font-bold text-white text-xs font-sans block">{n.title}</span>
                          <p className="text-slate-400 text-[10px] leading-relaxed font-sans">{n.body}</p>
                          <span className="text-[8px] text-slate-600 font-mono block">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-600 font-mono text-xs">
                        {t.noNotifications}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sign In / Avatar Actions */}
          <div id="tour-header-actions" className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/profile">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-brand-blue/30 flex items-center justify-center text-xs font-bold text-brand-blue hover:border-brand-blue hover:scale-105 transition-all cursor-pointer">
                    {user.avatar_url && user.avatar_url.startsWith('data:') ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-xl transition-all"
                  title={t.signOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs">{t.login}</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" glow className="text-xs">{t.joinEcosystem}</Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
