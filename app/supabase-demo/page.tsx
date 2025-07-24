"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Music, Star, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEphemerides } from "@/hooks/useSupabase"
import SupabaseEphemerides from "@/components/SupabaseEphemerides"
import TestDataManager from "@/components/TestDataManager"
import SupabaseDiagnostic from "@/components/SupabaseDiagnostic"

// Datos locales como fallback
const localEphemerides = {
  "01-01": {
    date: "1 de Enero",
    year: "2012",
    title: "Debut de EXO",
    description: "SM Entertainment presenta oficialmente a EXO, uno de los grupos más influyentes del Kpop.",
    category: "Debut",
    group: "EXO",
  },
  // ... más datos locales
}

export default function IntegratedPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [useSupabase, setUseSupabase] = useState(false)
  const { ephemerides: supabaseData, loading, error } = useEphemerides()

  const formatDateKey = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${month}-${day}`
  }

  const getCurrentEphemeris = () => {
    const dateKey = formatDateKey(currentDate)
    
    if (useSupabase && supabaseData.length > 0) {
      // Buscar por mes y día en los datos de Supabase
      const currentMonth = currentDate.getMonth() + 1
      const currentDay = currentDate.getDate()
      
      const found = supabaseData.find(item => 
        item.month === currentMonth && item.day === currentDay
      )
      
      if (found) {
        // Transformar los datos de Supabase al formato esperado
        const eventInfo = {
          1: { category: 'Debut', title: 'Debut de grupo', description: 'Un nuevo grupo debuta en la industria del Kpop' },
          2: { category: 'Logro', title: 'Logro importante', description: 'Un hito significativo en la historia del Kpop' },
          3: { category: 'Récord', title: 'Récord establecido', description: 'Un nuevo récord fue establecido' },
          4: { category: 'Premio', title: 'Premio ganado', description: 'Un premio importante fue otorgado' },
          5: { category: 'Especial', title: 'Evento especial', description: 'Un evento especial en la historia del Kpop' }
        }[Number(found.event) as 1 | 2 | 3 | 4 | 5] || { 
          category: 'Especial', 
          title: 'Evento del Kpop', 
          description: 'Un evento importante en la historia del Kpop' 
        }
        
        return {
          date: currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
          year: found.year?.toString() || found.historical_year?.toString() || '????',
          title: eventInfo.title,
          description: eventInfo.description,
          category: eventInfo.category,
          group: 'K-Pop',
          supabase_data: found // Datos originales para depuración
        }
      }
      
      return {
        date: currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
        year: "????",
        title: "No hay efemérides para este día",
        description: "Aún no tenemos información para esta fecha en Supabase. ¡Ayúdanos a completar la historia del Kpop!",
        category: "Especial",
        group: "Kpop Daily",
      }
    }
    
    return localEphemerides[dateKey as keyof typeof localEphemerides] || {
      date: currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
      year: "????",
      title: "No hay efemérides para este día",
      description: "Aún no tenemos información para esta fecha. ¡Ayúdanos a completar la historia del Kpop!",
      category: "Especial",
      group: "Kpop Daily",
    }
  }

  const ephemeris = getCurrentEphemeris()

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Debut": "from-green-500 to-emerald-600",
      "Logro": "from-blue-500 to-cyan-600", 
      "Récord": "from-purple-500 to-violet-600",
      "Premio": "from-yellow-500 to-orange-600",
      "Especial": "from-red-500 to-pink-600"
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Kpop Daily</h1>
                <p className="text-sm text-gray-600">Efemérides del Kpop</p>
              </div>
            </div>
            
            {/* Toggle para fuente de datos */}
            <div className="flex items-center gap-2">
              <Button
                variant={!useSupabase ? "default" : "outline"}
                size="sm"
                onClick={() => setUseSupabase(false)}
              >
                Local
              </Button>
              <Button
                variant={useSupabase ? "default" : "outline"}
                size="sm"
                onClick={() => setUseSupabase(true)}
                disabled={loading}
              >
                <Database className="w-4 h-4 mr-1" />
                Supabase
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Navegación de fecha */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateDate('prev')}
            className="hover:bg-purple-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">
              {currentDate.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateDate('next')}
            className="hover:bg-purple-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Estado de carga para Supabase */}
        {useSupabase && loading && (
          <div className="text-center py-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <Database className="w-4 h-4 animate-pulse" />
              Cargando desde Supabase...
            </div>
          </div>
        )}

        {/* Error de Supabase */}
        {useSupabase && error && (
          <div className="text-center py-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
              <Database className="w-4 h-4" />
              Error: {error}
            </div>
          </div>
        )}

        {/* Efeméride principal */}
        <Card className="mb-8 overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className={`h-2 bg-gradient-to-r ${getCategoryColor(ephemeris.category)} animate-gradient-x`} />
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(ephemeris.category)} text-white text-sm font-semibold mb-4 animate-pulse-soft hover:scale-105 transition-transform cursor-pointer`}
              >
                <Star className="w-4 h-4" />
                {ephemeris.category}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
                {ephemeris.title}
              </h2>
              
              <div className="flex items-center gap-4 mb-6 text-gray-600">
                <span className="text-lg font-semibold">{ephemeris.year}</span>
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-lg">{ephemeris.group}</span>
              </div>
              
              <div className="max-w-3xl">
                <p className="text-gray-700 leading-relaxed text-lg">{ephemeris.description}</p>
              </div>
              
              <div className="mt-8 flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>Efeméride del {ephemeris.date}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestor de datos de prueba */}
        {useSupabase && (
          <div className="mb-8">
            <SupabaseDiagnostic />
          </div>
        )}

        {/* Gestor de datos de prueba */}
        {useSupabase && (
          <div className="mb-8">
            <TestDataManager />
          </div>
        )}

        {/* Lista completa de efemérides de Supabase */}
        {useSupabase && (
          <SupabaseEphemerides />
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-1000">
            <div className="text-3xl font-bold mb-2 animate-count-up">365</div>
            <div className="text-pink-100">Días de historia</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-1500">
            <div className="text-3xl font-bold mb-2 animate-pulse">
              {useSupabase ? supabaseData.length : '∞'}
            </div>
            <div className="text-purple-100">
              {useSupabase ? 'Efemérides en DB' : 'Momentos épicos'}
            </div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-2000">
            <div className="text-3xl font-bold mb-2 animate-bounce-soft">♪</div>
            <div className="text-blue-100">Ritmo diario</div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
            <Music className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="font-semibold text-gray-800">Kpop Daily</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">Celebrando la historia y cultura del Kpop, un día a la vez</p>
          <p className="text-gray-500 text-xs">
            Realizado por{" "}
            <a 
              href="https://x.com/franjvj48" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Fran (@franjvj48)
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
