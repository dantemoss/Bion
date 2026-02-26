"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MenuProps {
  children: ReactNode;
  setActive: (value: string | null) => void;
}

export function Menu({ children }: MenuProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-zinc-300 shadow-lg backdrop-blur-md"
      )}
    >
      {children}
    </nav>
  );
}

interface MenuItemProps {
  item: string;
  active: string | null;
  setActive: (value: string | null) => void;
  href?: string;
  children?: ReactNode;
}

export function MenuItem({
  item,
  active,
  setActive,
  href,
  children,
}: MenuItemProps) {
  const isActive = active === item;

  return (
    <div
      className="relative"
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)}
    >
      <Link
        href={href ?? "#"}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
          isActive
            ? "bg-white/15 text-zinc-50"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
        )}
      >
        {item}
      </Link>

      {children && isActive && (
        <div className="absolute left-1/2 top-full z-40 mt-3 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-black/80 p-4 text-xs text-zinc-200 shadow-xl backdrop-blur-xl">
          {children}
        </div>
      )}
    </div>
  );
}

interface HoveredLinkProps {
  href: string;
  children: ReactNode;
}

export function HoveredLink({ href, children }: HoveredLinkProps) {
  return (
    <Link
      href={href}
      className="block text-zinc-400 transition-colors hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}

interface ProductItemProps {
  title: string;
  href: string;
  src: string;
  description: string;
}

export function ProductItem({
  title,
  href,
  src,
  description,
}: ProductItemProps) {
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left text-xs text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/[0.04]"
    >
      <div className="aspect-video w-16 overflow-hidden rounded-md bg-zinc-900/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="space-y-1">
        <div className="text-[11px] font-medium text-zinc-100">{title}</div>
        <p className="text-[11px] leading-snug text-zinc-400">{description}</p>
      </div>
    </Link>
  );
}
