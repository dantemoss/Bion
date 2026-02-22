import { createClient } from "@/utils/supabase/server";
import { CreateBlockBtn } from "@/components/create-block-btn";
import { LinksEditorClient } from "./links-editor-client";

export default async function AdminLinksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: blocks, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("user_id", user?.id)
    .order("position", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Links</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Ordená tus bloques y enlaces. El preview refleja cómo se verá en mobile.
          </p>
        </div>
        <CreateBlockBtn />
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          <strong>Error al cargar bloques:</strong> {error.message}
        </div>
      )}

      <LinksEditorClient initialBlocks={blocks || []} />
    </div>
  );
}
