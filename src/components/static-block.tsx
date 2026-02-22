"use client"

import { BrandIcon, getBrandColor, isPlatformSupported, type PlatformKey } from "@/components/brand-icon"
import { detectPlatform, getPlatformConfig, type Platform } from "@/lib/platforms"
import { DashboardBlockCard } from "./dashboard-block-card"
import type { Block } from "@/lib/types"

interface StaticBlockProps {
  block: Block
  variant?: "dark" | "silver"
  onBlockClick?: (block: Block) => void
  mutedIcons?: boolean
}

export function StaticBlock({ block, variant = "dark", onBlockClick, mutedIcons = false }: StaticBlockProps) {
  const platform = block.url ? (detectPlatform(block.url) as Platform) : "link"
  const config = getPlatformConfig(platform)
  
  // Usar BrandIcon si la plataforma está soportada
  const platformKey = platform as string
  const useBrandIcon = isPlatformSupported(platformKey)
  const brandColor = useBrandIcon ? getBrandColor(platformKey as PlatformKey) : config.color

  return (
    <div onClick={() => onBlockClick?.(block)}>
      <DashboardBlockCard
      title={block.title || "Sin título"}
      platform={config.name}
      icon={
        useBrandIcon ? (
          <BrandIcon 
            platform={platformKey as PlatformKey} 
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
        )
      }
      brandColor={brandColor || "#71717a"}
      isActive={block.is_active}
      isHighlighted={block.is_highlighted}
      clicks={block.clicks || 0}
      url={block.url || undefined}
      variant={variant}
      mutedIcons={mutedIcons}
      className="h-[180px]"
    />
    </div>
  )
}
