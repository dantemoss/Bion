"use client";

import { type Block } from "@/lib/types";
import { BentoCard } from "@/components/ui/bento-grid";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

// Mismo formato que el bloque de Twitter: contenedor + card con borde y padding
// (sin row-span/col-span aquí: eso va en el wrapper que es hijo directo del grid)
const VIDEO_CARD_WRAPPER = cn(
  "group relative flex flex-col overflow-hidden rounded-xl h-full",
  "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
  "dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]"
);

const VIDEO_CARD_INNER = cn(
  "relative flex flex-col gap-4 overflow-hidden rounded-xl border p-5 h-full",
  "border-border/50"
);

// Extraer ID de YouTube
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/shorts\/([^&?/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extraer ID de Vimeo
function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export type VideoPlatform = "youtube" | "vimeo";

function getVideoEmbed(
  url: string
): { platform: VideoPlatform; videoId: string; embedUrl: string; thumbnailUrl: string } | null {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      platform: "youtube",
      videoId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
    };
  }
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      platform: "vimeo",
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`,
    };
  }
  return null;
}

interface VideoBlockWithModalProps {
  block: Block;
}

export function VideoBlockWithModal({ block }: VideoBlockWithModalProps) {
  const video = block.url ? getVideoEmbed(block.url) : null;

  if (!video) {
    // URL no reconocida como video → enlace normal
    return (
      <BentoCard
        name={block.title || "Video"}
      className={cn(
        "row-span-2 md:row-span-3",
        block.is_highlighted ? "col-span-2 md:col-span-2" : "col-span-2 md:col-span-1"
      )}
        background={
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-zinc-900/50 to-transparent" />
        }
        Icon={Play}
        description="Ver video"
        href={block.url || "#"}
        cta="Abrir"
      />
    );
  }

  const card = (
    <div className={VIDEO_CARD_WRAPPER}>
      <div className={cn(VIDEO_CARD_INNER)}>
        {/* Thumbnail + play (mismo estilo contenido que el tweet: imagen + texto) */}
        <div className="relative w-full flex-1 min-h-0 rounded-lg overflow-hidden bg-muted">
          <img
            src={video.thumbnailUrl}
            alt={block.title || "Video"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-xl transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <h3 className="font-semibold text-foreground text-[15px] leading-tight">
            {block.title || "Video"}
          </h3>
          <p className="text-muted-foreground text-sm">Reproducir</p>
        </div>
      </div>
    </div>
  );

  // Wrapper es hijo directo del grid: debe tener row-span/col-span para ocupar celdas
  return (
    <div
      className={cn(
        "min-h-0 col-span-2 row-span-2",
        block.is_highlighted ? "md:col-span-2 md:row-span-3" : "md:col-span-1"
      )}
    >
      <HeroVideoDialog
        videoSrc={video.embedUrl}
        thumbnailSrc={video.thumbnailUrl}
        thumbnailAlt={block.title || "Video"}
        trigger={card}
        animationStyle="from-center"
        className="h-full w-full min-h-0"
      />
    </div>
  );
}
