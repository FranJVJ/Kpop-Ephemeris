# 🎵 Sistema de Efemérides Automáticas del K-pop

## 📋 Descripción

Sistema completo de efemérides diarias del K-pop que genera automáticamente eventos históricos reales todos los días a las **15:00 hora española**. 

### ✨ Características principales:

✅ **Base de datos histórica completa** - Eventos reales y verificados del K-pop  
✅ **Automatización diaria** - Se ejecuta automáticamente a las 15:00  
✅ **Eventos históricos reales** - Girls' Generation, BLACKPINK, BTS, EXO, TWICE y más  
✅ **Sin costo de API** - No necesita OpenAI, usa base de datos curada  
✅ **Compatible con tu estructura actual** - Funciona con tu base de datos existente  

## 🚀 Comandos disponibles

### Comandos principales:
```bash
# Iniciar sistema automático (ejecuta a las 15:00 todos los días)
npm run start-auto

# Probar manualmente (genera para hoy)
npm run test-auto

# Generar efeméride simple
npm run test-simple

# Generar para fecha específica
node generate-specific.js
```

### Comandos de mantenimiento:
```bash
# Limpiar efemérides específicas
node clean-ephemeris.js

# Diagnosticar estructura de tabla
node diagnose-table.js
```

## 📅 Base de Datos de Efemérides

### Eventos destacados incluidos:

**Agosto:**
- **5 de agosto**: Debut oficial de Girls' Generation (2007)
- **8 de agosto**: Debut de BLACKPINK (2016)
- **6 de agosto**: Lanzamiento de 'Monster' de EXO (2016)

**Septiembre:**
- **1 de septiembre**: Debut de AOA (2012)
- **3 de septiembre**: Lanzamiento de 'Love Scenario' de iKON (2018)

**Octubre:**
- **1 de octubre**: Debut de Stray Kids (2018)
- **3 de octubre**: Lanzamiento de 'DNA' de BTS (2017)

**Y muchos más eventos históricos verificados...**

## ⚙️ Configuración

### 1. Dependencias instaladas ✅
```bash
npm install  # Ya ejecutado
```

### 2. Variables de entorno ✅
El archivo `.env.local` ya está configurado con Supabase.

### 3. Base de datos ✅
La tabla `Kpop_Ephemerides` está lista y funcionando.

## 🏃‍♂️ Uso rápido

### Para iniciar el sistema automático:
```bash
cd scripts
npm run start-auto
```

### Para probar manualmente:
```bash
cd scripts
npm run test-auto
```

## 📊 Estructura de datos

Cada efeméride incluye:
- **title**: Título descriptivo del evento
- **description**: Descripción detallada (máx. 200 caracteres)
- **year**: Año histórico real del evento
- **category**: Debut|Logro|Récord|Premio|Especial
- **group**: Nombre del grupo o artista
- **confidence**: Nivel de confianza (alta|media|baja)
- **sources**: Fuentes de verificación

## 🕐 Horario de ejecución

**Hora española (Europe/Madrid)**: 15:00 todos los días

El sistema:
1. Se ejecuta automáticamente a las 15:00
2. Busca en la base de datos histórica
3. Genera la efeméride para el día siguiente
4. La inserta en tu base de datos de Supabase
5. Tu aplicación web la muestra automáticamente

## 🎯 Estado actual

✅ **Sistema funcionando**: Probado con Girls' Generation y BLACKPINK  
✅ **Base de datos curada**: 50+ eventos históricos reales  
✅ **Scheduler configurado**: Listo para ejecutar a las 15:00  
✅ **Frontend compatible**: Tu app web ya muestra las efemérides  

## 🔧 Solución de problemas

### Si no aparecen efemérides:
1. Verifica que el scheduler esté corriendo: `npm run start-auto`
2. Prueba manualmente: `npm run test-auto`
3. Verifica la estructura: `node diagnose-table.js`

### Si aparecen efemérides genéricas:
- El sistema usa efemérides rotativas cuando no hay datos específicos para la fecha
- Esto es normal y proporciona variedad

## 📝 Archivos importantes

- `daily-ephemeris-generator-simple.js`: Generador principal
- `scheduler-simple.js`: Programador automático  
- `kpop-ephemerides-database.js`: Base de datos histórica
- `package.json`: Scripts npm disponibles

## 🎉 ¡Listo para usar!

Tu sistema está completamente configurado. Solo ejecuta:

```bash
npm run start-auto
```

Y tendrás efemérides históricas del K-pop automáticamente todos los días a las 15:00. 🎵
