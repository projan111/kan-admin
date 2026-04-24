/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--primary)] bg-gradient-to-b from-[var(--primary)] to-[var(--primary-strong)] px-4 py-1.5 text-white shadow-[0_8px_18px_rgba(15,91,216,0.22)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:shadow-[0_5px_12px_rgba(15,91,216,0.2)]",
        destructive: "border border-red-200 bg-red-50 px-4 py-1.5 text-red-700 shadow-[0_8px_18px_rgba(207,47,47,0.08)] hover:-translate-y-0.5 hover:bg-red-100 active:translate-y-0",
        outline: "border border-[var(--line)] bg-white px-4 py-1.5 text-[var(--text)] shadow-[0_6px_16px_rgba(15,32,64,0.05)] hover:-translate-y-0.5 hover:bg-[var(--surface-soft)] active:translate-y-0",
        secondary: "border border-transparent bg-[var(--surface-soft)] px-4 py-1.5 text-[var(--text)] hover:-translate-y-0.5 hover:bg-[var(--surface-strong)] active:translate-y-0",
        ghost: "px-4 py-1.5 text-[var(--text)] hover:bg-[var(--surface-soft)] active:bg-[var(--surface-strong)]",
        link: "px-1 py-1 text-[var(--primary)] underline-offset-4 hover:underline",
        contrast: "border border-slate-900 bg-slate-950 px-4 py-1.5 text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-black active:translate-y-0",
      },
      size: {
        default: "h-8",
        sm: "h-7 px-3 text-[11px]",
        lg: "h-9 px-5 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
