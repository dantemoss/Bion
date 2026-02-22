"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableBlock } from "./sortable-block"
import { StaticBlock } from "./static-block"
import { reorderBlocks } from "@/app/admin/actions"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Block } from "@/lib/types"

interface BlocksGridProps {
  initialBlocks: Block[]
  cardVariant?: "dark" | "silver"
  onBlockClick?: (block: Block) => void
  /** Callback cuando el orden de bloques cambia (ej. tras drag & drop) */
  onBlocksChange?: (blocks: Block[]) => void
  /** Iconos más pequeños y menos intensos (para sección Links) */
  mutedIcons?: boolean
}

export function BlocksGrid({ initialBlocks, cardVariant = "dark", onBlockClick, onBlocksChange, mutedIcons = false }: BlocksGridProps) {
  const [blocks, setBlocks] = useState(initialBlocks)
  const [isMounted, setIsMounted] = useState(false)

  // Solo activar drag & drop después de que el componente se monte en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Actualizar blocks cuando initialBlocks cambie
  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)
      onBlocksChange?.(newBlocks)

      // Guardar el nuevo orden en la base de datos
      const orderedIds = newBlocks.map((block) => block.id)
      const result = await reorderBlocks(orderedIds)

      if (result?.error) {
        // Revertir si hay error
        setBlocks(blocks)
        toast.error(result.error)
      } else {
        toast.success("Orden actualizado")
      }
    }
  }

  if (blocks.length === 0) {
    return (
      <div className="col-span-full py-20 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 gap-2">
        <div className="bg-zinc-900 p-3 rounded-full">
          <Plus className="w-6 h-6 text-zinc-400" />
        </div>
        <p>No tenés bloques creados todavía.</p>
      </div>
    )
  }

  // Renderizar versión estática en el servidor y primera carga
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={cn(
              "transition-all duration-300",
              block.is_highlighted && "lg:col-span-2",
              !block.is_active && "opacity-50 grayscale"
            )}
          >
            <StaticBlock block={block} variant={cardVariant} onBlockClick={onBlockClick} mutedIcons={mutedIcons} />
          </div>
        ))}
      </div>
    )
  }

  // Renderizar versión con drag & drop solo en el cliente
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "transition-all duration-300",
                block.is_highlighted && "lg:col-span-2",
                !block.is_active && "opacity-50 grayscale"
              )}
            >
              <SortableBlock block={block} variant={cardVariant} onBlockClick={onBlockClick} mutedIcons={mutedIcons} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
