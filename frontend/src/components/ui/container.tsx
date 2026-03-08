import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-6", className)} {...props} />;
}