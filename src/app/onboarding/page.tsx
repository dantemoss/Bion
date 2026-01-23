import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Si ya tiene username, redirigir al dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-white rounded-xl mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Bienvenido a MyBento</h1>
          <p className="text-zinc-400 mt-2">
            Elegí tu nombre de usuario para crear tu perfil público.
          </p>
        </div>

        <OnboardingForm userEmail={user.email || ""} />
      </div>
    </div>
  );
}
