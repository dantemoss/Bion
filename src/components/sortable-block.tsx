"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BrandIcon, getBrandColor, isPlatformSupported, type PlatformKey } from "@/components/brand-icon"
import { detectPlatform, getPlatformConfig, type Platform } from "@/lib/platforms"
import { EditBlockBtn } from "./edit-block-btn"
import { DeleteBlockBtn } from "./delete-block-btn"
import { DashboardBlockCard } from "./dashboard-block-card"
import { incrementClick } from "@/app/admin/actions"
import { cn } from "@/lib/utils"
import type { Block } from "@/lib/types"

interface SortableBlockProps {
  block: Block
  variant?: "dark" | "silver"
  onBlockClick?: (block: Block) => void
  mutedIcons?: boolean
}

export function SortableBlock({ block, variant = "dark", onBlockClick, mutedIcons = false }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  const platform = block.url ? (detectPlatform(block.url) as Platform) : "link"
  const config = getPlatformConfig(platform)
  
  // Usar BrandIcon si la plataforma está soportada
  const platformKey = platform as string
  const useBrandIcon = isPlatformSupported(platformKey)
  const brandColor = useBrandIcon ? getBrandColor(platformKey as PlatformKey) : config.color

  const handleEdit = () => {
    onBlockClick?.(block)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "ring-2 ring-zinc-500 shadow-lg scale-105"
      )}
    >
      {/* Dashboard Block Card */}
      <div {...attributes} {...listeners} onClick={handleEdit}>
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
          mutedIcons={mutedIcons}
          clicks={block.clicks || 0}
          url={block.url || undefined}
          onEdit={handleEdit}
          onDrag={() => {}}
          variant={variant}
          className="h-[180px]"
        />
      </div>
    </div>
  )
}
