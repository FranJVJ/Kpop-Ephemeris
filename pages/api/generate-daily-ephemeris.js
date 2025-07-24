/**
 * API Route para generar efemérides diarias automáticamente
 * Compatible con Vercel Cron Jobs
 * 
 * URL: /api/generate-daily-ephemeris
 * Método: GET/POST
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Configurar clientes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Obtiene la fecha del día siguiente
 */
function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    day: tomorrow.getDate(),
    month: tomorrow.getMonth() + 1,
    year: tomorrow.getFullYear(),
    dateString: tomorrow.toLocaleDateString('es-ES', { 
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
    .from('ephemerides')
    .select('*')
    .eq('day', day)
    .eq('month', month)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Error checking existing ephemeris: ${error.message}`)
  }

  return data
}

/**
 * Genera una efeméride usando IA
 */
async function generateEphemerisWithAI(dateInfo) {
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

Formato de respuesta (JSON válido):
{
  "title": "Título del evento",
  "description": "Descripción detallada del evento (máximo 200 caracteres)",
  "year": "Año del evento",
  "category": "Debut|Logro|Récord|Premio|Especial",
  "group": "Nombre del grupo o artista",
  "confidence": "alta|media|baja",
  "sources": "Fuentes o referencias del evento"
}

Fecha objetivo: ${dateInfo.dateString}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Eres un historiador experto en Kpop con acceso a información verificada sobre eventos históricos importantes."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 500
  })

  const response = completion.choices[0].message.content
  const ephemerisData = JSON.parse(response)
  
  // Validar que tenga los campos requeridos
  if (!ephemerisData.title || !ephemerisData.description || !ephemerisData.year) {
    throw new Error('Respuesta de IA incompleta')
  }

  return ephemerisData
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
 * Inserta la efeméride en Supabase
 */
async function insertEphemerisToSupabase(dateInfo, ephemerisData) {
  const ephemerisRecord = {
    day: dateInfo.day,
    month: dateInfo.month,
    historical_year: parseInt(ephemerisData.year),
    event: mapCategoryToNumber(ephemerisData.category),
    title: ephemerisData.title,
    description: ephemerisData.description,
    group_name: ephemerisData.group,
    ai_generated: true,
    confidence_level: ephemerisData.confidence || 'media',
    sources: ephemerisData.sources || null,
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('ephemerides')
    .insert([ephemerisRecord])
    .select()

  if (error) {
    throw new Error(`Error insertando en Supabase: ${error.message}`)
  }

  return data[0]
}

/**
 * Genera efeméride de respaldo
 */
function generateFallbackEphemeris(dateInfo) {
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
 * Handler principal de la API
 */
export default async function handler(req, res) {
  // Verificar que sea una petición autorizada (opcional)
  const authHeader = req.headers.authorization
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('🚀 Iniciando generación de efeméride diaria via API...')
    
    // Obtener fecha del día siguiente
    const dateInfo = getTomorrowDate()
    console.log(`📅 Generando efeméride para: ${dateInfo.dateString} (${dateInfo.day}/${dateInfo.month})`)

    // Verificar si ya existe una efeméride para esta fecha
    const existing = await checkExistingEphemeris(dateInfo.day, dateInfo.month)
    if (existing) {
      console.log('⚠️  Ya existe una efeméride para esta fecha')
      return res.status(200).json({
        success: true,
        message: 'Efeméride ya existente',
        data: existing,
        skipped: true
      })
    }

    // Generar efeméride con IA
    let ephemerisData
    let usedFallback = false
    
    try {
      ephemerisData = await generateEphemerisWithAI(dateInfo)
      console.log('✨ Efeméride generada con IA exitosamente')
    } catch (aiError) {
      console.warn('⚠️  Fallo de IA, usando efeméride de respaldo:', aiError.message)
      ephemerisData = generateFallbackEphemeris(dateInfo)
      usedFallback = true
    }

    // Insertar en Supabase
    const insertedData = await insertEphemerisToSupabase(dateInfo, ephemerisData)

    console.log('🎉 ¡Efeméride diaria generada exitosamente!')
    
    return res.status(200).json({
      success: true,
      message: 'Efeméride generada e insertada',
      data: insertedData,
      usedFallback,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Error en el proceso de generación:', error)
    
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString(),
      timestamp: new Date().toISOString()
    })
  }
}
