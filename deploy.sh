#!/bin/bash

# 🚀 Script de despliegue para K-pop Ephemeris
# Automatiza la preparación para GitHub y Vercel

echo "🎵 Preparando K-pop Ephemeris para despliegue..."
echo ""

# 1. Verificar Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📦 Inicializando repositorio Git..."
    git init
    echo "✅ Git inicializado"
else
    echo "✅ Repositorio Git ya existe"
fi

# 2. Agregar archivos
echo "📁 Agregando archivos al repositorio..."
git add .

# 3. Commit
echo "💾 Creando commit..."
git commit -m "🎵 Sistema automático completo de efemérides K-pop

✨ Características:
- Base de datos histórica con 50+ eventos verificados
- Sistema automático que se ejecuta a las 15:00 diariamente
- Compatible con estructura existente de Supabase
- Sin costos de API, solo eventos históricos reales
- Listo para despliegue en Vercel

🔧 Tecnologías:
- Next.js 15 + TypeScript
- Supabase PostgreSQL  
- Node.js + node-cron para automatización
- shadcn/ui para interfaz
- Tailwind CSS para estilos

📦 Incluye:
- Sistema de generación automática
- Base de datos curada de eventos K-pop
- Documentación completa de despliegue
- Scripts npm para mantenimiento
- Configuración lista para Vercel"

echo "✅ Commit creado exitosamente"
echo ""
echo "🌐 Próximos pasos para despliegue:"
echo ""
echo "1. 📋 Crear repositorio en GitHub:"
echo "   - Ve a https://github.com/new"
echo "   - Nombra tu repositorio (ej: kpop-ephemeris)"
echo "   - NO inicialices con README (ya tienes uno)"
echo ""
echo "2. 🔗 Conectar repositorio remoto:"
echo "   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 🚀 Desplegar en Vercel:"
echo "   - Ve a https://vercel.com"
echo "   - Conecta tu repositorio GitHub"
echo "   - Configura variables de entorno:"
echo "     * NEXT_PUBLIC_SUPABASE_URL"
echo "     * NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - ¡Despliega!"
echo ""
echo "📖 Consulta DEPLOYMENT_GUIDE.md para instrucciones detalladas"
echo ""
echo "🎵 ¡Tu sistema automático está listo para funcionar 24/7!"
