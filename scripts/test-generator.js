/**
 * Script de prueba para el generador de efemérides
 * Permite probar el sistema sin insertar datos reales
 */

import { generateDailyEphemeris } from './daily-ephemeris-generator.js'

async function runTests() {
  console.log('🧪 Iniciando pruebas del generador de efemérides...\n')

  // Prueba 1: Verificar conexión a Supabase
  console.log('📡 Prueba 1: Conexión a Supabase')
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase.from('ephemerides').select('count(*)').limit(1)
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
    } else {
      console.log('✅ Conexión a Supabase exitosa')
    }
  } catch (error) {
    console.log('❌ Error de configuración:', error.message)
  }

  // Prueba 2: Verificar API de OpenAI
  console.log('\n🤖 Prueba 2: Conexión a OpenAI')
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  OPENAI_API_KEY no configurada')
    } else {
      console.log('✅ API Key de OpenAI encontrada')
    }
  } catch (error) {
    console.log('❌ Error con OpenAI:', error.message)
  }

  // Prueba 3: Generar efeméride de prueba
  console.log('\n📝 Prueba 3: Generación de efeméride')
  try {
    const result = await generateDailyEphemeris()
    
    if (result.success) {
      console.log('✅ Generación exitosa')
      console.log('📋 Datos generados:', {
        title: result.data?.title || 'N/A',
        description: result.data?.description?.substring(0, 50) + '...' || 'N/A',
        category: result.data?.event || 'N/A'
      })
    } else {
      console.log('❌ Generación fallida:', result.message)
    }
  } catch (error) {
    console.log('❌ Error en generación:', error.message)
  }

  console.log('\n🏁 Pruebas completadas')
}

// Función para limpiar datos de prueba
async function cleanTestData() {
  console.log('🧹 Limpiando datos de prueba...')
  
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Eliminar registros generados por IA del día actual
    const today = new Date()
    const { data, error } = await supabase
      .from('ephemerides')
      .delete()
      .eq('day', today.getDate())
      .eq('month', today.getMonth() + 1)
      .eq('ai_generated', true)

    if (error) {
      console.log('❌ Error limpiando:', error.message)
    } else {
      console.log('✅ Datos de prueba eliminados')
    }
  } catch (error) {
    console.log('❌ Error en limpieza:', error.message)
  }
}

// Ejecutar según argumentos
const args = process.argv.slice(2)

if (args.includes('--clean')) {
  cleanTestData()
} else {
  runTests()
}
