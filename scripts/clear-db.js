/**
 * Script temporal para limpiar la base de datos completamente
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pqxyokyidfpgtdqpfsoe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeHlva3lpZGZwZ3RkcXBmc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzkxNjIsImV4cCI6MjA0OTk1NTE2Mn0.f6jOcO-a0LnMD2Pf49AvwAWUJQn6w4Nz7DhCIFGrDHE'
)

async function clearDatabase() {
  try {
    console.log('🗑️  Limpiando base de datos...')
    
    // Primero verificar qué hay
    const { data: existing, error: fetchError } = await supabase
      .from('Kpop_Ephemerides')
      .select('id, day, month, year, event')
      .order('id')
    
    if (fetchError) {
      console.error('❌ Error obteniendo datos:', fetchError)
      return
    }
    
    console.log(`📊 Efemérides encontradas: ${existing?.length || 0}`)
    
    if (existing && existing.length > 0) {
      existing.forEach(item => {
        console.log(`  - ID ${item.id}: ${item.day}/${item.month}/${item.year} - ${item.event}`)
      })
      
      // Eliminar todas
      const { error: deleteError } = await supabase
        .from('Kpop_Ephemerides')
        .delete()
        .in('id', existing.map(item => item.id))
      
      if (deleteError) {
        console.error('❌ Error eliminando:', deleteError)
        return
      }
      
      console.log(`✅ ¡Eliminadas ${existing.length} efemérides exitosamente!`)
    } else {
      console.log('✅ La base de datos ya está limpia')
    }
    
    console.log('🎯 Base de datos lista para el sistema automático')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

clearDatabase()
