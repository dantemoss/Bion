"use client";

import { useState } from "react";
import { type Block } from "@/lib/types";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { BrandIcon } from "@/components/brand-icon";
import { ExternalLink } from "lucide-react";
import { detectPlatform } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import { incrementClick } from "@/app/admin/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdultContentCardProps {
  block: Block;
}

export function AdultContentCard({ block }: AdultContentCardProps) {
  const [open, setOpen] = useState(false);
  const platform = block.url ? detectPlatform(block.url) : null;
  const hasBrandIcon = platform && platform !== "link";

  const handleOpenLink = () => {
    if (block.url) {
      incrementClick(block.id);
      window.open(block.url, "_blank", "noopener,noreferrer");
    }
    setOpen(false);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
          "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
          block.is_highlighted ? "md:col-span-2" : "col-span-1",
          block.is_highlighted && "ring-2 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
        )}
        aria-label={`Abrir ${block.title || "enlace"}`}
      >
        <div className="flex-1 min-h-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 via-zinc-900/50 to-black/50">
            {hasBrandIcon && (
              <div className="absolute bottom-4 right-4 opacity-10">
                <BrandIcon platform={platform as any} size={120} className="text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="p-2 relative z-10">
          <div
            className={cn(
              "pointer-events-none z-10 flex transform-gpu flex-col gap-0.5 transition-all duration-300 lg:group-hover:-translate-y-10"
            )}
          >
            {hasBrandIcon ? (
              <BrandIcon
                platform={platform as any}
                size={48}
                className="origin-left h-8 w-8 text-neutral-700 dark:text-neutral-300 transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75"
              />
            ) : (
              <ExternalLink className="h-8 w-8 origin-left text-neutral-700 dark:text-neutral-300" />
            )}
            <h3 className="font-semibold text-base text-neutral-700 dark:text-neutral-300">
              {block.title || "Enlace"}
            </h3>
            <p className="text-neutral-400 text-xs line-clamp-1 max-w-full">
              {block.url || "Visitar enlace"}
            </p>
          </div>
          <div
            className={cn(
              "pointer-events-none flex w-full translate-y-0 flex-row items-center transition-all duration-300 lg:hidden",
              "mt-1"
            )}
          >
            <span className="pointer-events-auto flex items-center text-xs text-primary font-medium">
              Ir al sitio
              <ArrowRightIcon className="ms-1 h-3 w-3 rtl:rotate-180" />
            </span>
          </div>
        </div>
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 flex-row items-center opacity-0 transition-all duration-300 lg:flex",
            "group-hover:translate-y-0 group-hover:opacity-100",
            "p-2"
          )}
        >
          <span className="pointer-events-auto flex items-center text-xs text-primary font-medium">
            Ir al sitio
            <ArrowRightIcon className="ms-1 h-3 w-3 rtl:rotate-180" />
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          overlayClassName="backdrop-blur-md bg-black/60"
          className="border-zinc-800 bg-zinc-950 text-zinc-100"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-white">
              Contenido +18
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Este enlace contiene contenido para mayores de edad. ¿Seguro que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 sm:gap-6">
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              No, salir
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleOpenLink}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Soy mayor de edad
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
