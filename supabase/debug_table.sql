-- Script alternativo con diferentes formatos de nombre de tabla
-- Prueba estas opciones una por una hasta encontrar la que funcione

-- OPCIÓN 1: Sin comillas (PostgreSQL convierte a minúsculas)
INSERT INTO kpop_ephemerides (day, month, year, event, display_date, historical_day, historical_month, historical_year) VALUES
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025);

-- OPCIÓN 2: Con comillas dobles (mantiene mayúsculas exactas)
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) VALUES
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025);

-- OPCIÓN 3: Con esquema explícito
INSERT INTO public."Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) VALUES
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025);

-- VERIFICACIÓN: Ver qué tablas existen exactamente
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name ILIKE '%ephemerides%';

-- VERIFICACIÓN: Ver todas las tablas en el esquema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- VERIFICACIÓN: Contar registros existentes (si la tabla existe)
SELECT COUNT(*) as total_records 
FROM "Kpop_Ephemerides";

-- VERIFICACIÓN: Ver algunos datos existentes
SELECT * FROM "Kpop_Ephemerides" LIMIT 5;
