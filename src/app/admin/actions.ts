'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { blockSchema, blockIdSchema, reorderBlocksSchema, sanitizeString, sanitizeUrl } from '@/lib/validations'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

export async function createBlock(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  try {
    // 2. Extraer y validar datos del formulario
    const rawData = {
      title: formData.get('title') as string,
      url: formData.get('url') as string,
      type: formData.get('type') as string,
    }

    // 3. Validar con Zod
    const validationResult = blockSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return { error: firstError.message || 'Datos inválidos' }
    }

    const validatedData = validationResult.data

    // 4. Sanitizar datos adicionales
    const sanitizedTitle = sanitizeString(validatedData.title)
    const sanitizedUrl = validatedData.url ? sanitizeUrl(validatedData.url) : null

    // 5. Verificar que si es header, la URL debe estar vacía
    if (validatedData.type === 'header' && sanitizedUrl) {
      return { error: 'Los bloques de tipo header no pueden tener URL' }
    }

    // 6. Verificar que si no es header, debe tener URL
    if (validatedData.type !== 'header' && !sanitizedUrl) {
      return { error: 'Los bloques de tipo link deben tener una URL válida' }
    }

    // 7. Obtener la posición máxima para agregar al final
    const { data: existingBlocks } = await supabase
      .from('blocks')
      .select('position')
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = existingBlocks && existingBlocks.length > 0 
      ? existingBlocks[0].position + 1 
      : 0

    // 8. Guardar en Supabase
    const { error } = await supabase.from('blocks').insert({
      user_id: user.id,
      title: sanitizedTitle,
      url: sanitizedUrl,
      type: validatedData.type,
      content: {}, // JSON vacío por ahora
      position: nextPosition,
    })

    if (error) {
      console.error('Error al crear bloque:', error)
      return { error: 'Error al crear el bloque. Intenta nuevamente.' }
    }

    // 9. Refrescar la pantalla para ver el bloque nuevo
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error inesperado al crear bloque:', error)
    return { error: 'Error inesperado. Intenta nuevamente.' }
  }
}

