/**
 * Script de diagnóstico para verificar la estructura de la tabla
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

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla Kpop_Ephemerides...')
    
    // Intentar obtener todos los datos para ver qué columnas están disponibles
    const { data, error } = await supabase
      .from('Kpop_Ephemerides')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error consultando tabla:', error)
      return
    }

    if (data && data.length > 0) {
      console.log('✅ Estructura de la tabla (campos encontrados):')
      const sample = data[0]
      Object.keys(sample).forEach(column => {
        console.log(`   - ${column}: ${typeof sample[column]} = ${sample[column]}`)
      })
    } else {
      console.log('⚠️  La tabla está vacía, intentando insertar un registro simple para verificar estructura...')
      
      // Intentar insertar solo campos básicos
      const testRecord = {
        day: 1,
        month: 1,
        year: 2020,
        historical_year: 2020,
        historical_day: 1,
        historical_month: 1,
        event: 5,
        display_date: '2020-01-01'
      }
      
      console.log('🧪 Probando inserción básica:', testRecord)
      
      const { data: insertData, error: insertError } = await supabase
        .from('Kpop_Ephemerides')
        .insert([testRecord])
        .select()

      if (insertError) {
        console.error('❌ Error en inserción de prueba:', insertError)
      } else {
        console.log('✅ Inserción de prueba exitosa:', insertData[0])
        
        // Eliminar el registro de prueba
        await supabase
          .from('Kpop_Ephemerides')
          .delete()
          .eq('id', insertData[0].id)
        
        console.log('🗑️  Registro de prueba eliminado')
      }
    }

    // Verificar datos recientes
    console.log('\n📊 Datos recientes en la tabla:')
    const { data: recentData } = await supabase
      .from('Kpop_Ephemerides')
      .select('*')
      .order('id', { ascending: false })
      .limit(3)

    if (recentData && recentData.length > 0) {
      recentData.forEach((record, index) => {
        console.log(`\n   Registro ${index + 1}:`)
        console.log(`   - ID: ${record.id}`)
        console.log(`   - Fecha: ${record.day}/${record.month}/${record.year}`)
        console.log(`   - Event: ${record.event}`)
        if (record.title) console.log(`   - Title: ${record.title}`)
        if (record.ai_generated !== undefined) console.log(`   - AI Generated: ${record.ai_generated}`)
        if (record.artist) console.log(`   - Artist: ${record.artist}`)
      })
    } else {
      console.log('   No hay datos en la tabla')
    }

  } catch (error) {
    console.error('💥 Error en diagnóstico:', error)
  }
}

checkTableStructure()
