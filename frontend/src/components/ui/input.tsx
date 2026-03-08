import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-foreground" htmlFor={id}>{label}</label> : null}
      {/* AJUSTE: altura do campo */}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-11 w-full rounded-[10px] border border-border bg-surface-alt px-4 text-sm text-foreground outline-none transition focus:border-primary",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  ),
);

Input.displayName = "Input";