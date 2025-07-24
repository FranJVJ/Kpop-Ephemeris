/**
 * Scheduler automático para generar efemérides diarias del Kpop
 * Versión con Base de Datos Completa - Eventos históricos reales
 * Se ejecuta todos los días a las 15:00 hora española
 */

import cron from 'node-cron'
import { generateDailyEphemeris } from './daily-ephemeris-generator-simple.js'

console.log('🕐 Iniciando scheduler de efemérides del K-pop (Con Base de Datos Histórica)...')
console.log('⏰ Programado para ejecutarse todos los días a las 15:00 (hora española)')
console.log('📚 Usando base de datos completa de eventos históricos del K-pop')

// Función para notificar éxito
function notifySuccess(result) {
  const now = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
  console.log(`\n🎉 [${now}] ¡Efeméride histórica generada exitosamente!`)
  console.log(`📅 Fecha: ${result.day}/${result.month}/${result.year}`)
  console.log(`🆔 ID: ${result.id}`)
  console.log(`📊 Evento tipo: ${result.event}`)
  console.log(`📍 Año histórico: ${result.historical_year}`)
  console.log('✅ Sistema funcionando correctamente con datos históricos reales\n')
}

// Función para notificar errores
function notifyError(error) {
  const now = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
  console.error(`\n❌ [${now}] Error generando efeméride:`)
  console.error(`💥 Error: ${error.message}`)
  console.error('🔧 Revisa la configuración del sistema\n')
}

// Configurar tarea programada para las 15:00 todos los días (hora española)
const task = cron.schedule('0 15 * * *', async () => {
  const now = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
  console.log(`\n🚀 [${now}] Ejecutando generación automática de efeméride histórica...`)
  
  try {
    // Generar efeméride para mañana (el día siguiente)
    const result = await generateDailyEphemeris(false) // false = mañana
    notifySuccess(result)
  } catch (error) {
    notifyError(error)
  }
}, {
  scheduled: false, // No iniciar automáticamente
  timezone: "Europe/Madrid" // Zona horaria española
})

// Función para ejecutar manualmente
async function runManualGeneration() {
  console.log('\n🧪 Ejecutando generación manual para prueba...')
  try {
    const result = await generateDailyEphemeris(true) // true = hoy
    notifySuccess(result)
  } catch (error) {
    notifyError(error)
  }
}

// Manejar argumentos de línea de comandos
if (process.argv.includes('--test')) {
  console.log('🧪 Modo de prueba activado')
  await runManualGeneration()
  process.exit(0)
} else if (process.argv.includes('--start')) {
  console.log('▶️  Iniciando scheduler automático...')
  task.start()
  console.log('✅ Scheduler iniciado. La próxima ejecución será a las 15:00 (hora española)')
  console.log('🎯 Cada día se generará una nueva efeméride histórica del K-pop')
  console.log('📚 Basada en eventos reales y verificados')
  console.log('💡 Presiona Ctrl+C para detener el scheduler')
  
  // Mantener el proceso activo
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo scheduler...')
    task.stop()
    console.log('✅ Scheduler detenido')
    process.exit(0)
  })
} else {
  console.log('\n📖 Uso del scheduler con base de datos histórica:')
  console.log('   npm run start-auto      # Iniciar scheduler automático (15:00 hora española)')
  console.log('   npm run test-auto       # Ejecutar prueba manual')
  console.log('')
  console.log('🎯 El scheduler generará automáticamente efemérides históricas reales del K-pop')
  console.log('📚 Basadas en una base de datos curada de eventos verificados')
  console.log('⏰ Todos los días a las 15:00 hora española')
}
