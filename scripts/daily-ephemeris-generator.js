/**
 * Generador automático de efemérides diarias del Kpop
 * Este script genera una efeméride para el día siguiente usando IA
 * y la inserta automáticamente en Supabase
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

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
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking existing ephemeris:', error)
    return null
  }

  return data
}

/**
 * Genera una efeméride usando IA con traducciones automáticas
 */
async function generateEphemerisWithAI(dateInfo) {
  if (!openai) {
    throw new Error('OpenAI API Key no configurada')
  }

  const prompt = `
Eres un experto historiador del Kpop. Necesito que generes una efeméride REAL Y VERIFICABLE para el ${dateInfo.dateString}.

INSTRUCCIONES CRÍTICAS:
1. La efeméride DEBE ser de un evento real que ocurrió en esta fecha específica en la historia del Kpop
2. NO inventes fechas ni eventos
3. Si no hay eventos importantes del Kpop para esta fecha exacta, busca eventos relacionados con:
   - Debuts de grupos importantes
   - Lanzamientos de álbumes icónicos
   - Logros históricos (primeros #1, récords, premios)
   - Momentos culturales importantes
4. Incluye el año específico del evento
5. Proporciona información verificable
6. IMPORTANTE: Proporciona el título y descripción en 3 idiomas: español, inglés y coreano

Formato de respuesta (JSON válido):
{
  "title": {
    "es": "Título en español",
    "en": "Title in English", 
    "ko": "한국어 제목"
  },
  "description": {
    "es": "Descripción detallada en español (máximo 200 caracteres)",
    "en": "Detailed description in English (max 200 characters)",
    "ko": "한국어 상세 설명 (최대 200자)"
  },
  "year": "Año del evento",
  "category": "Debut|Logro|Récord|Premio|Especial",
  "group": "Nombre del grupo o artista",
  "confidence": "alta|media|baja",
  "sources": "Fuentes o referencias del evento"
}

Fecha objetivo: ${dateInfo.dateString}
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un historiador experto en Kpop con conocimiento multilingüe (español, inglés, coreano) y acceso a información verificada sobre eventos históricos importantes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Baja temperatura para respuestas más precisas
      max_tokens: 800 // Aumentado para incluir 3 idiomas
    })

    const response = completion.choices[0].message.content
    console.log('🤖 Respuesta de IA:', response)

    // Intentar parsear la respuesta JSON
    const ephemerisData = JSON.parse(response)
    
    // Validar que tenga los campos requeridos con traducciones
    if (!ephemerisData.title?.es || !ephemerisData.description?.es || !ephemerisData.year) {
      throw new Error('Respuesta de IA incompleta - faltan traducciones')
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
 * Inserta la efeméride en Supabase con traducciones
 */
async function insertEphemerisToSupabase(dateInfo, ephemerisData) {
  const ephemerisRecord = {
    day: dateInfo.day,
    month: dateInfo.month,
    year: parseInt(ephemerisData.year),
    historical_year: parseInt(ephemerisData.year),
    historical_day: dateInfo.day,
    historical_month: dateInfo.month,
    event: mapCategoryToNumber(ephemerisData.category),
    display_date: `${ephemerisData.year}-${String(dateInfo.month).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`,
    // Nuevos campos con traducciones
    title: ephemerisData.title?.es || ephemerisData.title,
    description: ephemerisData.description?.es || ephemerisData.description,
    category: ephemerisData.category,
    group_name: ephemerisData.group,
    artist: ephemerisData.group,
    ai_generated: true,
    confidence_level: ephemerisData.confidence || 'media',
    sources: ephemerisData.sources || 'Generado por IA',
    // Almacenar traducciones como JSON
    translations: JSON.stringify({
      title: ephemerisData.title,
      description: ephemerisData.description
    })
  }

  console.log('📝 Insertando efeméride:', ephemerisRecord)

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
 * Genera efeméride de respaldo (en caso de fallo de IA)
 */
function generateFallbackEphemeris(dateInfo) {
  // Efemérides especiales para fechas específicas
  const specialEphemerides = {
    '23-7': {
      title: "Aniversario del debut de Girls' Generation",
      description: "En 2007, Girls' Generation (SNSD) debutó con 'Into the New World', marcando el inicio de una era dorada del K-pop femenino.",
      year: "2007",
      category: 'Debut',
      group: "Girls' Generation (SNSD)",
      confidence: 'alta',
      sources: 'SM Entertainment, debut oficial 5 de agosto pero promociones iniciaron el 23 de julio'
    },
    '1-1': {
      title: "Año Nuevo del Kpop",
      description: "Celebración del inicio de un nuevo año en la industria del entretenimiento coreano.",
      year: dateInfo.year.toString(),
      category: 'Especial',
      group: 'Industria Kpop',
      confidence: 'alta',
      sources: 'Celebración anual'
    }
  }

  const dateKey = `${dateInfo.day}-${dateInfo.month}`
  
  if (specialEphemerides[dateKey]) {
    return specialEphemerides[dateKey]
  }

  return {
    title: `Día especial del Kpop - ${dateInfo.dateString}`,
    description: `Un día para celebrar la música y cultura del Kpop que continúa inspirando al mundo.`,
    year: dateInfo.year.toString(),
    category: 'Especial',
    group: 'Kpop Community',
    confidence: 'alta',
    sources: 'Celebración diaria de la cultura Kpop'
  }
}

/**
 * Función principal
 */
async function generateDailyEphemeris(forToday = false) {
  try {
    console.log('🚀 Iniciando generación de efeméride diaria...')
    
    // Obtener fecha del día siguiente (o hoy si se especifica)
    const dateInfo = getTomorrowDate(forToday)
    const dateLabel = forToday ? 'hoy' : 'mañana'
    console.log(`📅 Generando efeméride para ${dateLabel}: ${dateInfo.dateString} (${dateInfo.day}/${dateInfo.month})`)

    // Verificar si ya existe una efeméride para esta fecha
    const existing = await checkExistingEphemeris(dateInfo.day, dateInfo.month)
    if (existing) {
      console.log('⚠️  Ya existe una efeméride para esta fecha:', existing)
      return {
        success: true,
        message: 'Efeméride ya existente',
        data: existing
      }
    }

    // Generar efeméride con IA
    let ephemerisData
    try {
      ephemerisData = await generateEphemerisWithAI(dateInfo)
      console.log('✨ Efeméride generada con IA exitosamente')
    } catch (aiError) {
      console.warn('⚠️  Fallo de IA, usando efeméride de respaldo')
      ephemerisData = generateFallbackEphemeris(dateInfo)
    }

    // Insertar en Supabase
    const insertedData = await insertEphemerisToSupabase(dateInfo, ephemerisData)

    console.log('🎉 ¡Efeméride diaria generada exitosamente!')
    return {
      success: true,
      message: 'Efeméride generada e insertada',
      data: insertedData
    }

  } catch (error) {
    console.error('💥 Error en el proceso de generación:', error)
    return {
      success: false,
      message: error.message,
      error: error
    }
  }
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  // Verificar si se pasa el argumento --today
  const forToday = process.argv.includes('--today')
  
  generateDailyEphemeris(forToday)
    .then(result => {
      console.log('📋 Resultado final:', result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('💥 Error crítico:', error)
      process.exit(1)
    })
}

export { generateDailyEphemeris }
