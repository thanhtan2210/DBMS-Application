import { cn } from '@lib/utils';
import * as React from 'react';

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat';
}

export function Card({ children, className, variant = 'elevated', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        variant === 'elevated' ? 'bg-surface-container-lowest shadow-ambient' : 'bg-surface-container-low',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children,
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-linear-to-b from-primary to-primary-container text-on-primary hover:opacity-90',
    secondary: 'bg-secondary text-on-secondary hover:opacity-90',
    tertiary: 'bg-transparent text-primary hover:bg-surface-container',
    outline: 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold'
  };

  return (
    <button
      className={cn(
        'rounded-md transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden flex items-center justify-center gap-2 cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full bg-surface-container-highest rounded-md px-4 py-2 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/40',
        className
      )}
      {...props}
    />
  );
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-surface-container-high text-on-surface-variant'
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap', variants[variant], className)}>
      {children}
    </span>
  );
}

export function Skeleton({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-container-high/50', className)}
      {...props}
    />
  );
}
