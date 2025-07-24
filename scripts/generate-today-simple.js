/**
 * Generador simple de efemérides para pruebas
 * Funciona sin OpenAI, solo con datos locales
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Genera efeméride para el 23 de julio (hoy)
 */
async function generateTodayEphemeris() {
  try {
    console.log('🚀 Generando efeméride para el 23 de julio...')
    
    const today = new Date()
    const ephemerisData = {
      day: 23,
      month: 7,
      year: 2007,
      event: 1, // Debut
      historical_day: 23,
      historical_month: 7,
      historical_year: 2007,
      display_date: '2007-07-23'
    }

    console.log('📝 Datos a insertar:', ephemerisData)

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('Kpop_Ephemerides')
      .select('*')
      .eq('day', 23)
      .eq('month', 7)
      .single()

    if (existing) {
      console.log('⚠️  Ya existe una efeméride para el 23 de julio:', existing)
      return { success: true, message: 'Ya existe', data: existing }
    }

    // Insertar nueva efeméride
    const { data, error } = await supabase
      .from('Kpop_Ephemerides')
      .insert([ephemerisData])
      .select()

    if (error) {
      console.error('❌ Error insertando:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Efeméride insertada exitosamente!')
    console.log('📋 Datos insertados:', data[0])
    
    return { success: true, data: data[0] }

  } catch (error) {
    console.error('💥 Error:', error)
    return { success: false, error: error.message }
  }
}

// Ejecutar
generateTodayEphemeris()
  .then(result => {
    console.log('\n🎉 Resultado final:', result)
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error crítico:', error)
    process.exit(1)
  })
