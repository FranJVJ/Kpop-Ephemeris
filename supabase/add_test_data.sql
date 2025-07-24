-- Script para añadir datos de prueba a la tabla Kpop_Ephemerides
-- Ejecutar en la consola SQL de Supabase

-- 1. Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Kpop_Ephemerides' 
ORDER BY ordinal_position;

-- 2. Limpiar datos existentes si queremos empezar limpio (opcional)
-- DELETE FROM "Kpop_Ephemerides";

-- 3. Insertar datos de prueba para fechas específicas

-- Evento para HOY (22 de julio)
INSERT INTO "Kpop_Ephemerides" (
  day, month, year, event, 
  display_date, 
  historical_day, historical_month, historical_year
) VALUES (
  22, 7, 2025, 5, 
  '2025-07-22', 
  22, 7, 2025
);

-- Algunos eventos históricos importantes
INSERT INTO "Kpop_Ephemerides" (
  day, month, year, event, 
  display_date, 
  historical_day, historical_month, historical_year
) VALUES 
-- Debut de BTS
(13, 6, 2013, 1, '2013-06-13', 13, 6, 2013),
-- Debut de BLACKPINK  
(8, 8, 2016, 1, '2016-08-08', 8, 8, 2016),
-- Debut de EXO
(1, 1, 2012, 1, '2012-01-01', 1, 1, 2012),
-- Evento especial - Primer concierto de BIGBANG
(19, 8, 2006, 5, '2006-08-19', 19, 8, 2006),
-- Récord de ventas de Girls' Generation
(9, 8, 2009, 3, '2009-08-09', 9, 8, 2009);

-- 4. Verificar que los datos se insertaron correctamente
SELECT 
  day, month, year, event, display_date,
  CASE event
    WHEN 1 THEN 'Debut'
    WHEN 2 THEN 'Logro'
    WHEN 3 THEN 'Récord'
    WHEN 4 THEN 'Premio'
    WHEN 5 THEN 'Especial'
    ELSE 'Desconocido'
  END as event_type
FROM "Kpop_Ephemerides" 
ORDER BY month, day;

-- 5. Verificar datos para el día de hoy
SELECT * FROM "Kpop_Ephemerides" 
WHERE day = 22 AND month = 7;

-- 6. Contar total de registros
SELECT COUNT(*) as total_records FROM "Kpop_Ephemerides";
