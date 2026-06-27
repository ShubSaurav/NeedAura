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
    blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    red: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    slate: 'bg-slate-900/60 text-slate-300 border-card-border',
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
