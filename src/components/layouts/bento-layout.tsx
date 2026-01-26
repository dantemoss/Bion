"use client"

import { BlockCard } from "@/components/block-card"

interface Block {
  id: string
  title: string
  url: string
  type: string
}

interface BentoLayoutProps {
  blocks: Block[]
}

// Patrones de tamaño para crear asimetría visual estilo Bento
// 'large' = 2 columnas, 'medium' = 1 columna pero más alto, 'small' = 1 columna normal
type BentoSize = 'large' | 'medium' | 'small'

const bentoPattern: BentoSize[] = [
  'large',   // Primer bloque grande
  'small',   // 
  'medium',  // Bloque alto a la derecha
  'small',   //
  'small',   //
  'large',   // Otro grande
  'medium',  //
  'small',   //
  'small',   //
  'small',   //
]

function getBentoSize(index: number): BentoSize {
  return bentoPattern[index % bentoPattern.length]
}

export function BentoLayout({ blocks }: BentoLayoutProps) {
  // Filtrar headers (los mostramos inline en el grid)
  const linkBlocks = blocks.filter(b => b.type !== 'header')
  const headers = blocks.filter(b => b.type === 'header')

  return (
    <div className="w-full max-w-2xl">
      {/* Headers como títulos de sección arriba */}
      {headers.length > 0 && headers[0] && (
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mb-6">
          {headers[0].title}
        </h3>
      )}

      {/* Grid Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px]">
        {linkBlocks.map((block, index) => {
          const size = getBentoSize(index)
          
          let gridClass = ''
          switch (size) {
            case 'large':
              gridClass = 'col-span-2 row-span-1'
              break
            case 'medium':
              gridClass = 'col-span-1 row-span-2'
              break
            case 'small':
            default:
              gridClass = 'col-span-1 row-span-1'
          }

          return (
            <div key={block.id} className={gridClass}>
              <BlockCard block={block} variant="bento" size={size} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
