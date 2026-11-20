// components/misc/page-header.tsx
import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type PageHeaderBadgeVariant =
  | "primary"   // steel grey
  | "secondary" // navy blue
  | "accent"    // knicks orange
  | "outline";

export interface PageHeaderBadge {
  label: string;
  value?: string | number;
  variant?: PageHeaderBadgeVariant;
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: PageHeaderBadge[];
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

const badgeVariantClasses: Record<PageHeaderBadgeVariant, string> = {
  primary: "border-transparent bg-steel text-white",
  secondary: "border-transparent bg-navy text-white",
  accent: "border-transparent bg-knicks text-white",
  outline: "border-steel-300 bg-steel-50 text-steel-900",
};

export function PageHeader({
  eyebrow,
  title,
  description,
  badges,
  actions,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-steel-100 bg-navy text-white",
        className
      )}
    >
      {/* Subtle orange top accent bar */}
      <div className="h-1 w-full bg-knicks" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-10">
        <div className="space-y-3">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-steel-300 transition-colors hover:text-knicks"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          )}

          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-knicks">
              {eyebrow}
            </p>
          )}

          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          )}

          {badges && badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {badges.map((badge, index) => (
                <Badge
                  key={`${badge.label}-${index}`}
                  className={cn(
                    "gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
                    badgeVariantClasses[badge.variant ?? "primary"]
                  )}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                  {badge.value !== undefined && (
                    <span className="ml-0.5 font-mono font-bold">
                      {badge.value}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}