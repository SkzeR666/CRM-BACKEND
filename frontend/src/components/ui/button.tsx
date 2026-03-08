import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary-hover"
          : "border border-border bg-surface-alt text-foreground hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}