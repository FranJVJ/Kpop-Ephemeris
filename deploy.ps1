# 🚀 Script de despliegue para K-pop Ephemeris (Windows PowerShell)
# Automatiza la preparación para GitHub y Vercel

Write-Host "🎵 Preparando K-pop Ephemeris para despliegue..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Git
try {
    git rev-parse --git-dir 2>$null | Out-Null
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
} catch {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git inicializado" -ForegroundColor Green
}

# 2. Agregar archivos
Write-Host "📁 Agregando archivos al repositorio..." -ForegroundColor Yellow
git add .

# 3. Commit
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
$commitMessage = @"
🎵 Sistema automático completo de efemérides K-pop

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
- Configuración lista para Vercel
"@

git commit -m $commitMessage

Write-Host "✅ Commit creado exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Próximos pasos para despliegue:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 📋 Crear repositorio en GitHub:" -ForegroundColor White
Write-Host "   - Ve a https://github.com/new" -ForegroundColor Gray
Write-Host "   - Nombra tu repositorio (ej: kpop-ephemeris)" -ForegroundColor Gray
Write-Host "   - NO inicialices con README (ya tienes uno)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔗 Conectar repositorio remoto:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🚀 Desplegar en Vercel:" -ForegroundColor White
Write-Host "   - Ve a https://vercel.com" -ForegroundColor Gray
Write-Host "   - Conecta tu repositorio GitHub" -ForegroundColor Gray
Write-Host "   - Configura variables de entorno:" -ForegroundColor Gray
Write-Host "     * NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
Write-Host "     * NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "   - ¡Despliega!" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Consulta DEPLOYMENT_GUIDE.md para instrucciones detalladas" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎵 ¡Tu sistema automático está listo para funcionar 24/7!" -ForegroundColor Green

# Pausa para que el usuario lea
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
