"use client";

import { type Block } from "@/lib/types";
import { BrandIcon } from "@/components/brand-icon";
import { detectPlatform } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  MapPin,
  Music,
  Play,
  MessageCircle,
  ImageIcon,
} from "lucide-react";

interface LinksMobilePreviewProps {
  blocks: Block[];
  className?: string;
}

/** Determina si el bloque ocupa todo el ancho (col-span-2) en mobile */
function isFullWidth(block: Block): boolean {
  const type = block.type?.toLowerCase() || "";
  const url = (block.url || "").toLowerCase();
  if (block.is_highlighted) return true;
  if (type === "youtube" || type === "vimeo" || url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo"))
    return true;
  if (type === "spotify" || url.includes("spotify.com")) return true;
  if (type === "twitter" || type === "x" || url.includes("twitter.com") || url.includes("x.com"))
    return true;
  if (type === "map" || url.includes("maps.google") || url.includes("goo.gl/maps"))
    return true;
  if (type === "onlyfans" || url.includes("onlyfans.com")) return true;
  return false;
}

function MobileBlockCard({ block }: { block: Block }) {
  const platform = block.url ? detectPlatform(block.url) : null;
  const hasBrandIcon = platform && platform !== "link";

  const type = block.type?.toLowerCase() || "";
  const url = (block.url || "").toLowerCase();

  const isVideo = type === "youtube" || type === "vimeo" || url.includes("youtube") || url.includes("vimeo");
  const isSpotify = type === "spotify" || url.includes("spotify");
  const isTwitter = type === "twitter" || type === "x" || url.includes("twitter") || url.includes("x.com");
  const isMap = type === "map" || url.includes("maps.") || url.includes("goo.gl/maps");

  const Icon = isVideo ? Play : isSpotify ? Music : isTwitter ? MessageCircle : isMap ? MapPin : null;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-xl min-h-[80px]",
        "bg-zinc-900/80 border border-zinc-800",
        "dark:[box-shadow:0_-20px_80px_-20px_#ffffff08_inset]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 via-zinc-900/40 to-black/40" />
      <div className="relative z-10 p-4 flex items-center gap-3">
        {hasBrandIcon && !Icon ? (
          <BrandIcon
            platform={platform as any}
            className="w-6 h-6 flex-shrink-0 text-zinc-100"
          />
        ) : Icon ? (
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-zinc-400">
            <Icon className="w-4 h-4" />
          </div>
        ) : (
          <ExternalLink className="w-6 h-6 flex-shrink-0 text-zinc-400" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-100 truncate">
            {block.title || "Enlace"}
          </p>
          <p className="text-[10px] text-zinc-500 truncate">
            {block.url
              ? (() => {
                  try {
                    return new URL(block.url!).hostname.replace("www.", "");
                  } catch {
                    return block.url;
                  }
                })()
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LinksMobilePreview({ blocks, className }: LinksMobilePreviewProps) {
  const activeBlocks = blocks.filter((b) => b.is_active);

  if (activeBlocks.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-[200px] text-zinc-500 text-sm",
          className
        )}
      >
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <p>Sin bloques para mostrar</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 auto-rows-[80px] w-full",
        className
      )}
    >
      {activeBlocks.map((block) => (
        <div
          key={block.id}
          className={cn("relative", isFullWidth(block) ? "col-span-2" : "col-span-1")}
        >
          <MobileBlockCard block={block} />
        </div>
      ))}
    </div>
  );
}
