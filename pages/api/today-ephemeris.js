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
    console.log('🎯 Obteniendo efeméride de hoy para frontend...')
    
    // Obtener fecha actual
    const { day, month, year, dateString } = getTodayDate()
    
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
        hasRealEvent: true
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
        hasRealEvent: false
      }
      
      console.log('⚠️ No hay evento específico, usando genérico')
      
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
