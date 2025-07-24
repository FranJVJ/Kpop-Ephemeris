# 🎵 K-pop Ephemeris

> Sistema automático de efemérides del K-pop con base de datos histórica

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FranJVJ/Kpop-Ephemeris)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://kpop-ephemeris.vercel.app)

## 📋 Descripción

Sistema completamente automático que genera y muestra efemérides diarias del K-pop basadas en eventos históricos reales y verificados. Funciona 24/7 sin intervención manual.

### ✨ Características

- 🤖 **Automático**: Se ejecuta todos los días a las 15:00 (hora española)
- 📚 **Base histórica**: 50+ eventos verificados del K-pop (debuts, logros, récords)
- 💰 **Sin costos**: No usa APIs de IA, solo eventos históricos curados
- 🔄 **Tiempo real**: Interfaz moderna con React y Next.js 15
- 🎨 **Diseño elegante**: UI con shadcn/ui y Tailwind CSS

## 🚀 Demo

- **Sitio web**: [https://kpop-ephemeris-franjvj.vercel.app](https://tu-url-de-vercel.app)
- **Repositorio**: [https://github.com/FranJVJ/Kpop-Ephemeris](https://github.com/FranJVJ/Kpop-Ephemeris)

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de datos**: Supabase PostgreSQL
- **Automatización**: Node.js, node-cron
- **Despliegue**: Vercel

## 📦 Instalación Rápida

### 1. Clonar repositorio
```bash
git clone https://github.com/FranJVJ/Kpop-Ephemeris.git
cd Kpop-Ephemeris
```

### 2. Instalar dependencias
```bash
npm install
cd scripts && npm install && cd ..
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🎯 Uso

### Aplicación Web
La aplicación muestra automáticamente la efeméride del día actual con:
- Evento histórico del K-pop
- Descripción detallada
- Grupo/artista relacionado
- Año del evento
- Fuentes verificadas

### Sistema Automático
Para activar la generación automática diaria:
```bash
node start-ephemeris.js
```

El sistema se ejecutará todos los días a las 15:00 (hora española).

## 📊 Base de Datos Incluida

El proyecto incluye una base de datos curada con 50+ eventos históricos:

- **Debuts**: Girls' Generation (2007), BLACKPINK (2016), BTS, etc.
- **Logros**: Primeras victorias, récords internacionales
- **Fechas especiales**: Lanzamientos icónicos, colaboraciones
- **Premios**: MAMA Awards, Billboard achievements

## 🌐 Despliegue en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FranJVJ/Kpop-Ephemeris)

### Variables de entorno requeridas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📁 Estructura del Proyecto

```
├── app/                    # Aplicación Next.js 15
├── components/             # Componentes React + shadcn/ui
├── scripts/               # Sistema automático
│   ├── kpop-ephemerides-database.js    # Base de datos histórica
│   ├── daily-ephemeris-generator-simple.js # Generador
│   └── scheduler-simple.js             # Scheduler automático
├── lib/                   # Utilidades y configuración
├── supabase/              # Esquemas y configuración DB
└── DEPLOYMENT_GUIDE.md    # Guía completa de despliegue
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo
npm run build              # Build para producción
npm run start              # Servidor de producción

# Sistema automático
node start-ephemeris.js     # Iniciar sistema automático
cd scripts && npm run generate-simple  # Generar efeméride manual
cd scripts && npm run test-database    # Probar base de datos
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Especialmente para:

- 📅 Agregar más eventos históricos del K-pop
- 🎨 Mejorar el diseño de la interfaz
- 🌍 Traducciones a otros idiomas
- 🔧 Optimizaciones de rendimiento

### Agregar nuevos eventos:
Edita `scripts/kpop-ephemerides-database.js`:

```javascript
'DD-MM': {
  title: "Título del evento",
  description: "Descripción detallada...",
  year: "YYYY",
  category: 'Debut|Logro|Récord|Premio',
  group: "Nombre del grupo",
  confidence: 'alta',
  sources: 'Fuente verificada'
}
```

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- 📖 **Documentación completa**: Ver `DEPLOYMENT_GUIDE.md`
- 🐛 **Reportar bugs**: [Issues](https://github.com/FranJVJ/Kpop-Ephemeris/issues)
- 💬 **Preguntas**: [Discussions](https://github.com/FranJVJ/Kpop-Ephemeris/discussions)

---

**🎵 Hecho con ❤️ para la comunidad K-pop**
