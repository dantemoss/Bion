'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileSchema, imageFileSchema, sanitizeString, sanitizeFileName } from '@/lib/validations'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  try {
    // 1. Verificar usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'No autorizado' }
    }

    // 2. Extraer datos del formulario
    const rawData = {
      fullName: formData.get('fullName') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string || '',
      phone: formData.get('phone') as string || '',
      bio: formData.get('bio') as string || '',
      notifications_enabled: formData.get('notifications_enabled') as string || 'false',
      newsletter_enabled: formData.get('newsletter_enabled') as string || 'false',
    }

    // 3. Validar datos con Zod
    const validationResult = profileSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return { error: firstError.message || 'Datos inválidos' }
    }

    const validatedData = validationResult.data

    // 4. Verificar que el username no esté en uso por otro usuario
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', validatedData.username)
      .neq('id', user.id)
      .single()

    if (existingProfile && !checkError) {
      return { error: 'El nombre de usuario ya está en uso' }
    }

    let avatarUrl: string | null = null

    // 5. Procesar imagen si existe
    const file = formData.get('avatar') as File
    if (file && file.size > 0) {
      // Validar archivo con Zod
      const fileValidation = imageFileSchema.safeParse({
        size: file.size,
        type: file.type,
      })

      if (!fileValidation.success) {
        const firstError = fileValidation.error.issues[0]
        return { error: firstError.message || 'Archivo inválido' }
      }

      // Sanitizar nombre del archivo
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const sanitizedFileName = sanitizeFileName(`${user.id}-${Date.now()}.${fileExtension}`)

      // Eliminar avatar anterior si existe
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      if (currentProfile?.avatar_url) {
        // Extraer el nombre del archivo de la URL
        const oldFileName = currentProfile.avatar_url.split('/').pop()
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName])
        }
      }

      // Subir nueva imagen
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(sanitizedFileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError)
        return { error: 'Error al subir la imagen. Intentá nuevamente.' }
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(sanitizedFileName)
      
      avatarUrl = publicUrl
    }

    // 6. Preparar datos a actualizar
    const updates: Record<string, unknown> = {
      full_name: sanitizeString(validatedData.fullName),
      username: validatedData.username,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      bio: validatedData.bio || null,
      notifications_enabled: validatedData.notifications_enabled,
      newsletter_enabled: validatedData.newsletter_enabled,
      updated_at: new Date().toISOString(),
    }

    // Solo actualizar avatar si hay uno nuevo
    if (avatarUrl) {
      updates.avatar_url = avatarUrl
    }

    // 7. Actualizar en la base de datos
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (updateError) {
      console.error('Error al actualizar perfil:', updateError)
      return { error: 'Error al actualizar el perfil. Intentá nuevamente.' }
    }

    // 8. Revalidar rutas
    revalidatePath('/admin')
    revalidatePath('/admin/settings')
    revalidatePath(`/${validatedData.username}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error inesperado al actualizar perfil:', error)
    return { error: 'Error inesperado. Intentá nuevamente.' }
  }
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