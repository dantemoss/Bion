import { Iphone } from "@/components/ui/iphone";

export default function AdminLinksPage() {
  return (
    <div className="flex gap-6 h-full min-h-0">
      {/* Columna Izquierda: Editor (60%) */}
      <section className="flex-[6] min-w-0">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur p-8 min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-zinc-300 tracking-tight">
            Editor de Links
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            (En construcción)
          </p>
        </div>
      </section>

      {/* Columna Derecha: Live Preview (40%) - Sticky */}
      <aside className="flex-[4] min-w-0 flex-shrink-0">
        <div className="sticky top-4 flex justify-center">
          <div className="w-full max-w-[280px]">
            <Iphone>
              <p className="text-zinc-500 text-sm px-6">
                Preview en vivo de Bion
              </p>
            </Iphone>
          </div>
        </div>
      </aside>
    </div>
  );
}
