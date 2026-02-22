import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PublicBentoGrid } from "@/components/public-profile/public-bento-grid";
import { ProfileAvatarWithSpinningText } from "@/components/public-profile/profile-avatar-with-spinning-text";
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
      title: "Usuario no encontrado | Bion",
      description: "Este perfil no existe.",
    };
  }

  const displayName = profile.full_name || `@${username}`;
  const description = `Mirá los links de ${displayName} en Bion`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bion.vercel.app";

  return {
    title: `${displayName} | Bion`,
    description,
    openGraph: {
      title: `${displayName} | Bion`,
      description,
      url: `${siteUrl}/${username}`,
      siteName: "Bion",
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
      title: `${displayName} | Bion`,
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

  // Filtrar solo bloques activos
  const activeBlocks = blocks?.filter(b => b.is_active !== false) || []

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6">
      
      {/* HEADER DEL PERFIL: avatar con texto giratorio opcional */}
      <div className="flex flex-col items-center gap-4 mb-10 text-center animate-in fade-in zoom-in duration-500">
        <ProfileAvatarWithSpinningText
          avatarUrl={profile.avatar_url}
          fullName={profile.full_name}
          username={username}
          spinningTextEnabled={profile.spinning_text_enabled === true}
          spinningTextSet={profile.spinning_text_set}
          avatarPosition={profile.avatar_position}
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{profile.full_name || username}</h1>
          <p className="text-zinc-500 text-sm font-mono">@{username}</p>
        </div>
      </div>

      {/* BENTO GRID CON RICH MEDIA */}
      <PublicBentoGrid blocks={activeBlocks} />

      {/* FOOTER */}
      <footer className="mt-20 text-zinc-600 text-xs">
        Hecho con <span className="text-white font-bold">Bion</span>
      </footer>
    </div>
  );
}