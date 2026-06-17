import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'slate';
  glow?: boolean;
}

export function Badge({
  children,
  variant = 'slate',
  glow = false,
  className = '',
  ...props
}: BadgeProps) {
  // Styles mapping
  const variantStyles = {
    blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
    orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    slate: 'bg-slate-800/40 text-slate-300 border-slate-700/50',
  };

  const glowStyles = glow
    ? variant === 'blue'
      ? 'shadow-[0_0_8px_rgba(0,102,255,0.25)]'
      : variant === 'orange'
      ? 'shadow-[0_0_8px_rgba(255,122,0,0.25)]'
      : variant === 'green'
      ? 'shadow-[0_0_8px_rgba(52,211,153,0.25)]'
      : ''
    : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold font-sans tracking-wide transition-all duration-300
        ${variantStyles[variant]} ${glowStyles} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
