/**
 * Script para limpiar efemérides de prueba
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '../.env.local' })

// Configurar cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function deleteEphemeris(day, month) {
  console.log(`🗑️  Eliminando efeméride del ${day}/${month}...`)
  
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .delete()
    .eq('day', day)
    .eq('month', month)
    .select()

  if (error) {
    console.error('❌ Error eliminando:', error)
    return false
  }

  if (data && data.length > 0) {
    console.log('✅ Efeméride eliminada:', data[0])
    return true
  } else {
    console.log('ℹ️  No se encontró efeméride para esa fecha')
    return false
  }
}

// Eliminar varias fechas para probar
await deleteEphemeris(5, 8)   // Girls' Generation debut
await deleteEphemeris(8, 8)   // BLACKPINK debut  
await deleteEphemeris(27, 7)  // BTS first US concert
