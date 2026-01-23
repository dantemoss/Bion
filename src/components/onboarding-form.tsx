"use client"

import { useState } from "react"
import { setupProfile } from "@/app/onboarding/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, AlertCircle, AtSign } from "lucide-react"

interface OnboardingFormProps {
  userEmail: string
}

export function OnboardingForm({ userEmail }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await setupProfile(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  // Sanitizar input en tiempo real
  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(value)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Elegí tu username</CardTitle>
        <CardDescription>
          Este será tu link público: <span className="text-zinc-300">mybento.vercel.app/<span className="text-white font-medium">{username || "tu-username"}</span></span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="tu_username"
                disabled={isLoading}
                className="pl-9 bg-zinc-950 border-zinc-800"
                maxLength={20}
                required
              />
            </div>
            <p className="text-xs text-zinc-500">
              3-20 caracteres. Solo letras, números y guión bajo.
            </p>
          </div>

          {/* Nombre completo (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo (opcional)</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Tu Nombre"
              disabled={isLoading}
              className="bg-zinc-950 border-zinc-800"
            />
          </div>

          {/* Email (solo lectura) */}
          <div className="space-y-2">
            <Label className="text-zinc-500">Email</Label>
            <Input
              value={userEmail}
              disabled
              className="bg-zinc-950 border-zinc-800 text-zinc-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isLoading || username.length < 3}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando perfil...
              </>
            ) : (
              "Crear mi perfil"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
