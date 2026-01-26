"use client"

import { useState } from "react"
import { updateProfile } from "@/app/admin/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { LayoutSelector } from "@/components/layout-selector"
import { type LayoutType, defaultLayout } from "@/lib/layouts"

interface Profile {
  avatar_url?: string | null
  full_name?: string | null
  username?: string | null
  layout?: string | null
}

interface SettingsFormProps {
  profile: Profile | null
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [layout, setLayout] = useState<LayoutType>(
    (profile?.layout as LayoutType) || defaultLayout
  )

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    // Agregar el layout al formData
    formData.set('layout', layout)
    try {
      const result = await updateProfile(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Perfil actualizado correctamente")
      }
    } catch {
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Foto de Perfil */}
      <div className="space-y-2">
        <Label htmlFor="avatar">Foto de Perfil</Label>
        <div className="flex items-center gap-4">
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar actual"
              className="w-16 h-16 rounded-full object-cover border border-zinc-700"
            />
          )}
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            disabled={isLoading}
            className="bg-zinc-950 border-zinc-800 file:text-zinc-400 text-zinc-300"
          />
        </div>
      </div>

      {/* Nombre Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile?.full_name || ""}
          placeholder="Ej: Dante Moss"
          disabled={isLoading}
          className="bg-zinc-950 border-zinc-800"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Nombre de Usuario</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">mybento.vercel.app/</span>
          <Input
            id="username"
            name="username"
            defaultValue={profile?.username || ""}
            disabled={isLoading}
            className="pl-40 bg-zinc-950 border-zinc-800"
          />
        </div>
        <p className="text-xs text-zinc-500">Cuidado: Si cambiás esto, tu link viejo va a dejar de funcionar.</p>
      </div>

      {/* Layout Selector */}
      <div className="space-y-3">
        <Label>Estilo de Layout</Label>
        <LayoutSelector 
          value={layout} 
          onChange={setLayout} 
          disabled={isLoading}
        />
      </div>

      <div className="pt-4 flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  )
}
