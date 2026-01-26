import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLayout } from "@/components/layouts";
import { type LayoutType, defaultLayout } from "@/lib/layouts";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// Generar metadata dinámica para SEO y OpenGraph
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const supabase = await createClient();
  const { username } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, username")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "Usuario no encontrado | MyBento",
      description: "Este perfil no existe.",
    };
  }

  const displayName = profile.full_name || `@${username}`;
  const description = `Mirá los links de ${displayName} en MyBento`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mybento.vercel.app";

  return {
    title: `${displayName} | MyBento`,
    description,
    openGraph: {
      title: `${displayName} | MyBento`,
      description,
      url: `${siteUrl}/${username}`,
      siteName: "MyBento",
      type: "profile",
      images: profile.avatar_url ? [
        {
          url: profile.avatar_url,
          width: 400,
          height: 400,
          alt: `Avatar de ${displayName}`,
        }
      ] : [],
    },
    twitter: {
      card: "summary",
      title: `${displayName} | MyBento`,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

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

  // Obtener layout del perfil (si existe) o usar el default
  const layout = (profile.layout as LayoutType) || defaultLayout

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

      {/* BLOQUES CON LAYOUT DINÁMICO */}
      <ProfileLayout layout={layout} blocks={blocks || []} />

      {/* FOOTER */}
      <footer className="mt-20 text-zinc-600 text-xs">
        Hecho con <span className="text-white font-bold">MyBento</span>
      </footer>
    </div>
  );
}