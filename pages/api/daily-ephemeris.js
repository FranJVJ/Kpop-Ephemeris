/**
 * API Route para generar efemérides diarias automáticamente
 * Usa la base de datos local de efemérides K-pop
 * 
 * URL: /api/daily-ephemeris
 * Método: GET/POST
 */

import { createClient } from '@supabase/supabase-js'
import { getEphemerisForDate } from '../../lib/kpopDatabase.js'

// Configurar cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Obtiene la fecha actual
 */
function getTodayDate() {
  const today = new Date()
  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    dateString: today.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }
}

/**
 * Verifica si ya existe una efeméride para hoy
 */
async function checkExistingEphemeris(day, month, year) {
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .select('*')
    .eq('day', day)
    .eq('month', month)
    .eq('year', year)
    .single()
  
  return { exists: !error && data !== null, data }
}

/**
 * Crea una nueva efeméride en la base de datos
 */
async function createEphemeris(day, month, year, eventData) {
  const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  
  // Crear efeméride usando la estructura real de la tabla
  const ephemerisData = {
    day: day,
    month: month,
    year: year,
    historical_day: eventData ? parseInt(eventData.year.substring(2)) : day, // Usar año como día histórico simplificado
    historical_month: month,
    historical_year: eventData ? parseInt(eventData.year) : year,
    event: 1, // ID del evento (simplificado)
    display_date: dateString
  }
  
  const { data, error } = await supabase
    .from('Kpop_Ephemerides')
    .insert([ephemerisData])
    .select()
  
  if (error) {
    throw new Error(`Error insertando efeméride: ${error.message}`)
  }
  
  return data[0]
}

/**
 * Handler principal de la API
 */
export default async function handler(req, res) {
  try {
    console.log('🚀 Iniciando generación de efemérides diarias...')
    
    // Obtener fecha actual
    const { day, month, year, dateString } = getTodayDate()
    
    console.log(`📅 Fecha objetivo: ${dateString} (${day}/${month}/${year})`)
    
    // Verificar si ya existe una efeméride para hoy
    const { exists, data: existingData } = await checkExistingEphemeris(day, month, year)
    
    if (exists) {
      console.log('✅ Ya existe efeméride para hoy')
      return res.status(200).json({
        success: true,
        message: 'Efeméride ya existe para hoy',
        data: existingData,
        date: dateString
      })
    }
    
    // Buscar evento histórico para esta fecha
    const eventData = getEphemerisForDate(day, month)
    
    console.log(`🎵 Evento encontrado:`, eventData ? eventData.title : 'Ninguno específico')
    
    // Crear nueva efeméride
    const newEphemeris = await createEphemeris(day, month, year, eventData)
    
    console.log('✅ Efeméride creada exitosamente:', newEphemeris.id)
    
    res.status(200).json({
      success: true,
      message: 'Efeméride generada exitosamente',
      data: newEphemeris,
      date: dateString,
      historicalEvent: eventData
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
