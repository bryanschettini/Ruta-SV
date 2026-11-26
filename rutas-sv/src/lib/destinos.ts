import type { Categoria, Destino } from "./types";

/**
 * Catálogo de destinos. Funciona como una pequeña "base de datos" local
 * que se expone mediante los Route Handlers de /api/destinos.
 * Los gastos son estimaciones referenciales por persona y día.
 */
export const DESTINOS: Destino[] = [
  {
    slug: "el-tunco",
    nombre: "Playa El Tunco",
    departamento: "La Libertad",
    categoria: "playa",
    resumen: "Surf, atardeceres frente a la roca y vida nocturna en la Costa del Bálsamo.",
    descripcion:
      "El Tunco es uno de los puntos de surf más conocidos de Centroamérica. Su nombre viene de la gran roca frente a la playa, que recuerda a un cerdo (\"tunco\"). Tiene escuelas de surf para principiantes, hostales y restaurantes a pocos pasos del mar.",
    actividades: ["Clases de surf", "Atardecer en la roca", "Vida nocturna", "Mariscos frescos"],
    mejorEpoca: "Noviembre a abril (temporada seca); olas grandes de marzo a octubre",
    diasSugeridos: 2,
    presupuesto: 2,
    gastoDiarioUSD: 55,
    lat: 13.4929,
    lon: -89.3826,
    emoji: "🏄",
    destacado: true,
  },
  {
    slug: "el-zonte",
    nombre: "Playa El Zonte",
    departamento: "La Libertad",
    categoria: "playa",
    resumen: "Playa tranquila de arena oscura, ideal para surf y descanso.",
    descripcion:
      "Más relajada que El Tunco, El Zonte combina olas constantes con un ambiente de pueblo costero. Es conocida internacionalmente como \"Bitcoin Beach\" por su proyecto comunitario de pagos con criptomonedas.",
    actividades: ["Surf", "Yoga frente al mar", "Caminatas en la playa", "Pozas en marea baja"],
    mejorEpoca: "Noviembre a abril",
    diasSugeridos: 2,
    presupuesto: 2,
    gastoDiarioUSD: 50,
    lat: 13.495,
    lon: -89.438,
    emoji: "🌊",
  },
  {
    slug: "playa-las-flores",
    nombre: "Playa Las Flores",
    departamento: "San Miguel",
    categoria: "playa",
    resumen: "Point break del oriente, con playas casi vírgenes alrededor.",
    descripcion:
      "En la zona oriental del país, Las Flores ofrece una ola de derecha larga y un ambiente mucho menos concurrido que la costa de La Libertad. Es una buena base para explorar playas cercanas como El Cuco.",
    actividades: ["Surf de point break", "Playas solitarias", "Pesca artesanal"],
    mejorEpoca: "Marzo a octubre para surf; noviembre a abril para clima seco",
    diasSugeridos: 2,
    presupuesto: 2,
    gastoDiarioUSD: 60,
    lat: 13.172,
    lon: -88.096,
    emoji: "🐚",
  },
  {
    slug: "volcan-santa-ana",
    nombre: "Volcán de Santa Ana (Ilamatepec)",
    departamento: "Santa Ana",
    categoria: "volcanes",
    resumen: "El volcán más alto del país, con una laguna de color turquesa en el cráter.",
    descripcion:
      "Con unos 2,381 metros sobre el nivel del mar, el Ilamatepec es el volcán más alto de El Salvador. La caminata guiada sale desde el Parque Nacional Cerro Verde y en la cima se observa la laguna cratérica y, en días despejados, el Lago de Coatepeque.",
    actividades: ["Senderismo guiado", "Vista al cráter", "Fotografía de paisaje"],
    mejorEpoca: "Noviembre a abril (cielos más despejados)",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 35,
    lat: 13.853,
    lon: -89.63,
    emoji: "🌋",
    destacado: true,
  },
  {
    slug: "el-boqueron",
    nombre: "Parque Nacional El Boquerón",
    departamento: "La Libertad",
    categoria: "volcanes",
    resumen: "El cráter del volcán de San Salvador, a menos de una hora de la capital.",
    descripcion:
      "En la cima del volcán de San Salvador se encuentra un cráter de unos 5 km de circunferencia y 500 metros de profundidad. El clima fresco, los miradores y los cafés de los alrededores lo hacen una excursión perfecta de medio día.",
    actividades: ["Miradores al cráter", "Senderos cortos", "Cafés de montaña"],
    mejorEpoca: "Todo el año; mañanas más despejadas",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 25,
    lat: 13.735,
    lon: -89.287,
    emoji: "⛰️",
  },
  {
    slug: "lago-coatepeque",
    nombre: "Lago de Coatepeque",
    departamento: "Santa Ana",
    categoria: "naturaleza",
    resumen: "Un lago volcánico azul intenso rodeado de montañas.",
    descripcion:
      "El Lago de Coatepeque ocupa la caldera de un antiguo volcán. Su color cambia entre azul profundo y turquesa según la época. Hay muelles, restaurantes y hoteles en la orilla, y paseos en lancha hacia el islote Teopán.",
    actividades: ["Paseo en lancha", "Kayak", "Restaurantes con muelle", "Miradores"],
    mejorEpoca: "Todo el año",
    diasSugeridos: 1,
    presupuesto: 2,
    gastoDiarioUSD: 45,
    lat: 13.867,
    lon: -89.544,
    emoji: "🛶",
    destacado: true,
  },
  {
    slug: "el-imposible",
    nombre: "Parque Nacional El Imposible",
    departamento: "Ahuachapán",
    categoria: "naturaleza",
    resumen: "Bosque tropical con ríos, cascadas y gran biodiversidad.",
    descripcion:
      "Es una de las áreas naturales protegidas más importantes del país. Sus senderos atraviesan bosque húmedo con ríos, pozas y cascadas, y es hogar de cientos de especies de aves y mamíferos.",
    actividades: ["Senderismo", "Cascadas y pozas", "Observación de aves"],
    mejorEpoca: "Noviembre a abril (senderos menos lodosos)",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 30,
    lat: 13.83,
    lon: -89.95,
    emoji: "🌿",
  },
  {
    slug: "montecristo",
    nombre: "Bosque Montecristo",
    departamento: "Santa Ana",
    categoria: "naturaleza",
    resumen: "Bosque nuboso donde se unen El Salvador, Guatemala y Honduras.",
    descripcion:
      "En el macizo de Montecristo, cerca de Metapán, se encuentra el punto Trifinio, donde se tocan las fronteras de tres países. Su bosque nuboso tiene robles, pinos, orquídeas y helechos gigantes.",
    actividades: ["Bosque nuboso", "Cumbre Trifinio", "Acampar"],
    mejorEpoca: "Noviembre a abril (consulta cierres por época reproductiva de la fauna)",
    diasSugeridos: 2,
    presupuesto: 1,
    gastoDiarioUSD: 30,
    lat: 14.4,
    lon: -89.36,
    emoji: "🌲",
  },
  {
    slug: "juayua",
    nombre: "Juayúa",
    departamento: "Sonsonate",
    categoria: "pueblos",
    resumen: "Corazón de la Ruta de las Flores y su famosa feria gastronómica.",
    descripcion:
      "Juayúa es famoso por su feria gastronómica de fin de semana, su iglesia del Cristo Negro y las cercanas Chorreras del Guayabo y los Siete Altares. Es parada obligada de la Ruta de las Flores.",
    actividades: ["Feria gastronómica", "Ruta de las Siete Cascadas", "Cafetales"],
    mejorEpoca: "Fines de semana, todo el año",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 35,
    lat: 13.8414,
    lon: -89.7456,
    emoji: "🌸",
    destacado: true,
  },
  {
    slug: "ataco",
    nombre: "Concepción de Ataco",
    departamento: "Ahuachapán",
    categoria: "pueblos",
    resumen: "Calles empedradas, murales coloridos y café de altura.",
    descripcion:
      "Ataco es uno de los pueblos más fotogénicos de la Ruta de las Flores: casas pintadas con murales, talleres de textiles y fincas cafetaleras con tours de catación.",
    actividades: ["Murales y fotografía", "Tour de café", "Artesanías textiles"],
    mejorEpoca: "Todo el año; noviembre a febrero, temporada de cosecha de café",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 35,
    lat: 13.8703,
    lon: -89.8478,
    emoji: "🎨",
  },
  {
    slug: "suchitoto",
    nombre: "Suchitoto",
    departamento: "Cuscatlán",
    categoria: "pueblos",
    resumen: "Ciudad colonial frente al lago Suchitlán, capital cultural del país.",
    descripcion:
      "Suchitoto conserva su arquitectura colonial, con la iglesia de Santa Lucía como emblema. Tiene galerías, talleres de añil, festivales culturales y vistas al embalse Suchitlán, donde se puede pasear en lancha.",
    actividades: ["Talleres de añil", "Paseo en lancha", "Cascada Los Tercios", "Galerías de arte"],
    mejorEpoca: "Todo el año",
    diasSugeridos: 2,
    presupuesto: 2,
    gastoDiarioUSD: 45,
    lat: 13.9381,
    lon: -89.0278,
    emoji: "⛪",
    destacado: true,
  },
  {
    slug: "perquin",
    nombre: "Perquín y Ruta de Paz",
    departamento: "Morazán",
    categoria: "pueblos",
    resumen: "Montañas del norte de Morazán, memoria histórica y pinares.",
    descripcion:
      "Perquín fue un lugar clave durante el conflicto armado y hoy alberga el Museo de la Revolución Salvadoreña. La Ruta de Paz combina historia con pinares, ríos y clima fresco.",
    actividades: ["Museo de la Revolución", "Río Sapo", "Senderos entre pinos"],
    mejorEpoca: "Noviembre a abril",
    diasSugeridos: 2,
    presupuesto: 1,
    gastoDiarioUSD: 30,
    lat: 13.958,
    lon: -88.16,
    emoji: "🕊️",
  },
  {
    slug: "centro-historico-san-salvador",
    nombre: "Centro Histórico de San Salvador",
    departamento: "San Salvador",
    categoria: "pueblos",
    resumen: "Catedral, Palacio Nacional y Teatro Nacional en plazas renovadas.",
    descripcion:
      "El centro de la capital reúne la Catedral Metropolitana, el Palacio Nacional, el Teatro Nacional y la Biblioteca Nacional. Sus plazas peatonales se recorren fácilmente a pie, con pupuserías y cafés alrededor.",
    actividades: ["Recorrido a pie", "Palacio Nacional", "Pupusas en el centro"],
    mejorEpoca: "Todo el año",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 30,
    lat: 13.6989,
    lon: -89.1914,
    emoji: "🏛️",
  },
  {
    slug: "joya-de-ceren",
    nombre: "Joya de Cerén",
    departamento: "La Libertad",
    categoria: "arqueologia",
    resumen: "Aldea maya preservada por cenizas volcánicas, Patrimonio de la Humanidad.",
    descripcion:
      "Llamada la \"Pompeya de América\", Joya de Cerén es una aldea prehispánica sepultada por una erupción alrededor del año 600 d.C. Fue declarada Patrimonio de la Humanidad por la UNESCO en 1993 y muestra cómo vivían las familias agricultoras mayas.",
    actividades: ["Recorrido arqueológico", "Museo de sitio"],
    mejorEpoca: "Todo el año",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 20,
    lat: 13.827,
    lon: -89.367,
    emoji: "🏺",
  },
  {
    slug: "tazumal",
    nombre: "Sitio Arqueológico Tazumal",
    departamento: "Santa Ana",
    categoria: "arqueologia",
    resumen: "El conjunto de pirámides mayas más conocido del país, en Chalchuapa.",
    descripcion:
      "Tazumal es uno de los sitios mayas más importantes de El Salvador, con estructuras piramidales y un museo con piezas encontradas en la zona. Se combina fácilmente con el cercano sitio Casa Blanca.",
    actividades: ["Pirámides mayas", "Museo Stanley Boggs", "Sitio Casa Blanca"],
    mejorEpoca: "Todo el año",
    diasSugeridos: 1,
    presupuesto: 1,
    gastoDiarioUSD: 20,
    lat: 13.979,
    lon: -89.674,
    emoji: "🗿",
  },
];

