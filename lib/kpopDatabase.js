/**
 * Base de datos simplificada de efemérides del K-pop
 * Eventos históricos para usar en la aplicación
 */

export const kpopEphemerides = {
  // JULIO
  '24-7': {
    title: "Debut de CLC",
    description: "En 2015, CLC debutó con 'Pepe' bajo Cube Entertainment, mostrando un concepto fresco y juvenil.",
    year: "2015",
    category: 'Debut',
    group: "CLC"
  },
  '25-7': {
    title: "Lanzamiento de 'The Most Beautiful Moment in Life, Pt.1' de BTS",
    description: "En 2015, BTS lanzó este álbum icónico que incluía 'I NEED U', marcando su evolución artística.",
    year: "2015",
    category: 'Logro',
    group: "BTS"
  },
  '26-7': {
    title: "Debut de ITZY",
    description: "En 2019, ITZY debutó con 'DALLA DALLA' bajo JYP Entertainment, revolucionando el teen crush concept.",
    year: "2019",
    category: 'Debut',
    group: "ITZY"
  },
  '27-7': {
    title: "Primer concierto de BTS en Estados Unidos",
    description: "En 2014, BTS realizó su primera presentación en Estados Unidos como parte de KCON LA.",
    year: "2014",
    category: 'Logro',
    group: "BTS"
  },
  '28-7': {
    title: "Lanzamiento de 'Lion Heart' de Girls' Generation",
    description: "En 2015, SNSD lanzó 'Lion Heart', demostrando su versatilidad con un concepto retro elegante.",
    year: "2015",
    category: 'Logro',
    group: "Girls' Generation"
  },
  '29-7': {
    title: "Debut de WJSN (Cosmic Girls)",
    description: "En 2016, WJSN debutó con 'Mo Mo Mo' bajo Starship Entertainment, con su concepto cósmico único.",
    year: "2016",
    category: 'Debut',
    group: "WJSN"
  },
  '30-7': {
    title: "Primer #1 de MAMAMOO en música shows",
    description: "En 2016, MAMAMOO consiguió su primera victoria en un music show con 'You're the Best'.",
    year: "2016",
    category: 'Logro',
    group: "MAMAMOO"
  },
  '31-7': {
    title: "Lanzamiento de 'Pink Tape' de f(x)",
    description: "En 2013, f(x) lanzó 'Pink Tape', aclamado por su innovación artística y experimentación musical.",
    year: "2013",
    category: 'Logro',
    group: "f(x)"
  },
  // AGOSTO
  '1-8': {
    title: "Debut de Oh My Girl",
    description: "En 2015, Oh My Girl debutó con 'Cupid' bajo WM Entertainment, con su concepto de cuento de hadas.",
    year: "2015",
    category: 'Debut',
    group: "Oh My Girl"
  },
  '2-8': {
    title: "Lanzamiento de 'The Red' de Red Velvet",
    description: "En 2015, Red Velvet lanzó su primer álbum completo 'The Red', estableciendo su dual concept.",
    year: "2015",
    category: 'Logro',
    group: "Red Velvet"
  },
  '3-8': {
    title: "BIGBANG alcanza #1 mundial con 'BANG BANG BANG'",
    description: "En 2015, BIGBANG dominó charts internacionales con 'BANG BANG BANG', consolidando su estatus global.",
    year: "2015",
    category: 'Récord',
    group: "BIGBANG"
  },
  '4-8': {
    title: "Debut de GFRIEND",
    description: "En 2015, GFRIEND debutó con 'Glass Bead' bajo Source Music, reviviendo el concepto escolar puro.",
    year: "2015",
    category: 'Debut',
    group: "GFRIEND"
  },
  '5-8': {
    title: "Debut oficial de Girls' Generation",
    description: "En 2007, Girls' Generation debutó oficialmente con 'Into the New World' en Inkigayo.",
    year: "2007",
    category: 'Debut',
    group: "Girls' Generation"
  },
  '8-8': {
    title: "Debut de BLACKPINK",
    description: "En 2016, BLACKPINK debutó con 'Square One' bajo YG Entertainment, redefiniendo el girl crush concept.",
    year: "2016",
    category: 'Debut',
    group: "BLACKPINK"
  },
  // Agregar más fechas según sea necesario
  '1-1': {
    title: "Año Nuevo K-pop",
    description: "Inicio de un nuevo año lleno de música K-pop emocionante y debuts esperados.",
    year: "2024",
    category: 'Especial',
    group: "K-pop Industry"
  }
}

/**
 * Obtiene una efeméride para una fecha específica
 */
export function getEphemerisForDate(day, month) {
  const dateKey = `${day}-${month}`
  return kpopEphemerides[dateKey] || null
}

/**
 * Obtiene todas las efemérides disponibles
 */
export function getAllEphemerides() {
  return kpopEphemerides
}
