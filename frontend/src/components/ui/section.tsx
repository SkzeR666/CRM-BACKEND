import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-8 md:py-10", className)} {...props} />;
}