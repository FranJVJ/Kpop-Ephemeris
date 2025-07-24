-- Actualizar la tabla Kpop_Ephemerides para soportar datos completos de IA
-- Este script agrega las columnas necesarias para almacenar datos generados por IA

-- Agregar nuevas columnas si no existen
ALTER TABLE "Kpop_Ephemerides" 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS group_name TEXT,
ADD COLUMN IF NOT EXISTS artist TEXT,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confidence_level TEXT CHECK (confidence_level IN ('alta', 'media', 'baja')),
ADD COLUMN IF NOT EXISTS sources TEXT,
ADD COLUMN IF NOT EXISTS translations JSONB,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_kpop_ephemerides_date ON "Kpop_Ephemerides"(day, month);
CREATE INDEX IF NOT EXISTS idx_kpop_ephemerides_ai_generated ON "Kpop_Ephemerides"(ai_generated);
CREATE INDEX IF NOT EXISTS idx_kpop_ephemerides_category ON "Kpop_Ephemerides"(category);

-- Función para verificar duplicados por fecha
CREATE OR REPLACE FUNCTION check_kpop_ephemeris_date_unique()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe una efeméride para el mismo día y mes
  IF EXISTS (
    SELECT 1 FROM "Kpop_Ephemerides" 
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
DROP TRIGGER IF EXISTS trigger_check_kpop_ephemeris_date_unique ON "Kpop_Ephemerides";
CREATE TRIGGER trigger_check_kpop_ephemeris_date_unique
  BEFORE INSERT OR UPDATE ON "Kpop_Ephemerides"
  FOR EACH ROW
  EXECUTE FUNCTION check_kpop_ephemeris_date_unique();

-- Actualizar trigger para timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_kpop_ephemerides_updated_at ON "Kpop_Ephemerides";
CREATE TRIGGER update_kpop_ephemerides_updated_at 
    BEFORE UPDATE ON "Kpop_Ephemerides" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la estructura
COMMENT ON COLUMN "Kpop_Ephemerides".title IS 'Título de la efeméride generado por IA o manual';
COMMENT ON COLUMN "Kpop_Ephemerides".description IS 'Descripción detallada de la efeméride';
COMMENT ON COLUMN "Kpop_Ephemerides".category IS 'Categoría: Debut, Logro, Récord, Premio, Especial';
COMMENT ON COLUMN "Kpop_Ephemerides".group_name IS 'Nombre del grupo o artista';
COMMENT ON COLUMN "Kpop_Ephemerides".ai_generated IS 'TRUE si fue generado por IA, FALSE si es manual';
COMMENT ON COLUMN "Kpop_Ephemerides".confidence_level IS 'Nivel de confianza: alta, media, baja';
COMMENT ON COLUMN "Kpop_Ephemerides".sources IS 'Fuentes de información utilizadas';

-- Ejemplo de inserción con nuevos campos (comentado para referencia)
/*
INSERT INTO "Kpop_Ephemerides" (
    day, month, year, historical_year, event,
    title, description, category, group_name, 
    ai_generated, confidence_level, sources
) VALUES (
    23, 7, 2025, 2007, 1,
    'Aniversario del debut de Girls'' Generation',
    'En 2007, Girls'' Generation (SNSD) debutó con "Into the New World", marcando el inicio de una era dorada del K-pop femenino.',
    'Debut',
    'Girls'' Generation (SNSD)',
    true,
    'alta',
    'Wikipedia, Soompi, AllKPop'
);
*/
