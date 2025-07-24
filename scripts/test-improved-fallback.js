/**
 * Script para generar efeméride para fecha específica
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

// Importar la función de generación de fallback mejorada
function generateFallbackEphemeris(dateInfo) {
  // Sistema de efemérides rotativas más interesantes
  const dayOfYear = Math.floor((new Date(dateInfo.year, dateInfo.month - 1, dateInfo.day) - new Date(dateInfo.year, 0, 0)) / 86400000)
  const rotationIndex = dayOfYear % 10 // Rotar entre 10 opciones diferentes

  const rotatingEphemerides = [
    {
      title: "Día de las colaboraciones históricas del K-pop",
      description: "Celebramos las colaboraciones más icónicas que han unido a diferentes generaciones y estilos del K-pop.",
      category: 'Logro',
      group: 'K-pop Industry'
    },
    {
      title: "Aniversario de los primeros pasos del Hallyu",
      description: "Recordamos los momentos que llevaron la cultura coreana al mundo y establecieron las bases del K-pop global.",
      category: 'Logro',
      group: 'Hallyu Wave'
    },
    {
      title: "Día del reconocimiento a los productores de K-pop",
      description: "Honramos a los productores y compositores que han creado los sonidos más emblemáticos del K-pop.",
      category: 'Premio',
      group: 'K-pop Producers'
    },
    {
      title: "Celebración de las coreografías revolucionarias",
      description: "Un día para recordar las coreografías que cambiaron la forma de entender la performance en el K-pop.",
      category: 'Logro',
      group: 'K-pop Choreographers'
    },
    {
      title: "Día de los récords internacionales del K-pop",
      description: "Conmemoramos los momentos en que el K-pop rompió barreras y estableció nuevos récords mundiales.",
      category: 'Récord',
      group: 'Global K-pop'
    },
    {
      title: "Aniversario de las primeras giras mundiales",
      description: "Recordamos cuando los artistas de K-pop comenzaron a conquistar escenarios alrededor del mundo.",
      category: 'Logro',
      group: 'K-pop Tours'
    },
    {
      title: "Día de la innovación musical en el K-pop",
      description: "Celebramos los experimentos sonoros y fusiones que han enriquecido el panorama musical del K-pop.",
      category: 'Logro',
      group: 'K-pop Innovation'
    },
    {
      title: "Conmemoración de los debuts más esperados",
      description: "Un día para recordar los debuts que generaron mayor expectación en la historia del K-pop.",
      category: 'Debut',
      group: 'K-pop Rookies'
    },
    {
      title: "Día del impacto social del K-pop",
      description: "Celebramos cómo el K-pop ha inspirado movimientos sociales y conectado culturas alrededor del mundo.",
      category: 'Especial',
      group: 'K-pop Social Impact'
    },
    {
      title: "Aniversario de las transformaciones artísticas",
      description: "Recordamos los momentos en que los artistas reinventaron su imagen y sonido, marcando nuevas eras.",
      category: 'Logro',
      group: 'K-pop Evolution'
    }
  ]

  const selectedEphemeris = rotatingEphemerides[rotationIndex]
  
  return {
    title: selectedEphemeris.title,
    description: selectedEphemeris.description,
    year: dateInfo.year.toString(),
    category: selectedEphemeris.category,
    group: selectedEphemeris.group
  }
}

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

async function generateForDate(day, month, year = 2025) {
  const dateInfo = {
    day,
    month,
    year,
    dateString: new Date(year, month - 1, day).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  console.log(`🎲 Generando efeméride mejorada para ${dateInfo.dateString}...`)
  
  const ephemerisData = generateFallbackEphemeris(dateInfo)
  
  console.log('📋 Datos generados:')
  console.log(`   Título: ${ephemerisData.title}`)
  console.log(`   Descripción: ${ephemerisData.description}`)
  console.log(`   Categoría: ${ephemerisData.category}`)
  console.log(`   Grupo: ${ephemerisData.group}`)
  
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

  console.log('📝 Insertando en base de datos...')
  
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .insert([ephemerisRecord])
    .select()

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log('✅ ¡Efeméride mejorada insertada exitosamente!')
  console.log('🆔 ID:', data[0].id)
  return data[0]
}

// Generar para varias fechas para mostrar variedad
await generateForDate(26, 7)
console.log('\n' + '='.repeat(50) + '\n')
await generateForDate(27, 7)
console.log('\n' + '='.repeat(50) + '\n')
await generateForDate(28, 7)
