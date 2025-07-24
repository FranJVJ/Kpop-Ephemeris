/**
 * Script para verificar datos del 23 de julio en Supabase
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

async function checkJuly23Data() {
  try {
    console.log('🔍 Buscando datos para el 23 de julio...')
    
    // Buscar datos para el 23 de julio
    const { data, error } = await supabase
      .from('Kpop_Ephemerides')
      .select('*')
      .eq('day', 23)
      .eq('month', 7)

    if (error) {
      console.error('❌ Error consultando:', error)
      return
    }

    console.log('📋 Datos encontrados para 23/7:', data)
    console.log('📊 Cantidad de registros:', data?.length || 0)

    if (data && data.length > 0) {
      data.forEach((record, index) => {
        console.log(`\n📄 Registro ${index + 1}:`)
        console.log('  - ID:', record.id)
        console.log('  - Año:', record.year)
        console.log('  - Evento:', record.event)
        console.log('  - Año histórico:', record.historical_year)
        console.log('  - Fecha display:', record.display_date)
        console.log('  - Creado:', record.created_at)
      })
    } else {
      console.log('⚠️  No se encontraron datos para el 23 de julio')
    }

    // También verificar todos los datos disponibles
    console.log('\n🗃️  Verificando todos los datos disponibles...')
    const { data: allData } = await supabase
      .from('Kpop_Ephemerides')
      .select('day, month, year, event')
      .order('month', { ascending: true })
      .order('day', { ascending: true })

    if (allData) {
      console.log('📊 Total de registros en la tabla:', allData.length)
      console.log('📅 Fechas disponibles:')
      allData.forEach(record => {
        console.log(`  ${record.day}/${record.month} - Año: ${record.year} - Evento: ${record.event}`)
      })
    }

  } catch (error) {
    console.error('💥 Error:', error)
  }
}

checkJuly23Data()
