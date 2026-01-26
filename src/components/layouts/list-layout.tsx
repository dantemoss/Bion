"use client"

import { BlockLink } from "@/components/block-link"

interface Block {
  id: string
  title: string
  url: string
  type: string
}

interface ListLayoutProps {
  blocks: Block[]
}

export function ListLayout({ blocks }: ListLayoutProps) {
  return (
    <div className="w-full max-w-md space-y-3">
      {blocks.map((block) => {
        if (block.type === 'header') {
          return (
            <h3 
              key={block.id} 
              className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mt-8 mb-2"
            >
              {block.title}
            </h3>
          )
        }

        return <BlockLink key={block.id} block={block} />
      })}
    </div>
  )
}
