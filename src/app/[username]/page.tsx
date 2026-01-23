import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Github, Youtube } from "lucide-react";

export const dynamic = "force-dynamic";
// Mapeo de iconos según el tipo de bloque
const iconMap: Record<string, any> = {
  link: ExternalLink,
  github: Github,
  youtube: Youtube,
  header: null, // Los headers no llevan icono
};

export default async function PublicProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> // En Next 15 params es una promesa
}) {    
  const supabase = await createClient();
  const { username } = await params;

  // 1. Buscar el perfil por username
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return notFound(); // Si no existe, tira error 404 automático
  }

  // 2. Buscar los bloques de ese perfil
  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("user_id", profile.id)
    .order("position", { ascending: true });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-16 px-4">
      
      {/* HEADER DEL PERFIL */}
      <div className="flex flex-col items-center gap-4 mb-10 text-center animate-in fade-in zoom-in duration-500">
        <Avatar className="w-24 h-24 border-2 border-zinc-800">
          <AvatarImage src={profile.avatar_url || ""} />
          <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-400">
            {profile.full_name?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{profile.full_name || username}</h1>
            <p className="text-zinc-500 text-sm font-mono">@{username}</p>
        </div>
      </div>

      {/* LISTA DE BLOQUES */}
      <div className="w-full max-w-md space-y-4">
        {blocks?.map((block) => {
          const Icon = iconMap[block.type] || ExternalLink;

          // Si es un Header (título separador)
          if (block.type === 'header') {
             return (
                 <h3 key={block.id} className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mt-6 mb-2">
                     {block.title}
                 </h3>
             )
          }

          // Si es un Link/Botón
          return (
            <a 
                key={block.id} 
                href={block.url} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
          );
        })}
        
        {blocks?.length === 0 && (
            <p className="text-center text-zinc-600 italic">Este usuario aún no tiene links.</p>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-20 text-zinc-600 text-xs">
        Hecho con <span className="text-white font-bold">MyBento</span>
      </footer>
    </div>
  );
}