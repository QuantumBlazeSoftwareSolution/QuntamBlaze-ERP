"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface IDChipProps {
  id: string;
  href?: string;
  className?: string;
  size?: "xs" | "sm" | "md";
}

export function IDChip({ id, href, className, size = "sm" }: IDChipProps) {
  const content = (
    <span className={cn(
      "rounded-md bg-white/5 border border-border font-mono font-bold tracking-tight text-text-secondary hover:text-accent hover:border-accent/50 transition-all cursor-pointer inline-flex items-center",
      size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
      className
    )}>
      {id}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
