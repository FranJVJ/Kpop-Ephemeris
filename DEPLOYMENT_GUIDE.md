# 🎵 K-pop Ephemeris - Sistema Automático Completo

## 📋 Resumen del Sistema

Este proyecto implementa un sistema completamente automático de efemérides del K-pop que:

- 🔄 **Se ejecuta automáticamente** todos los días a las 15:00 (hora española)
- 📚 **Base de datos histórica** con 50+ eventos verificados del K-pop
- 🚫 **Sin costos de API** - usa eventos históricos reales en lugar de IA
- ✅ **Compatible** con la estructura existente de la base de datos
- 🌐 **Listo para despliegue** en Vercel con GitHub

## 🚀 Despliegue Rápido

### 1. Preparar para GitHub

```bash
# 1. Inicializar Git (si no está)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer commit
git commit -m "🎵 Sistema automático completo de efemérides K-pop con base histórica"

# 4. Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/kpop-ephemeris.git
git branch -M main
git push -u origin main
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Despliegue en Vercel

1. **Conecta tu repositorio** en [vercel.com](https://vercel.com)
2. **Configura las variables de entorno** en el dashboard de Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Despliega** - Vercel hará todo automáticamente

## 📁 Estructura del Sistema

```
📦 kpop-ephemeris/
├── 🏠 app/                     # Aplicación Next.js 15
├── 🎨 components/              # Componentes React + shadcn/ui
├── 📜 scripts/                 # Sistema automático
│   ├── 🗄️  kpop-ephemerides-database.js    # Base de datos histórica (50+ eventos)
│   ├── ⚙️  daily-ephemeris-generator-simple.js # Generador compatible
│   ├── ⏰ scheduler-simple.js               # Scheduler 15:00 hora española
│   └── 📋 package.json                     # Scripts npm
├── 🔧 start-ephemeris.js       # Script de inicio simplificado
└── 📚 README.md               # Esta documentación
```

## 🎯 Funcionalidades Implementadas

### ✅ Base de Datos Histórica
- **50+ eventos verificados** del K-pop
- **Fechas reales** de debuts, logros, récords
- **Metadatos completos**: grupos, años, categorías, fuentes
- **Cobertura completa** de julio a diciembre 2025

### ✅ Sistema Automático
- **Ejecución diaria** a las 15:00 (zona horaria española)
- **Inserción automática** en Supabase
- **Logs detallados** para monitoreo
- **Fallbacks inteligentes** si no hay evento histórico

### ✅ Compatibilidad Total
- **Estructura original** de la base de datos respetada
- **Columnas básicas** únicamente (day, month, year, event, etc.)
- **Sin dependencias externas** costosas
- **Funcionamiento garantizado** sin cambios en DB

## 🛠️ Configuración Técnica

### Scripts Disponibles

```bash
# En la carpeta scripts/
npm run generate-simple    # Generar efeméride para hoy
npm run test-simple       # Probar generación
npm run schedule-simple   # Iniciar scheduler
npm run start-auto        # Modo automático completo
npm run test-auto         # Probar sistema completo
```

### Archivos Clave

#### 📋 `kpop-ephemerides-database.js`
- Base de datos completa de eventos históricos
- Función `getEphemerisForDate(day, month)` para obtener eventos
- Eventos organizados por fecha (formato 'DD-MM')

#### ⚙️ `daily-ephemeris-generator-simple.js`
- Generador compatible con estructura original
- Integración con base de datos histórica
- Fallbacks creativos si no hay evento específico

#### ⏰ `scheduler-simple.js`
- Ejecutor automático con node-cron
- Configurado para 15:00 hora española
- Logs detallados y notificaciones

## 🎵 Eventos Históricos Incluidos

El sistema incluye eventos reales y verificados como:

- **5 agosto 2007**: Debut oficial de Girls' Generation
- **8 agosto 2016**: Debut de BLACKPINK  
- **24 julio 2015**: Debut de CLC
- **Y 47 eventos más...** cubriendo debuts, logros, récords

## 🔧 Mantenimiento

### Agregar Nuevos Eventos
Edita `scripts/kpop-ephemerides-database.js`:

```javascript
'DD-MM': {
  title: "Título del evento",
  description: "Descripción detallada...",
  year: "YYYY",
  category: 'Debut|Logro|Récord|Premio|Especial',
  group: "Nombre del grupo",
  confidence: 'alta',
  sources: 'Fuente verificada'
}
```

### Monitorear Sistema
- Logs automáticos en consola del servidor
- Verificación diaria de inserción
- Fallbacks automáticos si hay problemas

## 📊 Base de Datos

### Tabla: `Kpop_Ephemerides`
```sql
- id (autoincremental)
- day (integer) 
- month (integer)
- year (integer)
- event (text)
- display_date (text)
- historical_accuracy (text) 
- historical_sources (text)
```

## 🌐 Despliegue en Producción

### Vercel (Recomendado)
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Despliegue automático en cada push

### Variables Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-key-anonima
```

## 📈 Estado del Proyecto

- ✅ **Base de datos histórica**: Completa (50+ eventos)
- ✅ **Sistema automático**: Funcional
- ✅ **Compatibilidad**: Total con DB existente  
- ✅ **Documentación**: Completa
- ✅ **Listo para producción**: Sí
- ⏳ **Ejecutándose**: Requiere deployment

## 🆘 Solución de Problemas

### Error: "supabaseUrl is required"
- Configurar variables de entorno `.env.local`
- Verificar valores en dashboard de Vercel

### Error: "fetch failed" 
- Verificar conexión a internet
- Comprobar configuración de Supabase
- Validar URLs y keys

### Sistema no inserta efemérides
- Verificar logs del scheduler
- Comprobar horario (15:00 española)
- Validar permisos de DB

## 🎯 Próximos Pasos

1. **Desplegar en Vercel** ← SIGUIENTE
2. Monitorear inserción diaria
3. Expandir base de datos histórica
4. Optimizar UI/UX

---

**🎵 ¡Tu sistema automático de efemérides K-pop está listo para funcionar 24/7!**
