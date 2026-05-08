import React from "react";
import { motion } from "motion/react";

/**
 * A pulse skeleton loader for content placeholders.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={`bg-postpurchase-border/30 rounded-lg animate-pulse ${className}`} 
      {...props}
    />
  );
}

/**
 * A standard loading spinner component matching the postpurchase brand.
 */
export function Spinner({ className = "w-6 h-6", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative ${className}`} {...props}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-postpurchase-border opacity-20"
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-t-postpurchase-accent border-r-transparent border-b-transparent border-l-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

/**
 * A skeleton card for product lists.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="aspect-square rounded-[2rem] w-full" />
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-grow pr-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/**
 * A full page loading overlay.
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-12 h-12" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-postpurchase-muted">
          Processing
        </span>
      </div>
    </div>
  );
}
