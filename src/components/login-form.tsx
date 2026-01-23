"use client"

import { useState } from "react"
import { login, signup } from "@/app/login/actions"
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
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  mode: "login" | "signup"
}

export function LoginForm({ mode }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === "login"

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const action = isLogin ? login : signup
    const result = await action(formData)

    // Si hay error, mostrarlo (si no hay error, ya redirigió)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Ingresá tus credenciales para acceder a tu dashboard."
            : "Empezá a construir tu perfil personalizado hoy."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1 mt-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-zinc-500 mt-1">
                Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              variant={isLogin ? "default" : "secondary"}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Ingresando..." : "Creando cuenta..."}
                </>
              ) : isLogin ? (
                "Iniciar Sesión"
              ) : (
                "Registrarse"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
