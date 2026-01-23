"use client"

import { useState } from "react"
import { login, signup, signInWithGoogle } from "@/app/login/actions"
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

// Icono de Google (no está en lucide)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

interface LoginFormProps {
  mode: "login" | "signup"
}

export function LoginForm({ mode }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === "login"

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const action = isLogin ? login : signup
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError(null)
    
    const result = await signInWithGoogle()
    
    if (result?.error) {
      setError(result.error)
      setGoogleLoading(false)
    }
  }

  const isDisabled = isLoading || googleLoading

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
      <CardContent className="space-y-4">
        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isDisabled}
          className="w-full"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon className="h-4 w-4 mr-2" />
              Continuar con Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-zinc-500">o continuar con email</span>
          </div>
        </div>

        {/* Email/Password Form */}
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
              disabled={isDisabled}
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
                disabled={isDisabled}
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
              disabled={isDisabled}
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
