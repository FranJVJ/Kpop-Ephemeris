"use client"

import { useState, useEffect } from "react"
import { Calendar, Music, Star, Share2, Twitter, Instagram, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEphemerides } from "@/hooks/useSupabase"
import { useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/LanguageSelector"

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
  "06-13": {
    date: "13 de Junio",
    year: "2013",
    title: "Debut de BTS", 
    description: "Bangtan Sonyeondan debuta oficialmente bajo Big Hit Entertainment.",
    category: "Debut",
    group: "BTS",
  },
  "08-08": {
    date: "8 de Agosto",
    year: "2016",
    title: "Debut de BLACKPINK",
    description: "YG Entertainment presenta a BLACKPINK con 'Square One'.",
    category: "Debut", 
    group: "BLACKPINK",
  },
  "07-22": {
    date: "22 de Julio",
    year: "2025",
    title: "Evento especial del Kpop",
    description: "Un día especial en la historia del Kpop que merece ser recordado.",
    category: "Especial",
    group: "Kpop Daily",
  },
  "07-23": {
    date: "23 de Julio",
    year: "2025",
    title: "Día presente del Kpop",
    description: "Hoy es un día especial para celebrar la música del Kpop.",
    category: "Especial",
    group: "Kpop Daily",
  }
}

export default function KpopEphemerisPage() {
  const [currentDate] = useState(new Date()) // Solo día actual, sin setCurrentDate
  const [timeUntilNext, setTimeUntilNext] = useState<string>('')
  const [forceRender, setForceRender] = useState(0) // Para forzar re-render
  const { ephemerides: supabaseData, loading, error } = useEphemerides()
  const { language, t, formatDate, formatDateShort } = useLanguage()

  // Forzar re-render cuando cambie el idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed, forcing re-render')
      setForceRender(prev => prev + 1)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange)
    return () => window.removeEventListener('languageChanged', handleLanguageChange)
  }, [])

  // También forzar re-render cuando cambie el language directamente
  useEffect(() => {
    console.log('Language effect triggered:', language)
    setForceRender(prev => prev + 1)
  }, [language])

  // Función para obtener el tiempo hasta la próxima efeméride (15:00)
  const getNextEphemerisTime = () => {
    const now = new Date();
    const today15 = new Date();
    today15.setHours(15, 0, 0, 0);
    
    let targetTime: Date;
    if (now < today15) {
      targetTime = today15;
    } else {
      targetTime = new Date(today15);
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const timeDiff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Si llegamos a 0, forzar actualización
    if (timeDiff <= 0) {
      setForceRender(prev => prev + 1)
      return "0m";
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Efecto para actualizar el contador cada minuto
  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilNext(getNextEphemerisTime());
    };
    
    updateTimer(); // Actualizar inmediatamente
    const interval = setInterval(updateTimer, 60000); // Actualizar cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const formatDateKey = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${month}-${day}`
  }

  const getCurrentEphemeris = () => {
    const dateKey = formatDateKey(currentDate)
    const now = new Date()
    const today15 = new Date()
    today15.setHours(15, 0, 0, 0)
    
    // Determinar qué fecha buscar basándose en la hora actual
    let targetDate = new Date(currentDate)
    if (now < today15) {
      // Antes de las 15:00, mostrar efeméride del día anterior
      targetDate.setDate(targetDate.getDate() - 1)
    }
    // Después de las 15:00, mostrar efeméride del día actual
    
    // Buscar datos en Supabase para la fecha objetivo
    if (supabaseData && supabaseData.length > 0) {
      const found = supabaseData.find(item => 
        item.day === targetDate.getDate() && 
        item.month === (targetDate.getMonth() + 1)
      )
      
      if (found) {
        // Si tiene campos title/description directos (nuevos datos de IA), usarlos
        if (found.title && found.description) {
          // Intentar usar traducciones si están disponibles
          let title = found.title
          let description = found.description
          
          if (found.translations) {
            try {
              const translations = JSON.parse(found.translations)
              title = translations.title?.[language] || found.title
              description = translations.description?.[language] || found.description
            } catch (e) {
              console.warn('Error parsing translations:', e)
            }
          }
          
          return {
            date: formatDateShort(targetDate),
            year: found.historical_year?.toString() || found.year?.toString() || '????',
            title: title,
            description: description,
            category: found.category || "Especial",
            group: found.group_name || found.artist || found.group || "Kpop"
          }
        }
        
        // Si no, usar getEventInfo para datos legados
        const eventInfo = getEventInfo(found.event, targetDate, found.historical_year || found.year)
        
        return {
          date: formatDateShort(targetDate),
          year: found.historical_year?.toString() || found.year?.toString() || '????',
          title: eventInfo.title,
          description: eventInfo.description,
          category: eventInfo.category,
          group: eventInfo.group
        }
      }
    }

    // Si no hay datos para la fecha objetivo, buscar el más reciente disponible
    if (supabaseData && supabaseData.length > 0) {
      console.log('No ephemeris for target date, looking for most recent...')
      
      const sortedData = [...supabaseData].sort((a, b) => {
        const dateA = new Date(2024, a.month - 1, a.day)
        const dateB = new Date(2024, b.month - 1, b.day)
        return dateB.getTime() - dateA.getTime()
      })
      
      const mostRecent = sortedData[0]
      const recentDate = new Date(2024, mostRecent.month - 1, mostRecent.day)
      
      // Si tiene campos directos, usarlos con traducciones
      if (mostRecent.title && mostRecent.description) {
        let title = mostRecent.title
        let description = mostRecent.description
        
        if (mostRecent.translations) {
          try {
            const translations = JSON.parse(mostRecent.translations)
            title = translations.title?.[language] || mostRecent.title
            description = translations.description?.[language] || mostRecent.description
          } catch (e) {
            console.warn('Error parsing translations:', e)
          }
        }
        
        return {
          date: formatDateShort(recentDate),
          year: mostRecent.historical_year?.toString() || mostRecent.year?.toString() || '????',
          title: title + ` (${t('lastAvailable')})`,
          description: description,
          category: mostRecent.category || "Especial",
          group: mostRecent.group_name || mostRecent.artist || mostRecent.group || "Kpop"
        }
      }
      
      // Si no, usar getEventInfo
      const eventInfo = getEventInfo(mostRecent.event, recentDate, mostRecent.historical_year || mostRecent.year)
      
      return {
        date: formatDateShort(recentDate),
        year: mostRecent.historical_year?.toString() || mostRecent.year?.toString() || '????',
        title: eventInfo.title + ` (${t('lastAvailable')})`,
        description: eventInfo.description,
        category: eventInfo.category,
        group: eventInfo.group
      }
    }
    
    // Fallback a datos locales solo si no hay datos de Supabase
    return localEphemerides[dateKey as keyof typeof localEphemerides] || {
      date: formatDateShort(currentDate),
      year: "????",
      title: t('noEphemeris'),
      description: t('noEphemerisDescription'),
      category: "Especial",
      group: "Kpop Daily",
    }
  }

  // Función para obtener información detallada del evento
  const getEventInfo = (eventType: number, date: Date, year: number) => {

    // Información genérica basada en el tipo de evento
    const eventTypes: Record<number, any> = {
      1: { 
        category: 'Debut', 
        title: {
          es: 'Debut importante',
          en: 'Important debut',
          ko: '중요한 데뷔'
        },
        description: {
          es: 'Un nuevo grupo debuta en la industria del Kpop',
          en: 'A new group debuts in the Kpop industry',
          ko: '케이팝 업계에 새로운 그룹이 데뷔했습니다'
        },
        group: 'Kpop'
      },
      2: { 
        category: 'Logro', 
        title: {
          es: 'Logro histórico',
          en: 'Historic achievement',
          ko: '역사적 성취'
        },
        description: {
          es: 'Un hito significativo en la historia del Kpop',
          en: 'A significant milestone in Kpop history',
          ko: '케이팝 역사상 중요한 이정표'
        },
        group: 'Kpop'
      },
      3: { 
        category: 'Récord', 
        title: {
          es: 'Récord establecido',
          en: 'Record established',
          ko: '기록 수립'
        },
        description: {
          es: 'Un nuevo récord fue establecido en el Kpop',
          en: 'A new record was established in Kpop',
          ko: '케이팝에서 새로운 기록이 세워졌습니다'
        },
        group: 'Kpop'
      },
      4: { 
        category: 'Premio', 
        title: {
          es: 'Premio importante',
          en: 'Important award',
          ko: '중요한 상'
        },
        description: {
          es: 'Un premio significativo fue otorgado',
          en: 'A significant award was given',
          ko: '중요한 상이 수여되었습니다'
        },
        group: 'Kpop'
      },
      5: { 
        category: 'Especial', 
        title: {
          es: 'Evento especial',
          en: 'Special event',
          ko: '특별한 이벤트'
        },
        description: {
          es: 'Un evento importante en la historia del Kpop',
          en: 'An important event in Kpop history',
          ko: '케이팝 역사상 중요한 사건'
        },
        group: 'Kpop'
      }
    }
    
    const eventType_ = eventTypes[eventType] || eventTypes[5]
    return {
      title: eventType_.title[language] || eventType_.title.es,
      description: eventType_.description[language] || eventType_.description.es,
      category: eventType_.category,
      group: eventType_.group
    }
  }

  const ephemeris = getCurrentEphemeris()

  // Función para compartir en redes sociales
  const shareOnX = () => {
    const text = `🎵 Efeméride del Kpop - ${ephemeris.date}
${ephemeris.title}
${ephemeris.description}

#Kpop #KpopDaily #${ephemeris.group.replace(/\s+/g, '')}`
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank')
  }

  const shareOnInstagram = () => {
    // Para Instagram, copiamos el texto al portapapeles
    const text = `🎵 Efeméride del Kpop - ${ephemeris.date}
${ephemeris.title}
${ephemeris.description}

#Kpop #KpopDaily #${ephemeris.group.replace(/\s+/g, '')}`
    
    navigator.clipboard.writeText(text).then(() => {
      alert(t('instagramCopied'))
    })
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

  const getCategoryTranslation = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Debut": t('debut'),
      "Logro": t('achievement'),
      "Récord": t('record'), 
      "Premio": t('award'),
      "Especial": t('special')
    }
    return categoryMap[category] || category
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isFutureDate = (date: Date) => {
    const today = new Date()
    return date > today
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t('title')}</h1>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
              </div>
            </div>
            
            {/* Selector de idiomas */}
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Información del día actual */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-500">
            <Calendar className="w-6 h-6 text-purple-600 animate-pulse" />
            <span className="font-bold text-xl text-gray-800">
              {formatDate(currentDate)}
            </span>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium animate-bounce">
              {t('today')}
            </span>
          </div>
        </div>

        {/* Contador para próxima efeméride */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
            <Clock className="w-5 h-5 animate-spin" />
            <div className="text-center">
              <div className="text-sm font-medium opacity-90">{t('nextEphemeris')}</div>
              <div className="text-xl font-bold font-mono">{timeUntilNext}</div>
            </div>
          </div>
        </div>

        {/* Efeméride principal */}
        <Card className="mb-8 overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className={`h-3 bg-gradient-to-r ${getCategoryColor(ephemeris.category)} animate-pulse-soft`} />
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(ephemeris.category)} text-white text-sm font-semibold mb-4 animate-pulse-soft hover:scale-105 transition-transform cursor-pointer`}
              >
                <Star className="w-4 h-4" />
                {getCategoryTranslation(ephemeris.category)}
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
                <span>{t('ephemerisOf')} {formatDateShort(currentDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de compartir */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
            <span className="text-gray-700 font-medium">{t('share')}</span>
            <Button
              onClick={shareOnX}
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Twitter className="w-4 h-4 mr-2" />
              X (Twitter)
            </Button>
            <Button
              onClick={shareOnInstagram}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg animate-pulse">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {t('newEphemerisDaily')}
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">365</div>
            <div className="text-pink-100">{t('daysOfHistory')}</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">∞</div>
            <div className="text-purple-100">{t('epicMoments')}</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold mb-2">♪</div>
            <div className="text-blue-100">{t('dailyRhythm')}</div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">{t('title')}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{t('footerDescription')}</p>
          <p className="text-gray-500 text-xs">
            {t('madeBy')}{" "}
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