export async function incrementClick(blockId: string) {
  const supabase = await createClient()
  
  try {
    // 1. Validar ID del bloque
    const idValidation = blockIdSchema.safeParse(blockId)
    if (!idValidation.success) {
      return { error: 'ID de bloque inválido' }
    }

    // 2. Leemos el valor actual
    const { data: block, error: fetchError } = await supabase
      .from('blocks')
      .select('clicks')
      .eq('id', blockId)
      .single()
    
    if (fetchError || !block) {
      return { error: 'Bloque no encontrado' }
    }

    // 3. Sumamos 1 (proteger contra overflow)
    const newClicks = Math.min((block.clicks || 0) + 1, Number.MAX_SAFE_INTEGER)
    
    const { error: updateError } = await supabase
      .from('blocks')
      .update({ clicks: newClicks })
      .eq('id', blockId)

    if (updateError) {
      console.error('Error al incrementar clicks:', updateError)
      return { error: 'Error al registrar el click' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error inesperado al incrementar clicks:', error)
    return { error: 'Error inesperado' }
  }
}

export async function deleteBlock(blockId: string) {
  const supabase = await createClient()
  
  try {
    // 1. Verificar usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'No autorizado' }
    }

    // 2. Validar ID del bloque
    const idValidation = blockIdSchema.safeParse(blockId)
    if (!idValidation.success) {
      return { error: 'ID de bloque inválido' }
    }

    // 3. Verificar que el bloque existe y pertenece al usuario (doble verificación)
    const { data: block, error: fetchError } = await supabase
      .from('blocks')
      .select('id, user_id')
      .eq('id', blockId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !block) {
      return { error: 'Bloque no encontrado o no tienes permisos para eliminarlo' }
    }

    // 4. Borrar el bloque
    const { error: deleteError } = await supabase
      .from('blocks')
      .delete()
      .eq('id', blockId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error al eliminar bloque:', deleteError)
      return { error: 'Error al eliminar el bloque' }
    }

    // 5. Refrescar la página
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error inesperado al eliminar bloque:', error)
    return { error: 'Error inesperado. Intenta nuevamente.' }
  }
}

export async function updateBlock(blockId: string, data: { title: string; url: string; type: string }) {
  const supabase = await createClient()
  
  try {
    // 1. Verificar usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'No autorizado' }
    }

    // 2. Validar ID del bloque
    const idValidation = blockIdSchema.safeParse(blockId)
    if (!idValidation.success) {
      return { error: 'ID de bloque inválido' }
    }

    // 3. Validar datos con Zod
    const validationResult = blockSchema.safeParse(data)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return { error: firstError.message || 'Datos inválidos' }
    }

    const validatedData = validationResult.data

    // 4. Sanitizar datos adicionales
    const sanitizedTitle = sanitizeString(validatedData.title)
    const sanitizedUrl = validatedData.url ? sanitizeUrl(validatedData.url) : null

    // 5. Verificar que si es header, la URL debe estar vacía
    if (validatedData.type === 'header' && sanitizedUrl) {
      return { error: 'Los bloques de tipo header no pueden tener URL' }
    }

    // 6. Verificar que si no es header, debe tener URL
    if (validatedData.type !== 'header' && !sanitizedUrl) {
      return { error: 'Los bloques de tipo link deben tener una URL válida' }
    }

    // 7. Verificar que el bloque existe y pertenece al usuario
    const { data: existingBlock, error: fetchError } = await supabase
      .from('blocks')
      .select('id, user_id')
      .eq('id', blockId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingBlock) {
      return { error: 'Bloque no encontrado o no tienes permisos para actualizarlo' }
    }

    // 8. Actualizar el bloque
    const { error: updateError } = await supabase
      .from('blocks')
      .update({
        title: sanitizedTitle,
        url: sanitizedUrl,
        type: validatedData.type,
      })
      .eq('id', blockId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error al actualizar bloque:', updateError)
      return { error: 'Error al actualizar el bloque' }
    }

    // 9. Refrescar la página
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error inesperado al actualizar bloque:', error)
    return { error: 'Error inesperado. Intenta nuevamente.' }
  }
}

export async function reorderBlocks(orderedIds: string[]) {
  const supabase = await createClient()
  
  try {
    // 1. Verificar usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'No autorizado' }
    }

    // 2. Validar array de IDs con Zod
    const validationResult = reorderBlocksSchema.safeParse(orderedIds)
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return { error: firstError.message || 'IDs inválidos' }
    }

    const validatedIds = validationResult.data

    // 3. Verificar que todos los bloques pertenecen al usuario
    const { data: userBlocks, error: fetchError } = await supabase
      .from('blocks')
      .select('id')
      .eq('user_id', user.id)
      .in('id', validatedIds)

    if (fetchError) {
      console.error('Error al verificar bloques:', fetchError)
      return { error: 'Error al verificar los bloques' }
    }

    // 4. Verificar que todos los IDs proporcionados pertenecen al usuario
    const userBlockIds = new Set(userBlocks?.map(b => b.id) || [])
    const invalidIds = validatedIds.filter(id => !userBlockIds.has(id))

    if (invalidIds.length > 0) {
      return { error: 'Algunos bloques no pertenecen a tu cuenta' }
    }

    // 5. Actualizar posición de cada bloque
    const updates = validatedIds.map((id, index) => 
      supabase
        .from('blocks')
        .update({ position: index })
        .eq('id', id)
        .eq('user_id', user.id)
    )

    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)

    if (hasError) {
      console.error('Error al actualizar posiciones:', results.find(r => r.error)?.error)
      return { error: 'Error al reordenar los bloques' }
    }

    // 6. Refrescar la página
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error inesperado al reordenar bloques:', error)
    return { error: 'Error inesperado. Intenta nuevamente.' }
  }
}