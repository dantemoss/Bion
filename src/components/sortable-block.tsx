"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PlatformIcon } from "@/components/icons"
import { detectPlatform, getPlatformConfig, type Platform } from "@/lib/platforms"
import { EditBlockBtn } from "./edit-block-btn"
import { DeleteBlockBtn } from "./delete-block-btn"
import { DashboardBlockCard } from "./dashboard-block-card"
import { incrementClick } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

interface Block {
  id: string
  title: string | null
  url: string | null
  type: string
  clicks: number | null
}

interface SortableBlockProps {
  block: Block
  variant?: "dark" | "silver"
}

export function SortableBlock({ block, variant = "dark" }: SortableBlockProps) {
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

  const handleEdit = () => {
    // Trigger edit modal
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
      {/* Controles de edición flotantes */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <EditBlockBtn
          block={{
            id: block.id,
            title: block.title || "",
            url: block.url || "",
            type: block.type,
          }}
        />
        <DeleteBlockBtn
          blockId={block.id}
          blockTitle={block.title || "Sin título"}
        />
      </div>

      {/* Dashboard Block Card */}
      <div {...attributes} {...listeners}>
        <DashboardBlockCard
          title={block.title || "Sin título"}
          platform={config.name}
          icon={
            <PlatformIcon 
              platform={platform} 
              className="w-full h-full"
            />
          }
          brandColor={config.color || "#71717a"}
          isActive={true}
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
