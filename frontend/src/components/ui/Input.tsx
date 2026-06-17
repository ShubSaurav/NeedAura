import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500
          transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium
          focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20
          disabled:cursor-not-allowed disabled:opacity-50 ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={`
          flex min-h-[80px] w-full rounded-md border border-card-border bg-slate-950/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500
          transition-all duration-300 focus:outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20
          disabled:cursor-not-allowed disabled:opacity-50 ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
