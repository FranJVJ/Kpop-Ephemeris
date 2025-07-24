/**
 * Script para eliminar TODAS las efemérides de la base de datos
 * ¡CUIDADO! Este script elimina TODOS los registros
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqxyokyidfpgtdqpfsoe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeHlva3lpZGZwZ3RkcXBmc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzkxNjIsImV4cCI6MjA0OTk1NTE2Mn0.f6jOcO-a0LnMD2Pf49AvwAWUJQn6w4Nz7DhCIFGrDHE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteAllEphemeris() {
  try {
    console.log('🗑️  Eliminando TODAS las efemérides de la base de datos...')
    
    // Primero contar cuántos hay
    const { count } = await supabase
      .from('Kpop_Ephemerides')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Se encontraron ${count} efemérides en total`)
    
    if (count === 0) {
      console.log('✅ No hay efemérides para eliminar')
      return
    }
    
    // Eliminar todas
    const { error } = await supabase
      .from('Kpop_Ephemerides')
      .delete()
      .neq('id', 0) // Elimina todos los registros (condición que siempre es verdadera)
    
    if (error) {
      console.error('❌ Error eliminando efemérides:', error)
      return
    }
    
    console.log(`✅ ¡Se eliminaron TODAS las ${count} efemérides exitosamente!`)
    console.log('🎯 Base de datos limpia y lista para el sistema automático')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar
deleteAllEphemeris()
