# Configuración de Supabase para Kpop Ephemeris

## Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a [https://app.supabase.com/](https://app.supabase.com/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto se configure (puede tomar unos minutos)

### 2. Obtener las credenciales
1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (URL del proyecto)
   - **anon/public key** (Clave anónima/pública)

### 3. Configurar variables de entorno
1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 4. Ejecutar el schema de la base de datos
1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase/schema.sql`
3. Ejecuta el script para crear las tablas y datos de ejemplo

### 5. Verificar la configuración
1. Reinicia el servidor de desarrollo: `npm run dev`
2. La aplicación debería conectarse automáticamente a Supabase
3. Verifica que los datos se cargan correctamente

## Características implementadas

### ✅ Configuración del cliente
- Cliente de Supabase configurado en `lib/supabase.ts`
- Variables de entorno para URL y clave anónima

### ✅ Hooks personalizados
- `useEphemerides`: Para manejar datos de efemérides
- `useAuth`: Para autenticación de usuarios

### ✅ Esquema de base de datos
- Tabla `ephemerides` con campos completos
- Row Level Security (RLS) habilitado
- Políticas de seguridad configuradas
- Datos de ejemplo incluidos

### ✅ Componente de ejemplo
- `SupabaseEphemerides`: Muestra efemérides desde Supabase
- Estados de carga y error
- Funcionalidad de recarga

## Funcionalidades disponibles

### Operaciones CRUD
- **Create**: Agregar nuevas efemérides
- **Read**: Leer efemérides existentes
- **Update**: Actualizar efemérides
- **Delete**: Eliminar efemérides

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Estados de autenticación

### Tiempo real (opcional)
Supabase soporta actualizaciones en tiempo real. Para habilitarlas:

```typescript
// Escuchar cambios en la tabla
supabase
  .channel('ephemerides')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'ephemerides' },
    (payload) => {
      console.log('Cambio detectado:', payload)
      // Actualizar estado local
    }
  )
  .subscribe()
```

## Solución de problemas

### Error de conexión
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa que las URLs no tengan espacios o caracteres especiales

### Error de permisos
- Verifica que las políticas RLS estén configuradas
- Asegúrate de que el usuario tenga los permisos necesarios

### Error de compilación
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Reinicia el servidor de desarrollo

## Próximos pasos

1. **Integrar con la página principal**: Reemplazar los datos estáticos con datos de Supabase
2. **Agregar panel de administración**: Para gestionar efemérides desde la web
3. **Implementar autenticación**: Para proteger operaciones de escritura
4. **Optimizar rendimiento**: Implementar paginación y filtros
5. **Agregar imágenes**: Usar Supabase Storage para almacenar imágenes
