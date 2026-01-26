"use client"

import { incrementClick } from "@/app/admin/actions"
import { PlatformIcon } from "@/components/icons"
import { detectPlatform, getPlatformConfig, type Platform } from "@/lib/platforms"

interface Block {
  id: string
  title: string
  url: string
  type: string
}

interface BlockCardProps {
  block: Block
  variant?: 'grid' | 'bento'
  size?: 'large' | 'medium' | 'small'
}

export function BlockCard({ block, variant = 'grid', size = 'small' }: BlockCardProps) {
  const platform = detectPlatform(block.url) as Platform
  const config = getPlatformConfig(platform)

  const isLarge = size === 'large'
  const isMedium = size === 'medium'
  const isBento = variant === 'bento'

  return (
    <a 
      href={block.url} 
      target="_blank" 
      rel="noreferrer"
      className="block w-full h-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => {
        incrementClick(block.id)
      }}
    >
      <div 
        className={`
          w-full h-full flex rounded-xl border transition-all duration-200 overflow-hidden
          ${isBento 
            ? isLarge 
              ? 'flex-row items-center gap-4 p-5' 
              : isMedium 
                ? 'flex-col items-center justify-center gap-3 p-4 text-center'
                : 'flex-col items-center justify-center gap-2 p-3 text-center'
            : 'flex-col items-center justify-center gap-2 p-4 text-center'
          }
        `}
        style={{
          backgroundColor: 'rgba(24, 24, 27, 0.8)',
          borderColor: 'rgba(63, 63, 70, 0.5)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = config.bgColor
          e.currentTarget.style.borderColor = config.color
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(24, 24, 27, 0.8)'
          e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.5)'
        }}
      >
        <PlatformIcon 
          platform={platform} 
          className={`
            flex-shrink-0
            ${isBento
              ? isLarge 
                ? 'w-10 h-10' 
                : isMedium 
                  ? 'w-12 h-12'
                  : 'w-8 h-8'
              : 'w-8 h-8'
            }
          `}
        />
        <span 
          className={`
            font-medium text-zinc-100 
            ${isBento
              ? isLarge 
                ? 'text-lg' 
                : isMedium 
                  ? 'text-base'
                  : 'text-sm line-clamp-2'
              : 'text-sm line-clamp-2'
            }
          `}
        >
          {block.title}
        </span>
        
        {/* Nombre de la plataforma solo en bento grande o medium */}
        {isBento && (isLarge || isMedium) && platform !== 'link' && (
          <span 
            className="text-xs text-zinc-500"
            style={{ color: config.color }}
          >
            {config.name}
          </span>
        )}
      </div>
    </a>
  )
}
