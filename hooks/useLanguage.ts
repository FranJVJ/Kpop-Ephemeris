"use client"

import { useState, useEffect } from 'react'

export type Language = 'es' | 'en' | 'ko'

interface Translations {
  [key: string]: {
    es: string
    en: string
    ko: string
  }
}

const translations: Translations = {
  // Header
  title: {
    es: "Kpop Daily",
    en: "Kpop Daily", 
    ko: "Kpop Daily"
  },
  subtitle: {
    es: "Curiosidades del Kpop",
    en: "Kpop Curiosities",
    ko: "케이팝 흥미로운 사실"
  },
  
  // Navigation
  today: {
    es: "Hoy",
    en: "Today",
    ko: "오늘"
  },
  
  // Timer
  nextEphemeris: {
    es: "Próxima curiosidad en:",
    en: "Next curiosity in:",
    ko: "다음 이야기:"
  },
  
  // Categories
  debut: {
    es: "Debut",
    en: "Debut",
    ko: "데뷔"
  },
  achievement: {
    es: "Logro",
    en: "Achievement", 
    ko: "성취"
  },
  record: {
    es: "Récord",
    en: "Record",
    ko: "기록"
  },
  award: {
    es: "Premio",
    en: "Award",
    ko: "수상"
  },
  special: {
    es: "Especial",
    en: "Special",
    ko: "특별"
  },
  
  // Sharing
  share: {
    es: "Compartir:",
    en: "Share:",
    ko: "공유:"
  },
  instagramCopied: {
    es: "¡Texto copiado! Pégalo en tu historia de Instagram",
    en: "Text copied! Paste it in your Instagram story",
    ko: "텍스트가 복사되었습니다! 인스타그램 스토리에 붙여넣으세요"
  },
  
  // Info messages
  newEphemerisDaily: {
    es: "¡Nueva curiosidad cada día a las 15:00! ✨",
    en: "New curiosity every day at 15:00! ✨",
    ko: "매일 15:00에 새로운 이야기! ✨"
  },
  
  // Stats
  daysOfHistory: {
    es: "Días de historia",
    en: "Days of history",
    ko: "역사의 날들"
  },
  epicMoments: {
    es: "Momentos épicos", 
    en: "Epic moments",
    ko: "전설의 순간"
  },
  dailyRhythm: {
    es: "Ritmo diario",
    en: "Daily beat", 
    ko: "매일의 리듬"
  },
  
  // Footer
  footerDescription: {
    es: "Celebrando la historia y cultura del Kpop, un día a la vez",
    en: "Celebrating Kpop history and culture, one day at a time",
    ko: "케이팝의 역사와 문화를 하루하루 기념하며"
  },
  madeBy: {
    es: "Realizado por",
    en: "Made by",
    ko: "제작자"
  },
  
  // Date formats
  ephemerisOf: {
    es: "Curiosidad del",
    en: "Curiosity of",
    ko: "흥미로운 사실:"
  },
  
  // Months
  january: { es: "enero", en: "January", ko: "1월" },
  february: { es: "febrero", en: "February", ko: "2월" },
  march: { es: "marzo", en: "March", ko: "3월" },
  april: { es: "abril", en: "April", ko: "4월" },
  may: { es: "mayo", en: "May", ko: "5월" },
  june: { es: "junio", en: "June", ko: "6월" },
  july: { es: "julio", en: "July", ko: "7월" },
  august: { es: "agosto", en: "August", ko: "8월" },
  september: { es: "septiembre", en: "September", ko: "9월" },
  october: { es: "octubre", en: "October", ko: "10월" },
  november: { es: "noviembre", en: "November", ko: "11월" },
  december: { es: "diciembre", en: "December", ko: "12월" },
  
  // Fallback messages
  noEphemeris: {
    es: "No hay curiosidades para este día",
    en: "No curiosities for this day",
    ko: "이 날의 흥미로운 사실이 없습니다"
  },
  noEphemerisDescription: {
    es: "Aún no tenemos información para esta fecha.",
    en: "We don't have information for this date yet.",
    ko: "아직 이 날짜에 대한 정보가 없습니다."
  },
  lastAvailable: {
    es: "Última disponible",
    en: "Last available",
    ko: "마지막 업데이트"
  },
  
  // Language names
  languageSpanish: {
    es: "Español",
    en: "Spanish",
    ko: "스페인어"
  },
  languageEnglish: {
    es: "Inglés", 
    en: "English",
    ko: "영어"
  },
  languageKorean: {
    es: "Coreano",
    en: "Korean", 
    ko: "한국어"
  },
  
  // Stats descriptions
  yearOfHistory: {
    es: "Un año completo de historia K-pop",
    en: "A full year of K-pop history",
    ko: "케이팝 역사의 완전한 한 해"
  },
  epicChanges: {
    es: "Momentos que cambiaron el K-pop",
    en: "Moments that changed K-pop",
    ko: "케이팝을 바꾼 순간들"
  },
  dailySchedule: {
    es: "15:00 cada día, sin fallar",
    en: "15:00 every day, without fail",
    ko: "매일 15:00, 빠짐없이"
  }
}

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('es')
  const [mounted, setMounted] = useState(false)

  // Marcar como montado cuando el componente se monta en el cliente
  useEffect(() => {
    setMounted(true)
    // Cargar idioma guardado inmediatamente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('kpop-daily-language') as Language
      if (savedLanguage && ['es', 'en', 'ko'].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  // Función para cambiar idioma con forzado de re-render
  const changeLanguage = (newLanguage: Language) => {
    console.log('Changing language to:', newLanguage)
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpop-daily-language', newLanguage)
    }
    // Forzar re-render inmediato
    setTimeout(() => {
      window.dispatchEvent(new Event('languageChanged'))
    }, 0)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['es'] || key
  }

  const getLanguageInfo = () => {
    const languages = {
      es: { name: t('languageSpanish'), flag: '🇪🇸' },
      en: { name: t('languageEnglish'), flag: '🇺🇸' },
      ko: { name: t('languageKorean'), flag: '🇰🇷' }
    }
    return languages
  }

  const formatDate = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]
    
    if (language === 'ko') {
      return `${year}년 ${t(months[month])} ${day}일`
    } else if (language === 'en') {
      return `${t(months[month])} ${day}, ${year}`
    } else {
      return `${day} de ${t(months[month])} de ${year}`
    }
  }

  const formatDateShort = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth()
    
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]
    
    if (language === 'ko') {
      return `${t(months[month])} ${day}일`
    } else if (language === 'en') {
      return `${t(months[month])} ${day}`
    } else {
      return `${day} de ${t(months[month])}`
    }
  }

  // Función para formatear la hora local (15:00 hora española convertida a hora local)
  const getLocalTime = () => {
    // Determinar si estamos en horario de verano o invierno
    const today = new Date()
    const year = today.getFullYear()
    
    // Crear fechas para determinar horario de verano
    const startDST = new Date(year, 2, 31) // Último domingo de marzo
    startDST.setDate(31 - startDST.getDay())
    
    const endDST = new Date(year, 9, 31) // Último domingo de octubre  
    endDST.setDate(31 - endDST.getDay())
    
    // Determinar si estamos en horario de verano
    const isDST = today >= startDST && today < endDST
    
    // Madrid: UTC+1 en invierno, UTC+2 en verano
    const madridOffsetHours = isDST ? 2 : 1
    
    // Convertir 15:00 Madrid a UTC
    const utcHour = 15 - madridOffsetHours
    
    // Crear fecha UTC con la hora equivalente
    const utcDate = new Date()
    utcDate.setUTCHours(utcHour, 0, 0, 0)
    
    // Obtener la hora local
    const localHour = utcDate.getHours()
    const localMinute = utcDate.getMinutes()
    
    // Formatear según el idioma
    if (language === 'ko') {
      return `${localHour}:${localMinute.toString().padStart(2, '0')}`
    } else if (language === 'en') {
      // Formato 12 horas para inglés
      const hour12 = localHour === 0 ? 12 : localHour > 12 ? localHour - 12 : localHour
      const ampm = localHour >= 12 ? 'PM' : 'AM'
      return `${hour12}:${localMinute.toString().padStart(2, '0')} ${ampm}`
    } else {
      // Formato 24 horas para español
      return `${localHour}:${localMinute.toString().padStart(2, '0')}`
    }
  }

  // Función para obtener mensajes con hora local
  const getLocalizedTimeMessage = (key: string) => {
    const localTime = getLocalTime()
    
    if (key === 'newEphemerisDaily') {
      if (language === 'ko') {
        return `매일 ${localTime}에 새로운 이야기! ✨`
      } else if (language === 'en') {
        return `New curiosity every day at ${localTime}! ✨`
      } else {
        return `¡Nueva curiosidad cada día a las ${localTime}! ✨`
      }
    } else if (key === 'dailySchedule') {
      if (language === 'ko') {
        return `매일 ${localTime}, 빠짐없이`
      } else if (language === 'en') {
        return `${localTime} every day, without fail`
      } else {
        return `${localTime} cada día, sin fallar`
      }
    }
    
    return translations[key]?.[language] || translations[key]?.['es'] || key
  }

  return {
    language,
    setLanguage: changeLanguage,
    t,
    getLanguageInfo,
    formatDate,
    formatDateShort,
    getLocalizedTimeMessage,
    mounted
  }
}
