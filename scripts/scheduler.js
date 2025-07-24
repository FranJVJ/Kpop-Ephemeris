/**
 * Planificador automático para la generación diaria de efemérides
 * Ejecuta el generador todos los días a las 15:00 hora española (Madrid)
 * ACTUALIZADO: Ahora con traducciones automáticas y inserción mejorada
 */

import cron from 'node-cron'
import { generateDailyEphemeris } from './daily-ephemeris-generator.js'

console.log('🕰️  Iniciando planificador de efemérides diarias...')
console.log('✨ Versión actualizada con traducciones automáticas')

// Programar ejecución diaria a las 15:00 hora española (Madrid)
const task = cron.schedule('0 15 * * *', async () => {
  console.log('\n⏰ Ejecutando generación diaria de efeméride...')
  console.log('📅 Fecha/Hora España:', new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }))
  
  try {
    // Generar efeméride para el día siguiente con IA y traducciones
    const result = await generateDailyEphemeris(false) // false = día siguiente
    
    if (result.success) {
      console.log('✅ Generación exitosa:', result.message)
      console.log('📄 Datos insertados:', {
        title: result.data.title,
        category: result.data.category,
        group: result.data.group_name,
        ai_generated: result.data.ai_generated
      })
      
      // Opcional: enviar notificación de éxito
      await sendSuccessNotification(result.data)
    } else {
      console.error('❌ Generación fallida:', result.message)
      
      // Opcional: enviar notificación de error
      await sendErrorNotification(result.error)
    }
    
  } catch (error) {
    console.error('💥 Error crítico en el planificador:', error)
    await sendErrorNotification(error)
  }
}, {
  scheduled: true,
  timezone: "Europe/Madrid" // Zona horaria española
})

/**
 * Enviar notificación de éxito
 */
async function sendSuccessNotification(ephemerisData) {
  console.log('📧 Nueva efeméride generada:')
  console.log(`   📅 Fecha: ${ephemerisData.day}/${ephemerisData.month}`)
  console.log(`   🎵 Título: ${ephemerisData.title}`)
  console.log(`   🏷️  Categoría: ${ephemerisData.category}`)
  console.log(`   👥 Grupo: ${ephemerisData.group_name}`)
  console.log(`   🤖 IA: ${ephemerisData.ai_generated ? 'Sí' : 'No'}`)
  
  // Aquí puedes agregar integraciones como:
  // - Webhook a Discord/Slack
  // - Email notification
  // - Push notification
  // - etc.
}

/**
 * Enviar notificación de error
 */
async function sendErrorNotification(error) {
  console.log('🚨 Error en generación automática:')
  console.log(`   ❌ Error: ${error?.message || error}`)
  
  // Aquí puedes agregar alertas como:
  // - Email de alerta
  // - Webhook de error
  // - Log en servicio de monitoreo
  // - etc.
}

// Función para probar el generador inmediatamente
async function testGenerator() {
  console.log('🧪 Ejecutando prueba del generador...')
  
  try {
    const result = await generateDailyEphemeris()
    console.log('📋 Resultado de prueba:', result)
  } catch (error) {
    console.error('❌ Error en prueba:', error)
  }
}

// Información del planificador
console.log('📅 Efeméride programada para ejecutarse diariamente a las 15:00 hora española')
console.log('🌍 Zona horaria:', task.options.timezone)
console.log('⚡ Estado del planificador:', task.getStatus())

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo planificador...')
  task.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando planificador...')
  task.stop()
  process.exit(0)
})

// Si se ejecuta con argumento 'test', ejecutar inmediatamente
if (process.argv.includes('--test')) {
  testGenerator()
}

console.log('✅ Planificador iniciado correctamente. Presiona Ctrl+C para detener.')
