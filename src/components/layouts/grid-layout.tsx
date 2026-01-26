"use client"

import { BlockLink } from "@/components/block-link"
import { BlockCard } from "@/components/block-card"

interface Block {
  id: string
  title: string
  url: string
  type: string
}

interface GridLayoutProps {
  blocks: Block[]
}

export function GridLayout({ blocks }: GridLayoutProps) {
  // Separar headers de links para manejarlos diferente
  const renderBlocks: React.ReactNode[] = []
  let currentGroup: Block[] = []

  blocks.forEach((block, index) => {
    if (block.type === 'header') {
      // Si hay bloques acumulados, renderizarlos como grid
      if (currentGroup.length > 0) {
        renderBlocks.push(
          <div key={`grid-${index}`} className="grid grid-cols-2 gap-3">
            {currentGroup.map((b) => (
              <BlockCard key={b.id} block={b} />
            ))}
          </div>
        )
        currentGroup = []
      }
      // Renderizar el header
      renderBlocks.push(
        <h3 
          key={block.id} 
          className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mt-8 mb-2 col-span-2"
        >
          {block.title}
        </h3>
      )
    } else {
      currentGroup.push(block)
    }
  })

  // Renderizar bloques restantes
  if (currentGroup.length > 0) {
    renderBlocks.push(
      <div key="grid-final" className="grid grid-cols-2 gap-3">
        {currentGroup.map((b) => (
          <BlockCard key={b.id} block={b} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg space-y-3">
      {renderBlocks}
    </div>
  )
}
