import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Logs de configuración
console.log('🔧 Configurando Supabase Client:')
console.log('   - URL configurada:', !!supabaseUrl)
console.log('   - Key configurada:', !!supabaseAnonKey)
console.log('   - URL value:', supabaseUrl)
console.log('   - Key preview:', supabaseAnonKey?.substring(0, 20) + '...')

// Validar formato de la clave
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('❌ CLAVE ANÓNIMA INVÁLIDA: No tiene formato JWT')
  console.error('   - Actual:', supabaseAnonKey)
  console.error('   - Esperado: Debe empezar con "eyJ"')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Cliente Supabase creado exitosamente')
