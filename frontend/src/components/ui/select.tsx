import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className, children, ...props }, ref) => (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-foreground" htmlFor={id}>{label}</label> : null}
      {/* AJUSTE: altura do campo */}
      <select
        ref={ref}
        id={id}
        className={cn(
          "h-11 w-full rounded-[10px] border border-border bg-surface-alt px-4 text-sm text-foreground outline-none transition focus:border-primary",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-sm text-red-500">{error}</p> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  ),
);

Select.displayName = "Select";