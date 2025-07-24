/**
 * Generador simple para fecha específica usando la base de datos
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { getEphemerisForDate } from './kpop-ephemerides-database.js'

// Cargar variables de entorno
dotenv.config({ path: '../.env.local' })

// Configurar cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function mapCategoryToNumber(category) {
  const categoryMap = {
    'Debut': 1,
    'Logro': 2,
    'Récord': 3,
    'Premio': 4,
    'Especial': 5
  }
  return categoryMap[category] || 5
}

async function generateSpecificDate(day, month, year = 2025) {
  console.log(`🎯 Generando efeméride para ${day}/${month}/${year}...`)
  
  // Obtener efeméride de la base de datos
  const ephemerisData = getEphemerisForDate(day, month)
  
  if (!ephemerisData) {
    console.log('❌ No hay efeméride para esta fecha en la base de datos')
    return
  }
  
  console.log('📚 Efeméride encontrada en la base de datos:')
  console.log(`   📝 Título: ${ephemerisData.title}`)
  console.log(`   📄 Descripción: ${ephemerisData.description}`)
  console.log(`   📅 Año histórico: ${ephemerisData.year}`)
  console.log(`   🏷️  Categoría: ${ephemerisData.category}`)
  console.log(`   👥 Grupo: ${ephemerisData.group}`)
  console.log(`   🎯 Confianza: ${ephemerisData.confidence}`)
  console.log(`   📚 Fuentes: ${ephemerisData.sources}`)
  
  const dateInfo = {
    day,
    month,
    year,
    dateString: new Date(year, month - 1, day).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  const ephemerisRecord = {
    day: dateInfo.day,
    month: dateInfo.month,
    year: parseInt(ephemerisData.year),
    historical_year: parseInt(ephemerisData.year),
    historical_day: dateInfo.day,
    historical_month: dateInfo.month,
    event: mapCategoryToNumber(ephemerisData.category),
    display_date: `${ephemerisData.year}-${String(dateInfo.month).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`
  }

  console.log('\n📝 Insertando en base de datos...')
  
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .insert([ephemerisRecord])
    .select()

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log('✅ ¡Efeméride histórica insertada exitosamente!')
  console.log(`🆔 ID: ${data[0].id}`)
  console.log(`📊 Evento tipo: ${data[0].event}`)
  console.log(`📅 Fecha histórica: ${data[0].historical_year}`)
  
  return data[0]
}

// Probar con varias fechas históricas
console.log('🎵 Probando con fechas históricas del K-pop\n')

console.log('1️⃣ Debut de Girls\' Generation (5 de agosto)')
await generateSpecificDate(5, 8)

console.log('\n' + '='.repeat(60) + '\n')

console.log('2️⃣ Debut de BLACKPINK (8 de agosto)')
await generateSpecificDate(8, 8)
