# 🚨 AVISO DE SEGURIDAD

## Incidente de Exposición de JWT - 24 Julio 2025

### ¿Qué pasó?
GitGuardian detectó que **DOS JSON Web Tokens (JWT)** de Supabase fueron expuestos en este repositorio público:

1. **Proyecto principal**: `xpkspqjuxcmkscysnmqf.supabase.co` (en múltiples archivos)
2. **Proyecto secundario**: `pqxyokyidfpgtdqpfsoe.supabase.co` (en clear-db.js)

### ✅ Acciones tomadas:
1. **Claves eliminadas** del código fuente
2. **Repositorio limpiado** de credenciales sensibles
3. **.gitignore actualizado** para prevenir futuras exposiciones
4. **Documentación actualizada** con mejores prácticas

### 🔧 Acción requerida del usuario:
1. **REGENERAR** inmediatamente las claves de AMBOS proyectos Supabase:
   
   **Proyecto 1 (Principal)**: `xpkspqjuxcmkscysnmqf.supabase.co`
   - Ve a https://app.supabase.com
   - Settings → API → Regenerate anon/public key
   
   **Proyecto 2 (Secundario)**: `pqxyokyidfpgtdqpfsoe.supabase.co`
   - Ve a https://app.supabase.com  
   - Settings → API → Regenerate anon/public key

2. **Actualizar** las variables de entorno en Vercel con las nuevas claves del proyecto principal
3. **Actualizar** `.env.local` con las nuevas claves regeneradas
4. **Verificar** qué proyecto Supabase estás usando actualmente

### 🛡️ Mejores prácticas implementadas:
- Variables de entorno nunca en código fuente
- .gitignore protege archivos sensibles  
- Solo placeholders en archivos de ejemplo
- Documentación de seguridad

### 📞 Soporte:
Si necesitas ayuda, contacta al equipo de desarrollo.

---
**Fecha**: 24 Julio 2025  
**Estado**: Resuelto - Requiere regeneración de claves
