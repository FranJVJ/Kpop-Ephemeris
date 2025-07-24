/**
 * Script para verificar y mostrar la estructura actual de la tabla ephemerides
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

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla ephemerides...')
    
    // Intentar obtener todos los registros para ver qué columnas existen
    const { data, error } = await supabase
      .from('Kpop_Ephemerides')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error consultando tabla:', error)
      return
    }

    console.log('✅ Estructura actual de la tabla:')
    if (data && data.length > 0) {
      console.log('📋 Columnas encontradas:', Object.keys(data[0]))
      console.log('📄 Ejemplo de registro:', data[0])
    } else {
      console.log('📄 Tabla vacía, intentando insertar registro simple...')
      
      // Intentar insertar un registro simple
      const { data: insertData, error: insertError } = await supabase
        .from('ephemerides')
        .insert([{
          day: 23,
          month: 7,
          year: 2007,
          event: 1
        }])
        .select()

      if (insertError) {
        console.error('❌ Error insertando registro simple:', insertError)
      } else {
        console.log('✅ Registro simple insertado:', insertData)
      }
    }

  } catch (error) {
    console.error('💥 Error:', error)
  }
}

checkTableStructure()
