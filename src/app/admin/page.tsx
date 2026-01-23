import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, BarChart2 } from "lucide-react"; // Iconos lindos
import { CreateBlockBtn } from "@/components/create-block-btn";



export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Buscamos los bloques del usuario
  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("user_id", user?.id)
    .order("position", { ascending: true });

  return (
    <div className="space-y-8">
      {/* Título y Botón de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-zinc-400">Administrá tus enlaces y contenido.</p>
        </div>
        <CreateBlockBtn />
      </div>

      {/* GRID DE BLOQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Estado Vacío (Empty State) */}
        {blocks?.length === 0 && (
          <div className="col-span-full py-20 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 gap-2">
            <div className="bg-zinc-900 p-3 rounded-full">
              <Plus className="w-6 h-6 text-zinc-400" />
            </div>
            <p>No tenés bloques creados todavía.</p>
          </div>
        )}

        {/* Lista de Bloques (Cuando existan) */}
        {blocks?.map((block) => (
          <Card key={block.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 group hover:border-zinc-700 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium truncate">
                {block.title || "Sin título"}
              </CardTitle>
              <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500 font-mono truncate">
                {block.type.toUpperCase()}
              </p>
              {block.url && (
                <p className="text-sm text-zinc-400 mt-2 truncate underline decoration-zinc-700 underline-offset-4">
                  {block.url}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4 text-zinc-500 text-xs font-medium bg-zinc-950/50 p-2 rounded w-fit">
                <BarChart2 className="w-3 h-3" />
                <span>{block.clicks || 0} clicks</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}