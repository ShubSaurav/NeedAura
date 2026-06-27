'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface Step {
  title: string;
  content: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export default function TourGuide() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  
  const steps: Step[] = [
    {
      title: "Welcome to NeedAura! 👋",
      content: "NeedAura is your campus buy & sell marketplace. Let's take a quick 1-minute tour to see how to find local deals, list your items, and chat with other students.",
      selector: "body",
      position: "center"
    },
    {
      title: "1. Find Campus Deals 🔍",
      content: "Use this search bar to instantly find books, scientific calculators, bikes, and hostel appliances listed by students near you.",
      selector: "#tour-search",
      position: "bottom"
    },
    {
      title: "2. Refine Your Feed ⚡",
      content: "Filter items by category or trade type (buy/sell, donations, rental borrows, or student auctions).",
      selector: "#tour-filters",
      position: "right"
    },
    {
      title: "3. Browse Active Listings 🛍️",
      content: "This feed lists all active campus items. Click any listing card to see descriptions, pricing, or start a chat with the seller.",
      selector: "#tour-listings-grid",
      position: "top"
    },
    {
      title: "4. Account & Sign In 👤",
      content: "Log in or sign up to start listing, chatting, and bidding. Click your avatar to manage your active listings and view notifications.",
      selector: "#tour-header-actions",
      position: "bottom"
    }
  ];

  useEffect(() => {
    // Check if user has already completed the tour
    const completed = localStorage.getItem('needaura_tour_completed');
    if (!completed) {
      // Auto-trigger tour after a brief delay
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true);
      setCurrentStep(0);
    };

    window.addEventListener('start-needaura-tour', handleStartTour);
    return () => {
      window.removeEventListener('start-needaura-tour', handleStartTour);
    };
  }, []);

  // Recalculate targeted element coordinates
  useEffect(() => {
    if (!isActive) {
      setCoords(null);
      return;
    }

    const updateCoords = () => {
      const step = steps[currentStep];
      if (step.position === 'center' || step.selector === 'body') {
        setCoords(null);
        return;
      }

      const element = document.querySelector(step.selector);
      if (element) {
        // Element found, scroll into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Wait briefly for scroll to settle, then get bounding rect
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          });
        }, 100);
      } else {
        // If element is not found on current page/screen, default to center of viewport
        setCoords(null);
      }
    };

    updateCoords();

    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords);
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords);
    };
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem('needaura_tour_completed', 'true');
  };

  if (!isActive) return null;

  const current = steps[currentStep];

  // Calculate Popover Position Style
  const getPopoverStyle = () => {
    if (!coords) {
      // Centered layout style
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        width: 'calc(100% - 32px)',
        maxWidth: '420px'
      };
    }

    const { top, left, width, height } = coords;
    const padding = 12;
    const windowWidth = window.innerWidth;
    
    // Default styles
    let popStyle: React.CSSProperties = {
      position: 'absolute' as const,
      zIndex: 99999,
      width: '320px'
    };

    // Responsive offsets depending on requested step position
    if (current.position === 'bottom') {
      popStyle.top = `${top + height + padding}px`;
      popStyle.left = `${Math.max(padding, Math.min(left + (width / 2) - 160, windowWidth - 340))}px`;
    } else if (current.position === 'top') {
      popStyle.top = `${top - 310 - padding}px`; // Estimated popover height
      popStyle.left = `${Math.max(padding, Math.min(left + (width / 2) - 160, windowWidth - 340))}px`;
    } else if (current.position === 'right') {
      popStyle.top = `${top + (height / 2) - 100}px`;
      popStyle.left = `${left + width + padding}px`;
      // Fallback if right screen overflows
      if (left + width + padding + 340 > windowWidth) {
        popStyle.top = `${top + height + padding}px`;
        popStyle.left = `${padding}px`;
      }
    } else if (current.position === 'left') {
      popStyle.top = `${top + (height / 2) - 100}px`;
      popStyle.left = `${left - 340 - padding}px`;
      // Fallback if left screen overflows
      if (left - 340 - padding < 0) {
        popStyle.top = `${top + height + padding}px`;
        popStyle.left = `${padding}px`;
      }
    }

    return popStyle;
  };

  return (
    <div className="relative">
      {/* 1. Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/80 z-[99990] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* 2. Spotlight Cutout Overlay (Dynamic CSS cut shadow) */}
      {coords && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-[99995] rounded-xl border border-brand-blue/60 pointer-events-none shadow-[0_0_0_9999px_rgba(2,6,23,0.75),0_0_20px_rgba(0,102,255,0.4)]"
          style={{
            top: coords.top - 6,
            left: coords.left - 6,
            width: coords.width + 12,
            height: coords.height + 12,
            transition: 'top 0.3s, left 0.3s, width 0.3s, height 0.3s'
          }}
        />
      )}

      {/* 3. Floating Interactive Popover Modal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: coords ? 0 : -30 }}
          animate={{ opacity: 1, scale: 1, y: coords ? 0 : -50 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={getPopoverStyle()}
          className="glass-panel border-brand-blue/30 bg-slate-950/95 p-6 rounded-2xl shadow-2xl flex flex-col space-y-4"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-5 w-auto object-contain shrink-0" />
              {current.title}
            </h3>
            <button 
              onClick={handleSkip}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {current.content}
          </p>

          {/* Footer Controls */}
          <div className="flex justify-between items-center border-t border-card-border/30 pt-4 mt-1">
            {/* Step indicators */}
            <span className="text-[10px] text-slate-500 font-mono">
              Step {currentStep + 1} of {steps.length}
            </span>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip} 
                className="text-[10px] font-mono hover:bg-slate-900 text-slate-400 hover:text-white"
              >
                Skip
              </Button>
              
              {currentStep > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleBack} 
                  className="p-1 px-2.5 h-8 bg-slate-900 hover:bg-slate-800 text-[11px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Back
                </Button>
              )}

              <Button 
                variant="primary" 
                size="sm" 
                glow 
                onClick={handleNext}
                className="p-1 px-3.5 h-8 text-[11px]"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'} 
                {currentStep < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
