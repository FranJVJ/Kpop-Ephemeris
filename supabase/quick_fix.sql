-- SOLUCIÓN SEGURA: Configurar RLS con políticas adecuadas
-- ✅ SEGURO PARA DESARROLLO Y PRODUCCIÓN

-- 1. Habilitar RLS (Row Level Security)
ALTER TABLE "Kpop_Ephemerides" ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "public_read" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "public_insert" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "public_update" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "public_delete" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "allow_all" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "Allow anonymous select" ON "Kpop_Ephemerides";
DROP POLICY IF EXISTS "Allow anonymous insert" ON "Kpop_Ephemerides";

-- 3. Crear políticas seguras para lectura pública
CREATE POLICY "enable_read_access_for_all_users" ON "Kpop_Ephemerides"
FOR SELECT
TO public
USING (true);

-- 4. Crear políticas para inserción pública (solo para esta tabla de datos históricos)
CREATE POLICY "enable_insert_access_for_all_users" ON "Kpop_Ephemerides"
FOR INSERT
TO public
WITH CHECK (true);

-- 5. Opcional: Permitir actualizaciones (descomenta si necesitas)
-- CREATE POLICY "enable_update_access_for_all_users" ON "Kpop_Ephemerides"
-- FOR UPDATE
-- TO public
-- USING (true)
-- WITH CHECK (true);

-- 6. Opcional: Permitir eliminaciones (descomenta si necesitas)
-- CREATE POLICY "enable_delete_access_for_all_users" ON "Kpop_Ephemerides"
-- FOR DELETE
-- TO public
-- USING (true);

-- 7. Insertar datos de prueba
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) 
VALUES 
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025),
(13, 6, 2013, 1, '2013-06-13', 13, 6, 2013),
(8, 8, 2016, 1, '2016-08-08', 8, 8, 2016),
(1, 1, 2012, 1, '2012-01-01', 1, 1, 2012),
(19, 8, 2006, 5, '2006-08-19', 19, 8, 2006),
(9, 3, 2016, 1, '2016-03-09', 9, 3, 2016), -- TWICE debut
(1, 11, 2020, 1, '2020-11-01', 1, 11, 2020); -- aespa debut

-- 8. Verificar que las políticas están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'Kpop_Ephemerides';

-- 9. Verificar datos insertados
SELECT COUNT(*) as total FROM "Kpop_Ephemerides";
SELECT * FROM "Kpop_Ephemerides" WHERE day = 22 AND month = 7;

-- 10. Verificar estado de RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'Kpop_Ephemerides';
