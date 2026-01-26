"use client"

import { type LayoutType } from "@/lib/layouts"
import { ListLayout } from "./list-layout"
import { GridLayout } from "./grid-layout"
import { BentoLayout } from "./bento-layout"

interface Block {
  id: string
  title: string
  url: string
  type: string
}

interface ProfileLayoutProps {
  layout: LayoutType
  blocks: Block[]
}

export function ProfileLayout({ layout, blocks }: ProfileLayoutProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-center text-zinc-600 italic">
        Este usuario aún no tiene links.
      </p>
    )
  }

  switch (layout) {
    case 'grid':
      return <GridLayout blocks={blocks} />
    case 'bento':
      return <BentoLayout blocks={blocks} />
    case 'list':
    default:
      return <ListLayout blocks={blocks} />
  }
}

export { ListLayout, GridLayout, BentoLayout }
