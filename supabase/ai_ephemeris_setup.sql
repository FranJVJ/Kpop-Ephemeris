-- Actualización de la tabla ephemerides para soportar generación automática con IA
-- Ejecutar este script en Supabase SQL Editor

-- Agregar nuevas columnas para efemérides generadas con IA
ALTER TABLE ephemerides 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('alta', 'media', 'baja')),
ADD COLUMN IF NOT EXISTS sources TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS group_name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ephemerides_date ON ephemerides(day, month);
CREATE INDEX IF NOT EXISTS idx_ephemerides_ai_generated ON ephemerides(ai_generated);
CREATE INDEX IF NOT EXISTS idx_ephemerides_created_at ON ephemerides(created_at);

-- Función para verificar duplicados por fecha
CREATE OR REPLACE FUNCTION check_ephemeris_date_unique()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe una efeméride para el mismo día y mes
  IF EXISTS (
    SELECT 1 FROM ephemerides 
    WHERE day = NEW.day 
    AND month = NEW.month 
    AND id != COALESCE(NEW.id, 0)
  ) THEN
    RAISE EXCEPTION 'Ya existe una efeméride para el día % del mes %', NEW.day, NEW.month;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validar fechas únicas
DROP TRIGGER IF EXISTS trigger_check_ephemeris_date_unique ON ephemerides;
CREATE TRIGGER trigger_check_ephemeris_date_unique
  BEFORE INSERT OR UPDATE ON ephemerides
  FOR EACH ROW
  EXECUTE FUNCTION check_ephemeris_date_unique();

-- Función para obtener efemérides por fecha
CREATE OR REPLACE FUNCTION get_ephemeris_by_date(target_day INTEGER, target_month INTEGER)
RETURNS TABLE(
  id BIGINT,
  day INTEGER,
  month INTEGER,
  historical_year INTEGER,
  event INTEGER,
  title TEXT,
  description TEXT,
  group_name TEXT,
  ai_generated BOOLEAN,
  confidence_level TEXT,
  sources TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.day,
    e.month,
    e.historical_year,
    e.event,
    e.title,
    e.description,
    e.group_name,
    e.ai_generated,
    e.confidence_level,
    e.sources,
    e.created_at
  FROM ephemerides e
  WHERE e.day = target_day AND e.month = target_month;
END;
$$ LANGUAGE plpgsql;

-- Política RLS para permitir inserción de efemérides automáticas
CREATE POLICY "Allow AI ephemeris insertion" ON ephemerides
  FOR INSERT WITH CHECK (ai_generated = TRUE);

-- Comentarios en la tabla para documentación
COMMENT ON TABLE ephemerides IS 'Tabla de efemérides del Kpop con soporte para generación automática con IA';
COMMENT ON COLUMN ephemerides.ai_generated IS 'Indica si la efeméride fue generada automáticamente con IA';
COMMENT ON COLUMN ephemerides.confidence_level IS 'Nivel de confianza de la información (alta, media, baja)';
COMMENT ON COLUMN ephemerides.sources IS 'Fuentes o referencias del evento histórico';
COMMENT ON COLUMN ephemerides.title IS 'Título descriptivo del evento';
COMMENT ON COLUMN ephemerides.description IS 'Descripción detallada del evento';
COMMENT ON COLUMN ephemerides.group_name IS 'Nombre del grupo o artista involucrado';

-- Verificar la estructura actualizada
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'ephemerides' 
ORDER BY ordinal_position;
