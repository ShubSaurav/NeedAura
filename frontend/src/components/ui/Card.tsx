import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowColor?: 'blue' | 'orange' | 'none';
}

export function Card({
  children,
  hoverEffect = true,
  glowColor = 'none',
  className = '',
  ...props
}: CardProps) {
  // Glow outlines
  const glowStyles = {
    none: 'border-card-border',
    blue: 'border-brand-blue/30 shadow-[0_0_15px_rgba(0,102,255,0.1)]',
    orange: 'border-brand-orange/30 shadow-[0_0_15px_rgba(255,122,0,0.1)]',
  };

  return (
    <div
      className={`
        glass-panel rounded-xl overflow-hidden p-6 transition-all duration-300
        ${hoverEffect ? 'glass-panel-hover' : ''}
        ${glowStyles[glowColor]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-bold font-display tracking-tight text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-400 font-sans ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-slate-300 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 flex items-center border-t border-card-border/50 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
