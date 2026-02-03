"use client"

import { PlatformIcon } from "@/components/icons"
import { detectPlatform, getPlatformConfig, type Platform } from "@/lib/platforms"
import { DashboardBlockCard } from "./dashboard-block-card"

interface Block {
  id: string
  title: string | null
  url: string | null
  type: string
  clicks: number | null
}

interface StaticBlockProps {
  block: Block
  variant?: "dark" | "silver"
}

export function StaticBlock({ block, variant = "dark" }: StaticBlockProps) {
  const platform = block.url ? (detectPlatform(block.url) as Platform) : "link"
  const config = getPlatformConfig(platform)

  return (
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
      variant={variant}
      className="h-[180px]"
    />
  )
}
