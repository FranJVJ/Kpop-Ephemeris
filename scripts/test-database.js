/**
 * Script para probar la nueva base de datos de efemérides
 */

import { generateDailyEphemeris } from './daily-ephemeris-generator-simple.js'

console.log('🧪 Probando sistema de efemérides con base de datos completa...\n')

// Función para generar para una fecha específica
async function testDate(day, month, year = 2025) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📅 Probando fecha: ${day}/${month}/${year}`)
  console.log(`${'='.repeat(60)}`)
  
  try {
    // Modificar temporalmente la función para probar fechas específicas
    const originalDate = new Date()
    const testDate = new Date(year, month - 1, day)
    
    // Simular que es "mañana" de la fecha que queremos
    const yesterday = new Date(testDate)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Simular generación para la fecha específica
    Date.prototype.getDate = function() { return day }
    Date.prototype.getMonth = function() { return month - 1 }
    Date.prototype.getFullYear = function() { return year }
    
    const result = await generateDailyEphemeris(false) // false = para mañana
    
    // Restaurar Date
    Date.prototype.getDate = originalDate.getDate
    Date.prototype.getMonth = originalDate.getMonth  
    Date.prototype.getFullYear = originalDate.getFullYear
    
    return result
  } catch (error) {
    console.error('Error:', error.message)
    return null
  }
}

// Probar fechas con efemérides específicas de la base de datos
const testDates = [
  [5, 8],   // Debut de Girls' Generation
  [8, 8],   // Debut de BLACKPINK
  [25, 7],  // BTS - The Most Beautiful Moment in Life
  [1, 12],  // SHINee - Sherlock
  [27, 7]   // Primer concierto de BTS en USA
]

console.log('🎯 Probando fechas específicas con efemérides históricas...')
for (const [day, month] of testDates) {
  await testDate(day, month)
  await new Promise(resolve => setTimeout(resolve, 1000)) // Pausa de 1 segundo
}
