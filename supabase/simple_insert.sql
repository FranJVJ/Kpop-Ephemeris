-- Script simple para añadir datos de prueba
-- Basado en el nombre exacto de tu tabla: Kpop_Ephemerides

-- Primero, verificar si ya hay datos para hoy
SELECT * FROM "Kpop_Ephemerides" WHERE day = 22 AND month = 7;

-- Insertar evento para HOY (22 de julio de 2025)
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) 
VALUES (22, 7, 2025, 5, '2025-07-22', 22, 7, 2025);

-- Insertar algunos eventos más para probar
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) 
VALUES 
(13, 6, 2013, 1, '2013-06-13', 13, 6, 2013), -- Debut de BTS
(8, 8, 2016, 1, '2016-08-08', 8, 8, 2016),   -- Debut de BLACKPINK
(1, 1, 2012, 1, '2012-01-01', 1, 1, 2012);   -- Debut de EXO

-- Verificar que se insertaron
SELECT COUNT(*) as total FROM "Kpop_Ephemerides";

-- Ver los datos de hoy
SELECT * FROM "Kpop_Ephemerides" WHERE day = 22 AND month = 7;
