"use client"

import { useState } from "react"
import { layouts, type LayoutType } from "@/lib/layouts"
import { List, LayoutGrid, LayoutDashboard, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LayoutSelectorProps {
  value: LayoutType
  onChange: (layout: LayoutType) => void
  disabled?: boolean
}

const iconMap = {
  'list': List,
  'grid-2x2': LayoutGrid,
  'layout-dashboard': LayoutDashboard,
}

export function LayoutSelector({ value, onChange, disabled }: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(Object.entries(layouts) as [LayoutType, typeof layouts[LayoutType]][]).map(([key, config]) => {
        const Icon = iconMap[config.icon]
        const isSelected = value === key

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key)}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
              "hover:bg-zinc-800/50",
              isSelected 
                ? "border-white bg-zinc-800/50" 
                : "border-zinc-800 bg-zinc-900/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Check mark */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Icon */}
            <Icon className={cn(
              "w-8 h-8",
              isSelected ? "text-white" : "text-zinc-500"
            )} />

            {/* Name */}
            <span className={cn(
              "text-sm font-medium",
              isSelected ? "text-white" : "text-zinc-400"
            )}>
              {config.name}
            </span>

            {/* Description (solo en desktop) */}
            <span className="hidden md:block text-xs text-zinc-600 text-center">
              {config.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Preview componente para mostrar cómo se vería cada layout
export function LayoutPreview({ layout }: { layout: LayoutType }) {
  const previewBlocks = (
    <div className="flex gap-1">
      {layout === 'list' && (
        <div className="flex flex-col gap-1 w-full">
          <div className="h-3 bg-zinc-700 rounded w-full" />
          <div className="h-3 bg-zinc-700 rounded w-full" />
          <div className="h-3 bg-zinc-700 rounded w-full" />
        </div>
      )}
      {layout === 'grid' && (
        <div className="grid grid-cols-2 gap-1 w-full">
          <div className="h-6 bg-zinc-700 rounded" />
          <div className="h-6 bg-zinc-700 rounded" />
          <div className="h-6 bg-zinc-700 rounded" />
          <div className="h-6 bg-zinc-700 rounded" />
        </div>
      )}
      {layout === 'bento' && (
        <div className="grid grid-cols-4 gap-1 w-full">
          <div className="h-6 bg-zinc-700 rounded col-span-2" />
          <div className="h-6 bg-zinc-700 rounded" />
          <div className="h-12 bg-zinc-700 rounded row-span-2" />
          <div className="h-6 bg-zinc-700 rounded" />
          <div className="h-6 bg-zinc-700 rounded" />
        </div>
      )}
    </div>
  )

  return (
    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="flex flex-col items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-zinc-700 rounded-full" />
        <div className="w-16 h-2 bg-zinc-700 rounded" />
      </div>
      {previewBlocks}
    </div>
  )
}
