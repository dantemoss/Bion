'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 2. Obtener datos del form
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string
  const layout = formData.get('layout') as string
  const file = formData.get('avatar') as File

  let avatarUrl = null

  // 3. Si subió una foto nueva, la guardamos en Storage
  if (file && file.size > 0) {
    // Creamos un nombre único para el archivo
    const fileName = `${user.id}-${Date.now()}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error subiendo imagen:', uploadError)
      return { error: 'Error al subir la imagen' }
    } else {
      // Obtenemos la URL pública para guardarla en la BD
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      avatarUrl = publicUrl
    }
  }

  // 4. Preparamos los datos a actualizar
  const updates: Record<string, unknown> = {
    full_name: fullName,
    username: username,
    layout: layout || 'list',
    updated_at: new Date().toISOString(),
  }

  // Solo actualizamos el avatar si hubo cambio
  if (avatarUrl) {
    updates.avatar_url = avatarUrl
  }

  // 5. Actualizar en la base de datos
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error(error)
    return { error: 'Error al actualizar el perfil' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  revalidatePath(`/${username}`) // Para que se vea en el perfil público
  return { success: true }
}



export async function incrementClick(blockId: string) {
    const supabase = await createClient()
    
    // Usamos rpc (remote procedure call) o un update simple.
    // Como es un contador simple, hacemos un update sumando 1.
    
    // OJO: En una app con mil usuarios por segundo esto se hace distinto,
    // pero para MVP esto funciona perfecto.
    
    // 1. Leemos el valor actual (hack rápido)
    const { data: block } = await supabase
      .from('blocks')
      .select('clicks')
      .eq('id', blockId)
      .single()
      
    if (block) {
      await supabase
          .from('blocks')
          .update({ clicks: block.clicks + 1 })
          .eq('id', blockId)
    }
  }