"use client";

import { useState, useEffect } from "react";
import { BlocksGrid } from "@/components/blocks-grid";
import { CardVariantSelector } from "@/components/card-variant-selector";
import { EditBlockSheet } from "@/components/edit-block-sheet";
import { LinksMobilePreview } from "@/components/links-mobile-preview";
import { Iphone } from "@/components/ui/iphone";
import type { Block } from "@/lib/types";

interface LinksEditorClientProps {
  initialBlocks: Block[];
}

export function LinksEditorClient({ initialBlocks }: LinksEditorClientProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  const [cardVariant, setCardVariant] = useState<"dark" | "silver">("dark");
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setSelectedBlock(null);
  };

  return (
    <div className="flex gap-6 h-full min-h-0">
      {/* Columna Izquierda: Editor (60%) */}
      <section className="flex-[6] min-w-0 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 font-medium">Estilo de cards:</span>
          <CardVariantSelector value={cardVariant} onChange={setCardVariant} />
        </div>
        <BlocksGrid
          initialBlocks={blocks}
          cardVariant={cardVariant}
          onBlockClick={handleBlockClick}
          onBlocksChange={setBlocks}
          mutedIcons
        />
      </section>

      {/* Columna Derecha: Live Preview (40%) - Sticky */}
      <aside className="flex-[4] min-w-0 flex-shrink-0">
        <div className="sticky top-4 flex justify-center">
          <div className="w-full max-w-[360px]">
            <Iphone>
              <div className="w-full h-full overflow-y-auto overscroll-contain scrollbar-hide p-4 pt-8 pb-12 bg-zinc-950">
                <LinksMobilePreview blocks={blocks} />
              </div>
            </Iphone>
          </div>
        </div>
      </aside>

      {selectedBlock && (
        <EditBlockSheet
          key={selectedBlock.id}
          block={selectedBlock}
          open={isSheetOpen}
          onOpenChange={handleSheetClose}
        />
      )}
    </div>
  );
}
