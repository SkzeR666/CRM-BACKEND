import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("rounded-[10px] border border-border bg-surface p-5 md:p-6", className)}
      {...props}
    />
  );
}