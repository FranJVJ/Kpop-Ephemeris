// Funciones de utilidad para trabajar con la estructura de Kpop_Ephemerides
export const formatEphemerisDate = (month: number, day: number) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return `${day} de ${months[month - 1]}`
}

export const createDateKey = (month: number, day: number) => {
  const monthStr = String(month).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  return `${monthStr}-${dayStr}`
}

export const parseDateKey = (dateKey: string) => {
  const [month, day] = dateKey.split('-').map(Number)
  return { month, day }
}

export const findEphemerisByDate = (ephemerides: any[], month: number, day: number) => {
  return ephemerides.find(item => item.month === month && item.day === day)
}

export const getEventDescription = (event: number) => {
  // Mapear los números de evento a descripciones detalladas
  const eventTypes = {
    1: { 
      category: 'Debut', 
      title: 'Debut de grupo Kpop',
      description: 'Un nuevo grupo debuta en la industria del Kpop, marcando el inicio de su carrera musical y presentándose oficialmente al público.' 
    },
    2: { 
      category: 'Logro', 
      title: 'Logro histórico',
      description: 'Un hito significativo en la historia del Kpop, ya sea un primer lugar en charts, colaboración internacional o reconocimiento especial.' 
    },
    3: { 
      category: 'Récord', 
      title: 'Récord establecido',
      description: 'Un nuevo récord fue establecido en ventas, visualizaciones, asistencia a conciertos o cualquier otra métrica importante del Kpop.' 
    },
    4: { 
      category: 'Premio', 
      title: 'Premio importante',
      description: 'Un premio significativo fue otorgado, reconociendo el talento y el impacto de los artistas en la industria musical.' 
    },
    5: { 
      category: 'Especial', 
      title: 'Evento especial del Kpop',
      description: 'Un evento especial, colaboración única, aniversario importante o momento memorable en la historia del Kpop.' 
    }
  }
  
  return eventTypes[event as keyof typeof eventTypes] || { 
    category: 'Evento', 
    title: 'Evento del Kpop',
    description: 'Un evento importante en la historia del Kpop que merece ser recordado.' 
  }
}

// Convertir datos de Supabase al formato esperado por la aplicación
export const transformSupabaseData = (data: any) => {
  const eventInfo = getEventDescription(data.event)
  
  return {
    id: data.id,
    date_key: createDateKey(data.month, data.day),
    date_display: formatEphemerisDate(data.month, data.day),
    year: data.year?.toString() || data.historical_year?.toString() || '????',
    title: `Evento ${eventInfo.category}`,
    description: eventInfo.description,
    category: eventInfo.category,
    group_name: 'K-Pop',
    raw_data: data // Mantener los datos originales por si los necesitamos
  }
}
