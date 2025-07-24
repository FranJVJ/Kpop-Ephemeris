# Configuración adaptada para tu tabla Kpop_Ephemerides

## Estructura de tu tabla actual

Tu tabla `Kpop_Ephemerides` tiene la siguiente estructura:

```sql
CREATE TABLE public.Kpop_Ephemerides (
  day integer NOT NULL,                    -- Día del mes (1-31)
  month integer NOT NULL,                  -- Mes (1-12)
  year integer NOT NULL,                   -- Año del evento
  event integer NOT NULL,                  -- Tipo de evento (1-5)
  id bigint GENERATED ALWAYS AS IDENTITY, -- ID único
  created_at timestamp with time zone,     -- Fecha de creación
  updated_at timestamp with time zone,     -- Fecha de actualización
  display_date date,                       -- Fecha para mostrar
  historical_day integer,                  -- Día histórico
  historical_month integer,                -- Mes histórico
  historical_year integer                  -- Año histórico
);
```

## Mapeo de eventos

El campo `event` se mapea a las siguientes categorías:

- **1** → Debut (Debut de grupo)
- **2** → Logro (Logro importante)
- **3** → Récord (Récord establecido)
- **4** → Premio (Premio ganado)
- **5** → Especial (Evento especial)

## Código adaptado

### ✅ Archivos actualizados:

1. **`hooks/useSupabase.ts`** - Actualizado para usar `Kpop_Ephemerides`
2. **`lib/ephemerisUtils.ts`** - Funciones de utilidad para tu estructura
3. **`components/SupabaseEphemerides.tsx`** - Componente adaptado
4. **`app/supabase-demo/page.tsx`** - Página de demostración

### 🔄 Funciones de transformación:

```typescript
// Transformar datos de Supabase al formato de la aplicación
const transformSupabaseData = (data) => ({
  id: data.id,
  date_key: `${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`,
  date_display: formatEphemerisDate(data.month, data.day),
  year: data.year?.toString() || data.historical_year?.toString() || '????',
  title: getEventTitle(data.event),
  description: getEventDescription(data.event),
  category: getEventCategory(data.event),
  group_name: 'K-Pop',
  raw_data: data
})
```

## Ejemplo de inserción de datos

Para agregar nuevas efemérides a tu tabla:

```sql
INSERT INTO public.Kpop_Ephemerides (day, month, year, event, historical_day, historical_month, historical_year) VALUES
(15, 6, 2013, 1, 15, 6, 2013), -- Debut
(12, 8, 2020, 3, 12, 8, 2020), -- Récord
(25, 12, 2021, 4, 25, 12, 2021); -- Premio
```

## Próximos pasos

1. **Configurar variables de entorno** en `.env.local`
2. **Agregar datos** a tu tabla existente
3. **Probar la conexión** en `/supabase-demo`
4. **Expandir el mapeo** de eventos según tus necesidades

## Consultas útiles

### Ver todos los datos:
```sql
SELECT * FROM public.Kpop_Ephemerides ORDER BY month, day;
```

### Buscar por fecha:
```sql
SELECT * FROM public.Kpop_Ephemerides WHERE month = 7 AND day = 22;
```

### Contar eventos por tipo:
```sql
SELECT event, COUNT(*) FROM public.Kpop_Ephemerides GROUP BY event;
```
