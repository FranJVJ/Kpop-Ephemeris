-- Script para solucionar problemas de RLS en Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard

-- 1. Verificar que la tabla existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'Kpop_Ephemerides';

-- 2. Verificar estructura de la tabla
\d "Kpop_Ephemerides"

-- 3. Verificar el estado actual de RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'Kpop_Ephemerides';

-- 4. Ver políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'Kpop_Ephemerides';

-- 5. Eliminar políticas existentes que puedan estar causando problemas
DROP POLICY IF EXISTS "Allow anonymous select" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "Allow anonymous insert" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "Enable read access for all users" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "Enable insert for all users" ON "Kpop_Ephemerides";

-- 6. Crear política para permitir SELECT a usuarios anónimos
CREATE POLICY "public_read" ON "Kpop_Ephemerides"
FOR SELECT 
USING (true);

-- 7. Crear política para permitir INSERT a usuarios anónimos
CREATE POLICY "public_insert" ON "Kpop_Ephemerides"
FOR INSERT 
WITH CHECK (true);

-- 8. Crear política para permitir UPDATE a usuarios anónimos
CREATE POLICY "public_update" ON "Kpop_Ephemerides"
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 9. Crear política para permitir DELETE a usuarios anónimos
CREATE POLICY "public_delete" ON "Kpop_Ephemerides"
FOR DELETE 
USING (true);

-- 10. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'Kpop_Ephemerides';

-- 11. Insertar algunos datos de prueba
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) 
VALUES 
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025),
(13, 6, 2013, 1, '2013-06-13', 13, 6, 2013),
(8, 8, 2016, 1, '2016-08-08', 8, 8, 2016);

-- 12. Verificar que los datos se insertaron
SELECT COUNT(*) as total FROM "Kpop_Ephemerides";
SELECT * FROM "Kpop_Ephemerides" ORDER BY month, day;
