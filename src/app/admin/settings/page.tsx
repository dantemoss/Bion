import { createClient } from "@/utils/supabase/server";
import { GlassProfileSettingsCard } from "@/components/tripled/glass-profile-settings-card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscamos los datos actuales para rellenar el formulario
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="flex justify-center items-start w-full max-w-4xl mx-auto">
      <GlassProfileSettingsCard profile={profile} />
    </div>
  );
}