'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Validar formato de username
function isValidUsername(username: string): { valid: boolean; message: string } {
  if (username.length < 3) {
    return { valid: false, message: 'El username debe tener al menos 3 caracteres' }
  }
  if (username.length > 20) {
    return { valid: false, message: 'El username no puede tener más de 20 caracteres' }
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Solo letras minúsculas, números y guión bajo (_)' }
  }
  if (/^[0-9]/.test(username)) {
    return { valid: false, message: 'El username no puede empezar con un número' }
  }
  return { valid: true, message: '' }
}

export async function setupProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const rawUsername = formData.get('username') as string
  const fullName = formData.get('fullName') as string

  if (!rawUsername) {
    return { error: 'El username es requerido' }
  }

  // Sanitizar y validar username
  const username = rawUsername.trim().toLowerCase()
  
  const validation = isValidUsername(username)
  if (!validation.valid) {
    return { error: validation.message }
  }

  // Verificar si el username ya existe
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) {
    return { error: 'Este username ya está en uso. Probá con otro.' }
  }

  // Crear o actualizar el perfil
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      username,
      full_name: fullName || null,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error creating profile:', error)
    return { error: 'Error al crear el perfil. Intentá de nuevo.' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}
