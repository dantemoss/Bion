'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 2. Obtener datos del form
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string
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
      // Podríamos retornar un error acá, pero sigamos para actualizar el texto
    } else {
      // Obtenemos la URL pública para guardarla en la BD
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      avatarUrl = publicUrl
    }
  }

  // 4. Preparamos los datos a actualizar
  const updates: any = {
    full_name: fullName,
    username: username,
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
    return redirect('/admin/settings?error=true')
  }

  revalidatePath('/admin')
  revalidatePath(`/${username}`) // Para que se vea en el perfil público
  redirect('/admin')
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