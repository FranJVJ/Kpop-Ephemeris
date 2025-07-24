-- Crear tabla de efemérides
CREATE TABLE IF NOT EXISTS ephemerides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date_key VARCHAR(5) NOT NULL, -- Formato: MM-DD
    date_display VARCHAR(20) NOT NULL, -- Ejemplo: "1 de Enero"
    year VARCHAR(4) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Debut, Logro, Récord, Premio, Especial
    group_name VARCHAR(100) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_ephemerides_date_key ON ephemerides(date_key);
CREATE INDEX IF NOT EXISTS idx_ephemerides_category ON ephemerides(category);
CREATE INDEX IF NOT EXISTS idx_ephemerides_group ON ephemerides(group_name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios (incluso no autenticados)
CREATE POLICY "Allow read access to all users" ON ephemerides
    FOR SELECT USING (true);

-- Política para permitir escritura solo a usuarios autenticados
CREATE POLICY "Allow insert for authenticated users only" ON ephemerides
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users only" ON ephemerides
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users only" ON ephemerides
    FOR DELETE USING (auth.role() = 'authenticated');

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_ephemerides_updated_at 
    BEFORE UPDATE ON ephemerides 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO ephemerides (date_key, date_display, year, title, description, category, group_name) VALUES
('01-01', '1 de Enero', '2012', 'Debut de EXO', 'SM Entertainment presenta oficialmente a EXO, uno de los grupos más influyentes del Kpop, que revolucionaría la industria con su concepto único y talento excepcional.', 'Debut', 'EXO'),
('01-02', '2 de Enero', '2019', 'BTS en el Tonight Show', 'BTS hace historia al convertirse en el primer grupo de Kpop en aparecer como invitados musicales en The Tonight Show Starring Jimmy Fallon.', 'Logro', 'BTS'),
('01-03', '3 de Enero', '2018', 'BLACKPINK rompe récords', 'BLACKPINK se convierte en el grupo femenino de Kpop con más suscriptores en YouTube, marcando un hito en la expansión global del Kpop.', 'Récord', 'BLACKPINK'),
('01-04', '4 de Enero', '2020', 'Debut de aespa', 'SM Entertainment debuta a aespa con "Black Mamba", introduciendo el concepto revolucionario del metaverso en el Kpop.', 'Debut', 'aespa'),
('01-05', '5 de Enero', '2016', 'TWICE gana su primer premio', 'TWICE obtiene su primera victoria en un programa musical con "OOH-AHH", marcando el inicio de su dominio en la industria.', 'Premio', 'TWICE');
