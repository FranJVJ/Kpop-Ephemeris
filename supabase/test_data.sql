-- Datos de prueba para la tabla Kpop_Ephemerides
-- Ejecuta este script en el SQL Editor de Supabase

-- Limpiar datos existentes (opcional, descomenta si quieres empezar limpio)
-- DELETE FROM "Kpop_Ephemerides";

-- Insertar datos de prueba para diferentes fechas del año
INSERT INTO "Kpop_Ephemerides" (day, month, year, event, display_date, historical_day, historical_month, historical_year) VALUES
-- Enero
(1, 1, 2012, 1, '2012-01-01', 1, 1, 2012),   -- Debut de EXO
(15, 1, 2019, 2, '2019-01-15', 15, 1, 2019), -- Logro de BTS
(20, 1, 2018, 3, '2018-01-20', 20, 1, 2018), -- Récord de BLACKPINK

-- Febrero  
(14, 2, 2020, 4, '2020-02-14', 14, 2, 2020), -- Premio de TWICE
(28, 2, 2021, 5, '2021-02-28', 28, 2, 2021), -- Evento especial de aespa

-- Marzo
(9, 3, 2016, 1, '2016-03-09', 9, 3, 2016),   -- Debut de TWICE
(23, 3, 2017, 2, '2017-03-23', 23, 3, 2017), -- Logro de Red Velvet

-- Abril
(8, 4, 2018, 3, '2018-04-08', 8, 4, 2018),   -- Récord de BTS
(25, 4, 2019, 4, '2019-04-25', 25, 4, 2019), -- Premio de ITZY

-- Mayo
(11, 5, 2020, 5, '2020-05-11', 11, 5, 2020), -- Evento especial
(30, 5, 2015, 1, '2015-05-30', 30, 5, 2015), -- Debut de SEVENTEEN

-- Junio
(13, 6, 2013, 1, '2013-06-13', 13, 6, 2013), -- Debut de BTS
(26, 6, 2022, 2, '2022-06-26', 26, 6, 2022), -- Logro de NewJeans

-- Julio - ¡Fecha de hoy!
(22, 7, 2025, 5, '2025-07-22', 22, 7, 2025), -- Evento especial de hoy
(31, 7, 2016, 3, '2016-07-31', 31, 7, 2016), -- Récord de MAMAMOO

-- Agosto
(8, 8, 2016, 1, '2016-08-08', 8, 8, 2016),   -- Debut de BLACKPINK
(18, 8, 2021, 4, '2021-08-18', 18, 8, 2021), -- Premio de (G)I-DLE

-- Septiembre
(1, 9, 2018, 2, '2018-09-01', 1, 9, 2018),   -- Logro de MOMOLAND
(22, 9, 2020, 3, '2020-09-22', 22, 9, 2020), -- Récord de EVERGLOW

-- Octubre
(19, 10, 2015, 1, '2015-10-19', 19, 10, 2015), -- Debut de GFRIEND
(31, 10, 2022, 5, '2022-10-31', 31, 10, 2022), -- Evento especial de Halloween

-- Noviembre
(1, 11, 2020, 1, '2020-11-01', 1, 11, 2020),  -- Debut de aespa
(21, 11, 2017, 4, '2017-11-21', 21, 11, 2017), -- Premio de Red Velvet

-- Diciembre
(25, 12, 2021, 5, '2021-12-25', 25, 12, 2021), -- Evento especial de Navidad
(31, 12, 2023, 2, '2023-12-31', 31, 12, 2023); -- Logro de fin de año

-- Verificar que los datos se insertaron correctamente
SELECT COUNT(*) as total_records FROM "Kpop_Ephemerides";

-- Ver algunos ejemplos
SELECT * FROM "Kpop_Ephemerides" ORDER BY month, day LIMIT 10;
