"use client"

import { useState } from 'react'
import { useEphemerides } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, Database } from 'lucide-react'

const testData = [
  { day: 22, month: 7, year: 2025, event: 5, display_date: '2025-07-22', historical_day: 22, historical_month: 7, historical_year: 2025 }, // Hoy - Evento especial
  { day: 13, month: 6, year: 2013, event: 1, display_date: '2013-06-13', historical_day: 13, historical_month: 6, historical_year: 2013 }, // Debut de BTS
  { day: 8, month: 8, year: 2016, event: 1, display_date: '2016-08-08', historical_day: 8, historical_month: 8, historical_year: 2016 },  // Debut de BLACKPINK
  { day: 1, month: 1, year: 2012, event: 1, display_date: '2012-01-01', historical_day: 1, historical_month: 1, historical_year: 2012 },  // Debut de EXO
  { day: 9, month: 3, year: 2016, event: 1, display_date: '2016-03-09', historical_day: 9, historical_month: 3, historical_year: 2016 }, // Debut de TWICE
  { day: 1, month: 11, year: 2020, event: 1, display_date: '2020-11-01', historical_day: 1, historical_month: 11, historical_year: 2020 },  // Debut de aespa
  { day: 15, month: 1, year: 2019, event: 2, display_date: '2019-01-15', historical_day: 15, historical_month: 1, historical_year: 2019 },  // Logro de BTS
  { day: 8, month: 4, year: 2018, event: 3, display_date: '2018-04-08', historical_day: 8, historical_month: 4, historical_year: 2018 },   // Récord de BTS
  { day: 14, month: 2, year: 2020, event: 4, display_date: '2020-02-14', historical_day: 14, historical_month: 2, historical_year: 2020 },  // Premio de TWICE
  { day: 25, month: 12, year: 2021, event: 5, display_date: '2021-12-25', historical_day: 25, historical_month: 12, historical_year: 2021 }  // Evento especial Navidad
]

export default function TestDataManager() {
  const { addEphemeris, refetch, ephemerides, loading: dataLoading } = useEphemerides()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [connectionInfo, setConnectionInfo] = useState<string[]>([])

  const checkConnection = async () => {
    setChecking(true)
    setConnectionInfo([])
    
    try {
      // Refrescar los datos desde Supabase
      await refetch()
      
      const info = [
        `🔗 Conexión a Supabase: EXITOSA`,
        `📊 Registros encontrados: ${ephemerides?.length || 0}`,
        `📅 Fecha objetivo: 22/07/2025`,
        `🎯 Registros para hoy: ${ephemerides?.filter(item => item.day === 22 && item.month === 7).length || 0}`
      ]
      
      if (ephemerides && ephemerides.length > 0) {
        info.push(`📝 Últimos eventos:`)
        ephemerides.slice(0, 3).forEach(item => {
          info.push(`   • ${item.day}/${item.month}/${item.year} - Evento ${item.event}`)
        })
      }
      
      setConnectionInfo(info)
    } catch (error) {
      setConnectionInfo([
        `❌ Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`,
        `🔧 Verifica la configuración de Supabase`
      ])
    }
    
    setChecking(false)
  }

  const addSingleRecord = async (record: any) => {
    console.log('📝 Intentando añadir registro:', record)
    try {
      const result = await addEphemeris(record)
      console.log('📊 Resultado de addEphemeris:', result)
      
      if (result.success) {
        const message = `✅ Añadido: ${record.day}/${record.month}/${record.year} - Evento ${record.event}`
        console.log(message)
        return message
      } else {
        const message = `❌ Error: ${record.day}/${record.month}/${record.year} - ${result.error}`
        console.error(message)
        return message
      }
    } catch (error) {
      console.error('💥 Error en addSingleRecord:', error)
      const message = `❌ Excepción: ${record.day}/${record.month}/${record.year} - ${error instanceof Error ? error.message : 'Error desconocido'}`
      return message
    }
  }

  const addAllTestData = async () => {
    setLoading(true)
    setResults([])
    
    const newResults = []
    for (const record of testData) {
      const result = await addSingleRecord(record)
      newResults.push(result)
      setResults([...newResults])
      // Pequeña pausa entre inserciones
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setLoading(false)
    // Refrescar los datos
    setTimeout(() => {
      refetch()
    }, 1000)
  }

  const addTodayEvent = async () => {
    const today = new Date()
    const todayRecord = {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      event: 5, // Evento especial
      display_date: today.toISOString().split('T')[0], // Formato YYYY-MM-DD
      historical_day: today.getDate(),
      historical_month: today.getMonth() + 1,
      historical_year: today.getFullYear()
    }
    
    const result = await addSingleRecord(todayRecord)
    setResults([result])
    
    // Refrescar los datos
    setTimeout(() => {
      refetch()
    }, 1000)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Gestor de Datos de Prueba
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={checkConnection} 
            disabled={checking}
            variant="secondary"
            className="w-full"
          >
            {checking ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Verificar conexión
          </Button>
          
          <Button 
            onClick={addTodayEvent} 
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir evento de hoy
          </Button>
          
          <Button 
            onClick={addAllTestData} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Añadir todos los datos
          </Button>
        </div>

        {connectionInfo.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Estado de la conexión:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {connectionInfo.map((info, index) => (
                <div key={index} className="text-sm mb-1">
                  {info}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Resultados:</h3>
              <Button onClick={clearResults} variant="ghost" size="sm">
                Limpiar
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-semibold mb-2">Datos de prueba incluidos:</p>
          <ul className="space-y-1 text-xs">
            <li>• Debuts: BTS, BLACKPINK, EXO, TWICE, aespa</li>
            <li>• Logros y récords de varios grupos</li>
            <li>• Premios y eventos especiales</li>
            <li>• Evento especial para la fecha de hoy (22/07/2025)</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
          <p><strong>Nota:</strong> También puedes añadir datos manualmente en Supabase ejecutando el archivo <code>supabase/test_data.sql</code> en el SQL Editor.</p>
        </div>
      </CardContent>
    </Card>
  )
}
