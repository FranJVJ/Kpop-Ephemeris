"use client"

import { useEphemerides } from '@/hooks/useSupabase'
import { transformSupabaseData } from '@/lib/ephemerisUtils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

export default function SupabaseEphemerides() {
  const { ephemerides, loading, error, refetch } = useEphemerides()

  // Log para debugging
  console.log('🎬 SupabaseEphemerides - Estado actual:', { 
    ephemerides: ephemerides?.length, 
    loading, 
    error,
    datos: ephemerides
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Cargando efemérides desde Supabase...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  // Transformar los datos de Supabase al formato esperado
  const transformedData = ephemerides.map(transformSupabaseData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Efemérides desde Supabase ({transformedData.length})
        </h2>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {transformedData.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No hay efemérides para este día
              </h3>
              <p className="text-gray-600 mb-4">
                No encontramos eventos del Kpop registrados para hoy.
              </p>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-700">
                  🎵 ¡Pero cada día es especial en el mundo del Kpop! Vuelve mañana para descubrir nuevos eventos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transformedData.map((ephemeris) => (
            <Card key={ephemeris.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ephemeris.category === 'Debut' ? 'bg-green-100 text-green-800' :
                    ephemeris.category === 'Logro' ? 'bg-blue-100 text-blue-800' :
                    ephemeris.category === 'Récord' ? 'bg-purple-100 text-purple-800' :
                    ephemeris.category === 'Premio' ? 'bg-yellow-100 text-yellow-800' :
                    ephemeris.category === 'Especial' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ephemeris.category}
                  </span>
                  <span className="text-sm text-gray-500">{ephemeris.year}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {ephemeris.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {ephemeris.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-purple-600">
                    {ephemeris.group_name}
                  </span>
                  <span className="text-gray-500">
                    {ephemeris.date_display}
                  </span>
                </div>

                {/* Mostrar datos originales para depuración */}
                <details className="mt-4">
                  <summary className="text-xs text-gray-400 cursor-pointer">
                    Ver datos originales
                  </summary>
                  <pre className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded overflow-auto">
                    {JSON.stringify(ephemeris.raw_data, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