export const CATEGORIAS: Record<Categoria, { nombre: string; emoji: string; color: string }> = {
  playa: { nombre: "Playas", emoji: "🏖️", color: "from-sky-400 to-ocean-500" },
  volcanes: { nombre: "Volcanes", emoji: "🌋", color: "from-sunset-500 to-rose-600" },
  pueblos: { nombre: "Pueblos y cultura", emoji: "🏘️", color: "from-amber-400 to-sunset-500" },
  arqueologia: { nombre: "Arqueología", emoji: "🏺", color: "from-stone-400 to-amber-700" },
  naturaleza: { nombre: "Naturaleza", emoji: "🌿", color: "from-emerald-400 to-ocean-600" },
};

export function esCategoria(valor: string | null): valor is Categoria {
  return valor !== null && valor in CATEGORIAS;
}

export interface FiltrosDestino {
  q?: string | null;
  categoria?: string | null;
  departamento?: string | null;
}

/** Normaliza texto para búsquedas sin tildes ni mayúsculas */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function filtrarDestinos(filtros: FiltrosDestino = {}): Destino[] {
  const q = filtros.q ? normalizar(filtros.q) : "";
  return DESTINOS.filter((d) => {
    if (esCategoria(filtros.categoria ?? null) && d.categoria !== filtros.categoria) return false;
    if (filtros.departamento && normalizar(d.departamento) !== normalizar(filtros.departamento)) return false;
    if (q) {
      const texto = normalizar(`${d.nombre} ${d.departamento} ${d.resumen} ${d.actividades.join(" ")}`);
      if (!texto.includes(q)) return false;
    }
    return true;
  });
}

export function obtenerDestino(slug: string): Destino | undefined {
  return DESTINOS.find((d) => d.slug === slug);
}

export function obtenerDepartamentos(): string[] {
  return [...new Set(DESTINOS.map((d) => d.departamento))].sort((a, b) => a.localeCompare(b, "es"));
}

export function destinosRelacionados(destino: Destino, limite = 3): Destino[] {
  return DESTINOS.filter(
    (d) => d.slug !== destino.slug && (d.categoria === destino.categoria || d.departamento === destino.departamento),
  ).slice(0, limite);
}
