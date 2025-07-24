/**
 * Generador automático de efemérides diarias del Kpop (Versión Simple)
 * Esta versión funciona con la estructura actual de la base de datos
 * Sin necesidad de columnas adicionales
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { getEphemerisForDate } from './kpop-ephemerides-database.js'

// Cargar variables de entorno
dotenv.config({ path: '../.env.local' })

// Configurar clientes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// OpenAI solo si hay API key configurada
let openai = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

/**
 * Obtiene la fecha del día siguiente (o hoy si se especifica)
 */
function getTomorrowDate(useToday = false) {
  const targetDate = new Date()
  if (!useToday) {
    targetDate.setDate(targetDate.getDate() + 1)
  }
  return {
    day: targetDate.getDate(),
    month: targetDate.getMonth() + 1,
    year: targetDate.getFullYear(),
    dateString: targetDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    })
  }
}

/**
 * Verifica si ya existe una efeméride para la fecha dada
 */
async function checkExistingEphemeris(day, month) {
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .select('*')
    .eq('day', day)
    .eq('month', month)

  if (error) {
    console.error('❌ Error verificando efeméride existente:', error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

/**
 * Genera efeméride con IA (versión simplificada)
 */
async function generateEphemerisWithAI(dateInfo) {
  if (!openai) {
    throw new Error('OpenAI no configurado')
  }

  const prompt = `Genera una efeméride del Kpop para el ${dateInfo.dateString}. 
Debe ser un evento histórico real y verificable relacionado con el Kpop.

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título del evento en español",
  "description": "Descripción detallada del evento en español",
  "year": "Año del evento",
  "category": "Debut|Logro|Récord|Premio|Especial",
  "group": "Nombre del grupo o artista"
}

Fecha objetivo: ${dateInfo.dateString}
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un historiador experto en Kpop con conocimiento de eventos históricos importantes verificados."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 400
    })

    const response = completion.choices[0].message.content
    console.log('🤖 Respuesta de IA:', response)

    const ephemerisData = JSON.parse(response)
    
    if (!ephemerisData.title || !ephemerisData.description || !ephemerisData.year) {
      throw new Error('Respuesta de IA incompleta')
    }

    return ephemerisData
  } catch (error) {
    console.error('❌ Error generando efeméride con IA:', error)
    throw error
  }
}

/**
 * Mapea categorías a números para la base de datos
 */
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

/**
 * Inserta efeméride en Supabase (versión simple - solo columnas existentes)
 */
async function insertSimpleEphemerisToSupabase(dateInfo, ephemerisData) {
  const ephemerisRecord = {
    day: dateInfo.day,
    month: dateInfo.month,
    year: parseInt(ephemerisData.year),
    historical_year: parseInt(ephemerisData.year),
    historical_day: dateInfo.day,
    historical_month: dateInfo.month,
    event: mapCategoryToNumber(ephemerisData.category),
    display_date: `${ephemerisData.year}-${String(dateInfo.month).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`
    // Solo campos que REALMENTE existen según el diagnóstico
  }

  console.log('📝 Insertando efeméride ultra simple:', ephemerisRecord)

  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .insert([ephemerisRecord])
    .select()

  if (error) {
    console.error('❌ Error insertando en Supabase:', error)
    throw error
  }

  console.log('✅ Efeméride insertada exitosamente:', data[0])
  return data[0]
}

/**
 * Genera efeméride de respaldo usando la base de datos completa
 */
function generateFallbackEphemeris(dateInfo) {
  // Primero intentar obtener de la base de datos
  const ephemeris = getEphemerisForDate(dateInfo.day, dateInfo.month)
  
  if (ephemeris) {
    console.log(`📚 Usando efeméride de la base de datos para ${dateInfo.day}/${dateInfo.month}`)
    return ephemeris
  }

  // Si no hay efeméride específica para la fecha, usar el sistema rotativo mejorado
  console.log(`🔄 No hay efeméride específica para ${dateInfo.day}/${dateInfo.month}, usando sistema rotativo`)
  
  const dayOfYear = Math.floor((new Date(dateInfo.year, dateInfo.month - 1, dateInfo.day) - new Date(dateInfo.year, 0, 0)) / 86400000)
  const rotationIndex = dayOfYear % 10

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
    group: selectedEphemeris.group,
    confidence: 'media',
    sources: 'Sistema rotativo de efemérides temáticas'
  }
}

/**
 * Función principal
 */
async function generateDailyEphemeris(useToday = false) {
  try {
    console.log('🚀 Iniciando generación de efeméride diaria (versión simple)...')
    
    const dateInfo = getTomorrowDate(useToday)
    console.log(`📅 Generando efeméride para ${useToday ? 'hoy' : 'mañana'}: ${dateInfo.dateString} (${dateInfo.day}/${dateInfo.month})`)

    // Verificar si ya existe una efeméride para esta fecha
    const existing = await checkExistingEphemeris(dateInfo.day, dateInfo.month)
    if (existing) {
      console.log('⚠️  Ya existe una efeméride para esta fecha:', existing)
      return existing
    }

    let ephemerisData
    try {
      // Intentar generar con IA
      ephemerisData = await generateEphemerisWithAI(dateInfo)
      console.log('✨ Efeméride generada con IA exitosamente')
    } catch (error) {
      console.log('⚠️  Fallo de IA, usando efeméride de respaldo')
      ephemerisData = generateFallbackEphemeris(dateInfo)
    }

    // Insertar en la base de datos
    const insertedData = await insertSimpleEphemerisToSupabase(dateInfo, ephemerisData)
    
    console.log('🎉 Proceso completado exitosamente')
    console.log('📊 Resumen:')
    console.log(`   Fecha: ${dateInfo.dateString}`)
    console.log(`   Título: ${ephemerisData.title}`)
    console.log(`   Grupo: ${ephemerisData.group}`)
    console.log(`   Año: ${ephemerisData.year}`)
    
    return insertedData

  } catch (error) {
    console.error('💥 Error en el proceso de generación:', error)
    console.error('❌ Error generando efeméride:')
    console.error(`   Error: ${error.message}`)
    console.error(`   Detalles: ${error.message}`)
    throw error
  }
}

// Ejecutar si se llama directamente
if (process.argv[1].endsWith('daily-ephemeris-generator-simple.js')) {
  const useToday = process.argv.includes('--today')
  generateDailyEphemeris(useToday)
    .then(() => {
      console.log('✅ Generación completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

export { generateDailyEphemeris }
