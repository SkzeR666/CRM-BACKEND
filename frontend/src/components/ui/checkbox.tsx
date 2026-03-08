import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 text-sm text-foreground" htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn("h-4 w-4 rounded border-border bg-surface-alt", className)}
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  ),
);

Checkbox.displayName = "Checkbox";