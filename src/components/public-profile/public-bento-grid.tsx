import { type Block, type Profile } from "@/lib/types";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";
import { MapPin, ExternalLink } from "lucide-react";
import { detectPlatform } from "@/lib/platforms";
import { TweetCard } from "@/components/ui/tweet-card";
import { VideoBlockWithModal } from "@/components/public-profile/video-block-with-modal";
import { AdultContentCard } from "@/components/public-profile/adult-content-card";

interface PublicBentoGridProps {
  blocks: Block[];
  profile?: Profile; // Opcional: el Hero ahora está en la página
}

// Función para extraer el ID de una canción/playlist de Spotify
function extractSpotifyId(url: string): { type: string; id: string } | null {
  const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([^?]+)/);
  if (match) {
    return { type: match[1], id: match[2] };
  }
  return null;
}

// Función para extraer el ID de un tweet
function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/.*\/status\/(\d+)/);
  return match ? match[1] : null;
}

// Componente para el card de Spotify
function SpotifyCard({ block }: { block: Block }) {
  const spotifyData = block.url ? extractSpotifyId(block.url) : null;
  
  if (!spotifyData) {
    return <DefaultLinkCard block={block} />;
  }
  
  const embedUrl = `https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}`;
  
  // Bloque interactivo: iframe a pantalla completa para que el usuario interactúe con play/pause/skip
  return (
    <div
      className={cn(
        "group relative row-span-2 flex flex-col overflow-hidden rounded-xl",
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
        block.is_highlighted ? "md:col-span-2" : "col-span-1"
      )}
    >
      <div className="absolute inset-0 p-2">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
          title={block.title || "Spotify"}
        />
      </div>
      <a
        href={block.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-zinc-400 hover:text-zinc-200 bg-black/60 px-2 py-1 rounded"
      >
        Abrir en Spotify →
      </a>
    </div>
  );
}

// Componente para el card de Twitter/X (MagicUI TweetCard - Server Component)
async function TwitterCard({ block }: { block: Block }) {
  const tweetId = block.url ? extractTweetId(block.url) : null;

  if (!tweetId) {
    return <DefaultLinkCard block={block} />;
  }

  return (
    <div
      className={cn(
        "group relative row-span-2 flex flex-col overflow-hidden rounded-xl",
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
        block.is_highlighted ? "md:col-span-2 row-span-3" : "col-span-1"
      )}
    >
      <div className="h-full w-full overflow-hidden overscroll-none">
        <TweetCard
          id={tweetId}
          className="h-full w-full overflow-hidden"
        />
      </div>
    </div>
  );
}

// Componente para el card de Mapa
function MapCard({ block }: { block: Block }) {
  // Intentar extraer coordenadas o ubicación de la URL
  const isGoogleMaps = block.url?.includes("google.com/maps");
  
  return (
    <BentoCard
      compact
      name={block.title || "Ubicación"}
      className={cn(
        block.is_highlighted ? "md:col-span-2" : "col-span-1"
      )}
      background={
        <div className="absolute inset-0">
          {isGoogleMaps && block.url ? (
            <iframe
              src={block.url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
              <MapPin className="w-32 h-32 text-green-400 opacity-30" />
            </div>
          )}
        </div>
      }
      Icon={MapPin}
      description="Ver ubicación"
      href={block.url || "#"}
      cta="Abrir mapa"
    />
  );
}

// Componente por defecto para links estándar
function DefaultLinkCard({ block }: { block: Block }) {
  const platform = block.url ? detectPlatform(block.url) : null;
  const hasBrandIcon = platform && platform !== 'link';
  
  return (
    <BentoCard
      compact
      name={block.title || "Enlace"}
      className={cn(
        block.is_highlighted ? "md:col-span-2" : "col-span-1",
        block.is_highlighted && "ring-2 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
      )}
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 via-zinc-900/50 to-black/50">
          {hasBrandIcon && (
            <div className="absolute bottom-4 right-4 opacity-10">
              <BrandIcon 
                platform={platform as any}
                size={120}
                className="text-white"
              />
            </div>
          )}
        </div>
      }
      Icon={() => 
        hasBrandIcon ? (
          <BrandIcon platform={platform as any} size={48} />
        ) : (
          <ExternalLink className="h-12 w-12" />
        )
      }
      description={block.url || "Visitar enlace"}
      href={block.url || "#"}
      cta="Ir al sitio"
    />
  );
}

// Componente principal
export function PublicBentoGrid({ blocks }: PublicBentoGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <BentoGrid className="auto-rows-[11rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderizar cada bloque según su tipo */}
        {blocks.map((block) => {
          const blockType = block.type.toLowerCase();
          const url = block.url?.toLowerCase() || "";
          
          // YouTube, Vimeo y otras plataformas de video → modal al hacer click
          if (
            blockType === "youtube" ||
            blockType === "vimeo" ||
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("vimeo.com")
          ) {
            return <VideoBlockWithModal key={block.id} block={block} />;
          }
          
          // Spotify
          if (blockType === "spotify" || url.includes("spotify.com")) {
            return <SpotifyCard key={block.id} block={block} />;
          }
          
          // Twitter/X
          if (blockType === "twitter" || blockType === "x" || url.includes("twitter.com") || url.includes("x.com")) {
            return <TwitterCard key={block.id} block={block} />;
          }
          
          // Map
          if (blockType === "map" || url.includes("maps.google") || url.includes("goo.gl/maps")) {
            return <MapCard key={block.id} block={block} />;
          }

          // OnlyFans / contenido +18 → disclaimer antes de abrir
          if (blockType === "onlyfans" || url.includes("onlyfans.com")) {
            return <AdultContentCard key={block.id} block={block} />;
          }
          
          // Default: Link estándar
          return <DefaultLinkCard key={block.id} block={block} />;
        })}
      </BentoGrid>
    </div>
  );
}
