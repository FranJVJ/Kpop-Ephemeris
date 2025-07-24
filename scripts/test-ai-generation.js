/**
 * Script simple para probar la generación de efemérides con IA
 * Uso: node scripts/test-ai-generation.js [--today]
 */

import { generateDailyEphemeris } from './daily-ephemeris-generator.js'

console.log('🧪 Probando generación de efemérides con IA...')
console.log('📅 Fecha:', new Date().toLocaleString('es-ES'))

// Verificar argumentos
const args = process.argv.slice(2)
const forToday = args.includes('--today')
const dateLabel = forToday ? 'hoy' : 'mañana'

console.log(`🎯 Generando efeméride para ${dateLabel}`)

try {
  const result = await generateDailyEphemeris(forToday)
  
  if (result.success) {
    console.log('\n✅ ¡Efeméride generada exitosamente!')
    console.log('📄 Detalles:')
    console.log(`   📅 Fecha: ${result.data.day}/${result.data.month}`)
    console.log(`   🎵 Título: ${result.data.title}`)
    console.log(`   📝 Descripción: ${result.data.description?.substring(0, 100)}...`)
    console.log(`   🏷️  Categoría: ${result.data.category}`)
    console.log(`   👥 Grupo: ${result.data.group_name}`)
    console.log(`   📅 Año histórico: ${result.data.historical_year}`)
    console.log(`   🤖 Generado por IA: ${result.data.ai_generated ? 'Sí' : 'No'}`)
    console.log(`   🎯 Confianza: ${result.data.confidence_level}`)
    
    if (result.data.translations) {
      console.log('   🌐 Traducciones disponibles: Sí')
    }
    
    console.log('\n🚀 La efeméride ya está disponible en la aplicación')
    console.log('💡 Cambia el idioma en la app para ver las traducciones automáticas')
    
  } else {
    console.log('\n❌ Error generando efeméride:')
    console.log(`   Error: ${result.message}`)
    if (result.error) {
      console.log(`   Detalles: ${result.error.message}`)
    }
  }
  
} catch (error) {
  console.error('\n💥 Error crítico:', error)
  process.exit(1)
}
