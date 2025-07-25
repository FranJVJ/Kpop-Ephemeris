/**
 * API Route para obtener la efeméride de hoy con formato para el frontend
 * 
 * URL: /api/today-ephemeris
 * Método: GET
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
 * Handler principal de la API
 */
export default async function handler(req, res) {
  try {
    console.log('🎯 Obteniendo efeméride para frontend...')
    
    // Obtener parámetros de query o usar fecha actual
    const queryDay = req.query.day ? parseInt(req.query.day) : null
    const queryMonth = req.query.month ? parseInt(req.query.month) : null
    
    let day, month, year, dateString
    
    if (queryDay && queryMonth) {
      // Usar fecha específica de los parámetros
      day = queryDay
      month = queryMonth
      year = new Date().getFullYear()
      
      const targetDate = new Date(year, month - 1, day)
      dateString = targetDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      })
      
      console.log(`📅 Usando fecha específica: ${day}/${month}/${year}`)
    } else {
      // Usar fecha actual
      const today = getTodayDate()
      day = today.day
      month = today.month
      year = today.year
      dateString = today.dateString
      
      console.log(`📅 Usando fecha actual: ${day}/${month}/${year}`)
    }
    
    // Buscar evento histórico para esta fecha
    const eventData = getEphemerisForDate(day, month)
    
    if (eventData) {
      // Crear respuesta formateada para el frontend
      const formattedResponse = {
        date: dateString,
        year: eventData.year,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        group: eventData.group,
        hasRealEvent: true,
        targetDay: day,
        targetMonth: month
      }
      
      console.log('✅ Evento histórico encontrado:', eventData.title)
      
      res.status(200).json({
        success: true,
        data: formattedResponse
      })
    } else {
      // Evento genérico si no hay datos específicos
      const genericResponse = {
        date: dateString,
        year: year.toString(),
        title: "Día K-pop",
        description: "Un día especial para celebrar la música del K-pop y su impacto mundial.",
        category: "Especial",
        group: "K-pop Industry",
        hasRealEvent: false,
        targetDay: day,
        targetMonth: month
      }
      
      console.log('⚠️ No hay evento específico para', `${day}/${month}`, ', usando genérico')
      
      res.status(200).json({
        success: true,
        data: genericResponse
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
