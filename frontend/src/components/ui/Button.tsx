'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  glow = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Styles based on variant
  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-hover border-transparent',
    secondary: 'bg-card-dark text-slate-200 border-card-border hover:border-brand-blue/40 hover:bg-slate-900/40',
    accent: 'bg-brand-orange text-white hover:bg-brand-orange-hover border-transparent',
    danger: 'bg-red-600/20 text-red-200 border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50',
    ghost: 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-900/30',
  };

  // Styles based on size
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-md',
    md: 'px-4 py-2.5 text-sm font-medium rounded-lg',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-xl',
  };

  // Glow classes for primary / accent
  const glowStyles = glow
    ? variant === 'primary'
      ? 'animate-pulse-glow-blue'
      : variant === 'accent'
      ? 'animate-pulse-glow-orange'
      : ''
    : '';

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center font-sans tracking-wide border transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-brand-blue/40 disabled:opacity-50 disabled:pointer-events-none
        linear-border ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyles} ${className}
      `}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
