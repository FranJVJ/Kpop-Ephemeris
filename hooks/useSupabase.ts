import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Hook para manejar datos de efemérides desde Supabase
export const useEphemerides = () => {
  const [ephemerides, setEphemerides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEphemerides = async () => {
    try {
      setLoading(true)
      console.log('🔍 Intentando conectar a Supabase...')
      console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔑 Anon Key presente:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      console.log('🔑 Anon Key (primeros 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
      
      // Verificar que el cliente de Supabase esté inicializado
      console.log('🏗️ Cliente Supabase:', !!supabase)
      
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .select('*')
        .order('month, day', { ascending: true })

      console.log('📊 Respuesta completa de Supabase:')
      console.log('   - Data:', data)
      console.log('   - Error:', error)
      console.log('   - Error stringified:', JSON.stringify(error, null, 2))
      
      if (error) {
        console.error('❌ Error detallado de Supabase:')
        console.error('   - Message:', error.message)
        console.error('   - Code:', error.code)
        console.error('   - Details:', error.details)
        console.error('   - Hint:', error.hint)
        throw error
      }
      
      console.log('✅ Datos obtenidos exitosamente:', data?.length || 0, 'registros')
      setEphemerides(data || [])
      setError(null)
    } catch (err) {
      console.error('💥 Error completo:', err)
      console.error('💥 Error type:', typeof err)
      console.error('💥 Error constructor:', err?.constructor?.name)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('📝 Mensaje de error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addEphemeris = async (ephemeris: any) => {
    try {
      console.log('📝 Insertando nuevo registro:', ephemeris)
      
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .insert([ephemeris])
        .select()

      console.log('📊 Respuesta de inserción:', { data, error })

      if (error) {
        console.error('❌ Error de inserción:', error)
        throw error
      }
      
      console.log('✅ Registro insertado exitosamente:', data)
      setEphemerides(prev => [...prev, ...(data || [])])
      return { success: true, data }
    } catch (err) {
      console.error('💥 Error completo en addEphemeris:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('📝 Mensaje de error:', errorMessage)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const updateEphemeris = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setEphemerides(prev => 
        prev.map(item => item.id === parseInt(id) ? { ...item, ...updates } : item)
      )
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const deleteEphemeris = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Kpop_Ephemerides')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEphemerides(prev => prev.filter(item => item.id !== parseInt(id)))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchEphemerides()
  }, [])

  return {
    ephemerides,
    loading,
    error,
    addEphemeris,
    updateEphemeris,
    deleteEphemeris,
    refetch: fetchEphemerides
  }
}

// Hook para autenticación
export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}
