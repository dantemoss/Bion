import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";
import Link from "next/link";
import { Settings, ExternalLink } from "lucide-react";
import { QRCodeBtn } from "@/components/qr-code-btn";
import { AdminSidebar } from "@/components/admin-sidebar";
import { StripedPattern } from "@/components/magicui/striped-pattern";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Verificamos sesión en el servidor
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Verificar si el usuario tiene perfil con username
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Si no tiene username, redirigir a onboarding
  if (!profile?.username) {
    redirect("/onboarding");
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex relative overflow-hidden">
      {/* Striped Pattern Background */}
      <StripedPattern 
        direction="right"
        width={20}
        height={20}
        className="text-zinc-800/30 z-0"
      />
      
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL: min-h-0 para que el main pueda hacer scroll */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* HEADER */}
        <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="px-6 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/logo-bion.svg" alt="Bion" className="h-6 w-6 object-contain" />
              <h1 className="font-bold text-lg tracking-tight">Bion</h1>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <Link 
                href={`/${profile.username}`} 
                target="_blank"
                className="text-xs text-zinc-500 font-mono hidden sm:flex items-center gap-1 hover:text-zinc-300 transition-colors"
              >
                @{profile.username}
                <ExternalLink className="w-3 h-3" />
              </Link>

              <QRCodeBtn username={profile.username} />

              <Link href="/admin/settings">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>

              <form action={signOut}>
                <Button variant="outline" size="sm" className="h-8 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                  Salir
                </Button>
              </form>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="flex-1 p-6 pt-6 pb-8 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}