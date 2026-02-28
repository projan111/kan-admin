/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--primary)] bg-gradient-to-b from-[var(--primary)] to-[var(--primary-strong)] px-4 py-1.5 text-white shadow-[0_8px_18px_rgba(15,91,216,0.25)] hover:-translate-y-0.5 hover:brightness-105",
        destructive: "border border-red-300 bg-red-50 px-4 py-1.5 text-red-700 hover:bg-red-100",
        outline: "border border-[var(--line)] bg-white px-4 py-1.5 text-[var(--text)] hover:bg-[var(--surface-soft)]",
        secondary: "border border-transparent bg-[var(--surface-soft)] px-4 py-1.5 text-[var(--text)] hover:bg-[var(--surface-strong)]",
        ghost: "px-4 py-1.5 text-[var(--text)] hover:bg-[var(--surface-soft)]",
        link: "px-1 py-1 text-[var(--primary)] underline-offset-4 hover:underline",
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
