"use client"

import { incrementClick } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Youtube } from "lucide-react"

const iconMap: Record<string, any> = {
  link: ExternalLink,
  github: Github,
  youtube: Youtube,
}

export function BlockLink({ block }: { block: any }) {
  const Icon = iconMap[block.type] || ExternalLink

  return (
    <a 
      href={block.url} 
      target="_blank" 
      rel="noreferrer"
      className="block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => {
        // Disparamos la acción sin esperar respuesta (fire and forget)
        incrementClick(block.id)
      }}
    >
      <Button 
        variant="outline" 
        className="w-full h-14 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white justify-between px-6 text-base rounded-xl"
      >
        <span className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-zinc-400" />
            {block.title}
        </span>
      </Button>
    </a>
  )
}