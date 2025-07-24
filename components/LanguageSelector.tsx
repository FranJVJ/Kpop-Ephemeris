"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage, Language } from "@/hooks/useLanguage"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageClick = (newLang: Language) => {
    console.log('Language selector clicked:', newLang)
    if (newLang !== language) {
      setLanguage(newLang)
      // Forzar re-render inmediato de toda la página
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
      <Languages className="w-4 h-4 text-gray-600" />
      <div className="flex gap-1">
        <button
          onClick={() => handleLanguageClick('es')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            language === 'es' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🇪🇸 ES
        </button>
        <button
          onClick={() => handleLanguageClick('en')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            language === 'en' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🇺🇸 EN
        </button>
        <button
          onClick={() => handleLanguageClick('ko')}
          className={`px-3 py-1 text-xs rounded transition-all ${
            language === 'ko' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🇰🇷 KO
        </button>
      </div>
      <span className="text-xs text-gray-500 ml-2">({language})</span>
    </div>
  )
}
