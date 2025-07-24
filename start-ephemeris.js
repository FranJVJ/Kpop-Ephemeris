#!/usr/bin/env node

/**
 * Script de inicio para el sistema automático de efemérides
 * Versión simplificada que evita problemas de módulos
 */

console.log('🚀 Iniciando sistema automático de efemérides del K-pop...')
console.log('📅 Horario: Todos los días a las 15:00 (hora española)')
console.log('💾 Base de datos: Histórica con 50+ eventos verificados')
console.log('')

// Importar y ejecutar
import('./scripts/scheduler-simple.js')
  .then(() => {
    console.log('✅ Sistema iniciado correctamente')
    console.log('🔄 El scheduler se ejecutará automáticamente a las 15:00')
    console.log('📊 Consulta los logs para ver las efemérides generadas')
    console.log('')
    console.log('ℹ️  Para detener el sistema, presiona Ctrl+C')
  })
  .catch((error) => {
    console.error('❌ Error iniciando el sistema:', error.message)
    console.log('')
    console.log('🔧 Soluciones posibles:')
    console.log('   1. Verificar que las variables de entorno estén configuradas')
    console.log('   2. Comprobar la conexión a internet')
    console.log('   3. Validar que Supabase esté accesible')
    console.log('')
    console.log('📝 Para más ayuda, consulta el README.md')
  })
