-- Script para verificar la tabla y sus permisos en Supabase

-- 1. Verificar que la tabla existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name ILIKE '%ephemer%' OR table_name ILIKE '%kpop%';

-- 2. Verificar la estructura exacta de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Kpop_Ephemerides'
ORDER BY ordinal_position;

-- 3. Verificar si hay datos en la tabla
SELECT COUNT(*) as total_records FROM "Kpop_Ephemerides";

-- 4. Verificar las políticas RLS (Row Level Security)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'Kpop_Ephemerides';

-- 5. Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'Kpop_Ephemerides';

-- 6. Intentar hacer un SELECT simple
SELECT * FROM "Kpop_Ephemerides" LIMIT 5;

-- 7. Si la tabla no existe, crearla
CREATE TABLE IF NOT EXISTS "Kpop_Ephemerides" (
    id SERIAL PRIMARY KEY,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    event INTEGER NOT NULL,
    display_date DATE,
    historical_day INTEGER,
    historical_month INTEGER,
    historical_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Habilitar acceso público para testing (CUIDADO: Solo para desarrollo)
ALTER TABLE "Kpop_Ephemerides" ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT a usuarios anónimos
CREATE POLICY "Allow anonymous select" ON "Kpop_Ephemerides"
FOR SELECT 
TO anon
USING (true);

-- Política para permitir INSERT a usuarios anónimos  
CREATE POLICY "Allow anonymous insert" ON "Kpop_Ephemerides"
FOR INSERT 
TO anon
WITH CHECK (true);
