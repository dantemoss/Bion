"use client";

import React, { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";

interface BionNavbarProps {
  className?: string;
}

export function BionNavbar({ className }: BionNavbarProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-5 sm:pt-7",
        className
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-6 rounded-2xl border border-white/10 bg-zinc-950/85 px-6 py-4 shadow-xl shadow-black/40 backdrop-blur-xl sm:px-8 sm:py-5">
        {/* Logo + Brand */}
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-3 text-sm font-semibold text-zinc-100"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/15 text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-400/20">
            B
          </span>
          <span className="tracking-tight text-base">Bion</span>
        </Link>

        {/* Main Menu */}
        <Menu setActive={setActive}>
          <MenuItem item="Pricing" href="#pricing" active={active} setActive={setActive}>
            <div className="flex flex-col space-y-2 text-xs">
              <HoveredLink href="#pricing">Plan gratuito para empezar hoy.</HoveredLink>
              <HoveredLink href="#pricing">Actualizate cuando tus links empiecen a vender.</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem item="Showcase" href="#showcase" active={active} setActive={setActive}>
            <div className="flex flex-col space-y-2 text-xs">
              <HoveredLink href="#showcase">Perfil ejemplo en vivo.</HoveredLink>
              <HoveredLink href="#showcase">Disenos para creadores exigentes.</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem item="Contacto" href="#contact" active={active} setActive={setActive}>
            <div className="flex flex-col space-y-2 text-xs">
              <HoveredLink href="#contact">Soporte para creadores.</HoveredLink>
              <HoveredLink href="#contact">Escribinos si queres lanzar con Bion.</HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        {/* Right side action */}
        <Link
          href="/login"
          className="hidden shrink-0 rounded-full bg-zinc-900/80 px-5 py-2 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-colors hover:bg-zinc-800 hover:text-zinc-50 sm:inline"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
