'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// Sanitizar input - remover espacios y caracteres peligrosos
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Validar formato de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar contraseña
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos una mayúscula' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos una minúscula' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos un número' }
  }
  return { valid: true, message: '' }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Obtener y sanitizar datos
  const rawEmail = formData.get('email') as string
  const password = formData.get('password') as string

  if (!rawEmail || !password) {
    return { error: 'Email y contraseña son requeridos' }
  }

  const email = sanitizeEmail(rawEmail)

  if (!isValidEmail(email)) {
    return { error: 'Formato de email inválido' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    // No revelar si el email existe o no (seguridad)
    return { error: 'Credenciales inválidas' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Obtener y sanitizar datos
  const rawEmail = formData.get('email') as string
  const password = formData.get('password') as string

  if (!rawEmail || !password) {
    return { error: 'Email y contraseña son requeridos' }
  }

  const email = sanitizeEmail(rawEmail)

  if (!isValidEmail(email)) {
    return { error: 'Formato de email inválido' }
  }

  // Validar contraseña fuerte
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.message }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup error:', error.message)
    
    // Mensajes genéricos por seguridad
    if (error.message.includes('already registered')) {
      return { error: 'Este email ya está registrado' }
    }
    return { error: 'Error al crear la cuenta. Intentá de nuevo.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('host') || ''
  
  // Construir la URL base correctamente
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google OAuth error:', error.message)
    return { error: 'Error al conectar con Google' }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'No se pudo iniciar el login con Google' }
}
