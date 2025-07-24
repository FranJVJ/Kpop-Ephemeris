import { useState } from 'react'
import { useEphemerides } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const EphemerisAdmin = () => {
  const { addEphemeris, ephemerides } = useEphemerides()
  const [isInserting, setIsInserting] = useState(false)

  // Función para insertar Girls' Generation con la nueva estructura
  const insertGirlsGeneration = async () => {
    setIsInserting(true)
    try {
      const girlsGenerationData = {
        day: 23,
        month: 7,
        year: 2025,
        historical_year: 2007,
        event: 1, // Mantener por compatibilidad
        title: "Aniversario del debut de Girls' Generation",
        description: "En 2007, Girls' Generation (SNSD) debutó con 'Into the New World', marcando el inicio de una era dorada del K-pop femenino.",
        category: "Debut",
        group_name: "Girls' Generation (SNSD)",
        artist: "Girls' Generation",
        ai_generated: false, // Datos manuales verificados
        confidence_level: "alta",
        sources: "SM Entertainment, Wikipedia, Soompi"
      }

      const result = await addEphemeris(girlsGenerationData)
      if (result.success) {
        alert('✅ Girls\' Generation insertado correctamente')
      } else {
        alert('❌ Error: ' + result.error)
      }
    } catch (error) {
      alert('❌ Error: ' + error)
    } finally {
      setIsInserting(false)
    }
  }

  // Función para mostrar ejemplo de estructura para IA
  const showAIExample = () => {
    const example = {
      day: 24,
      month: 7,
      year: 2025,
      historical_year: 2016, // Año del evento histórico
      event: 2, // Tipo de evento (Logro)
      title: "Título generado por IA",
      description: "Descripción detallada generada por IA sobre el evento histórico del Kpop.",
      category: "Logro", // Debut, Logro, Récord, Premio, Especial
      group_name: "Nombre del Grupo",
      artist: "Nombre del Artista",
      ai_generated: true,
      confidence_level: "alta", // alta, media, baja
      sources: "Fuentes utilizadas por la IA"
    }

    console.log('Ejemplo de estructura para IA:', JSON.stringify(example, null, 2))
    alert('Revisa la consola para ver el ejemplo de estructura para IA')
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>🔧 Administración de Efemérides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            onClick={insertGirlsGeneration}
            disabled={isInserting}
            variant="outline"
          >
            {isInserting ? 'Insertando...' : '✨ Insertar Girls\' Generation'}
          </Button>
          
          <Button 
            onClick={showAIExample}
            variant="secondary"
          >
            📖 Ver estructura para IA
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Total de efemérides:</strong> {ephemerides.length}</p>
          <p><strong>Nota:</strong> Los nuevos datos de IA deben incluir title, description, category y group_name.</p>
        </div>
      </CardContent>
    </Card>
  )
}
