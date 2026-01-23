'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

import { revalidatePath } from 'next/cache' // <--- Agregá este import arriba de todo

// ... (código anterior de signOut)

export async function createBlock(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 2. Sacar datos del formulario
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const type = formData.get('type') as string

  // 3. Guardar en Supabase
  await supabase.from('blocks').insert({
    user_id: user.id,
    title,
    url,
    type,
    content: {}, // JSON vacío por ahora
    position: 0, // Después arreglamos el orden
  })

  // 4. Refrescar la pantalla para ver el bloque nuevo
  revalidatePath('/admin')
}

export async function incrementClick(blockId: string) {
  const supabase = await createClient()
  
  // 1. Leemos el valor actual
  const { data: block } = await supabase
    .from('blocks')
    .select('clicks')
    .eq('id', blockId)
    .single()
    
  if (block) {
    // 2. Sumamos 1
    await supabase
        .from('blocks')
        .update({ clicks: block.clicks + 1 })
        .eq('id', blockId)
  }
}