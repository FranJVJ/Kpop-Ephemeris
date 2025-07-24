"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function SupabaseDiagnostic() {
  const [results, setResults] = useState<any[]>([])
  const [running, setRunning] = useState(false)
  const [fixing, setFixing] = useState(false)

  const addResult = (test: string, success: boolean, message: string, details?: any) => {
    setResults(prev => [...prev, { test, success, message, details, timestamp: new Date() }])
  }

  const fixRLSPolicies = async () => {
    setFixing(true)
    try {
      // Intentar crear políticas públicas básicas
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE POLICY IF NOT EXISTS "public_read" ON "Kpop_Ephemerides"
          FOR SELECT USING (true);
          
          CREATE POLICY IF NOT EXISTS "public_insert" ON "Kpop_Ephemerides"
          FOR INSERT WITH CHECK (true);
        `
      })

      if (error) throw error
      
      addResult(
        'Corrección automática',
        true,
        'Políticas RLS creadas exitosamente'
      )
    } catch (err) {
      addResult(
        'Corrección automática',
        false,
        `No se pudieron crear políticas automáticamente: ${err instanceof Error ? err.message : 'Error desconocido'}`
      )
    }
    setFixing(false)
  }

  const runDiagnostic = async () => {
    setRunning(true)
    setResults([])

    // Test 1: Variables de entorno
    addResult(
      'Variables de entorno',
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      `URL: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'} | Key: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`,
      {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
      }
    )

    // Test 2: Formato de clave JWT
    const keyValid = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ')
    addResult(
      'Formato de clave JWT',
      keyValid || false,
      keyValid ? 'Clave tiene formato JWT válido' : 'Clave no tiene formato JWT válido'
    )

    // Test 3: Conexión básica a Supabase (usando nuestra tabla directamente)
    try {
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .select('count')
        .limit(1)
        .single()

      addResult(
        'Conexión a Supabase',
        !error,
        error ? `Error de conexión: ${error.message}` : 'Conexión exitosa a la base de datos',
        { data, error }
      )
    } catch (err) {
      addResult(
        'Conexión a Supabase',
        false,
        `Excepción: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        err
      )
    }

    // Test 4: Verificar acceso a la tabla directamente
    try {
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .select('id')
        .limit(1)

      addResult(
        'Acceso a tabla Kpop_Ephemerides',
        !error,
        error ? `Error: ${error.message}` : 'Tabla accesible correctamente',
        { data, error }
      )
    } catch (err) {
      addResult(
        'Acceso a tabla Kpop_Ephemerides',
        false,
        `No se pudo acceder: ${err instanceof Error ? err.message : 'Error desconocido'}`
      )
    }

    // Test 5: Contar registros existentes
    try {
      const { count, error } = await supabase
        .from('Kpop_Ephemerides')
        .select('*', { count: 'exact', head: true })

      addResult(
        'Conteo de registros',
        !error,
        error ? `Error: ${error.message}` : `Total de registros: ${count || 0}`,
        { count, error }
      )
    } catch (err) {
      addResult(
        'Conteo de registros',
        false,
        `Excepción: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        err
      )
    }

    // Test 6: Intentar leer algunos datos
    try {
      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .select('*')
        .limit(3)

      addResult(
        'Lectura de datos',
        !error,
        error ? `Error: ${error.message}` : `Éxito: ${data?.length || 0} registros leídos`,
        { data, error }
      )
    } catch (err) {
      addResult(
        'Lectura de datos',
        false,
        `Excepción: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        err
      )
    }

    // Test 7: Intentar insertar un registro de prueba único
    try {
      // Usar timestamp para hacer el registro único
      const timestamp = Date.now()
      const testRecord = {
        day: 23,
        month: 7,
        year: 2025,
        event: 5,
        display_date: '2025-07-23',
        historical_day: 23,
        historical_month: 7,
        historical_year: 2025
      }

      const { data, error } = await supabase
        .from('Kpop_Ephemerides')
        .insert([testRecord])
        .select()

      addResult(
        'Inserción de datos',
        !error,
        error ? `Error: ${error.message}` : 'Inserción exitosa - Registro de prueba creado',
        { data, error, testRecord }
      )
    } catch (err) {
      addResult(
        'Inserción de datos',
        false,
        `Excepción: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        err
      )
    }

    setRunning(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Diagnóstico de Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={runDiagnostic} disabled={running}>
            {running ? 'Ejecutando diagnóstico...' : 'Ejecutar diagnóstico completo'}
          </Button>
          
          <Button 
            onClick={fixRLSPolicies} 
            disabled={fixing}
            variant="secondary"
          >
            {fixing ? 'Corrigiendo...' : 'Intentar corrección automática'}
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">� Solución Segura Recomendada</h4>
          <p className="text-sm text-blue-700 mb-2">
            Para mantener la seguridad, ejecuta estas políticas RLS en Supabase SQL Editor:
          </p>
          <div className="bg-blue-100 p-3 rounded text-xs font-mono space-y-1">
            <div>ALTER TABLE "Kpop_Ephemerides" ENABLE ROW LEVEL SECURITY;</div>
            <div>CREATE POLICY "enable_read_access_for_all_users" ON "Kpop_Ephemerides"</div>
            <div>&nbsp;&nbsp;FOR SELECT TO public USING (true);</div>
            <div>CREATE POLICY "enable_insert_access_for_all_users" ON "Kpop_Ephemerides"</div>
            <div>&nbsp;&nbsp;FOR INSERT TO public WITH CHECK (true);</div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            📁 Script completo disponible en: <code>supabase/quick_fix.sql</code>
          </p>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Resultados del diagnóstico:</h3>
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <h4 className="font-medium">{result.test}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600">Ver detalles</summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
