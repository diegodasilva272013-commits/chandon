// TODO el contenido del sitio. Los componentes solo leen estos datos.
// Fuentes: chandon.com/es-ar, LVMH, prensa (ver brief de Arete Soluciones).

export type CollectionId = "signature" | "free-spirits" | "roots";
export type Sweetness = "seco" | "dulce" | "aperitivo";

export interface Product {
  slug: string;
  name: string;
  short: string; // nombre grande detras de la botella
  collection: CollectionId;
  tagline: string;
  blend: { variety: string; pct: number | null }[];
  blendNote?: string;
  origin: string;
  vineyards: string[]; // ids de viñedos
  altitude: string;
  aromas: string;
  occasion: string;
  pairing?: string;
  serviceLabel: string;
  ice: boolean;
  sweetness: Sweetness;
  rose: boolean;
  aging: string;
  accent: string; // brillo de fondo (decorativo, tomado del color de la etiqueta)
  bottle: string;
  photo: string;
}

const m = (folder: string, file: string) => `/media/${folder}/${file}.webp`;
const AGING = "6 a 8 meses sobre levaduras y 3 meses en botella";

export const brand = {
  name: "Chandon",
  legalName: "Bodega Chandon",
  group: "Moët Hennessy (LVMH)",
  tagline: "Espumantes de altura",
  logo: "/brand/chandon-wordmark.svg",
  address: {
    winery: "Ruta 15 Km 29, Agrelo, Luján de Cuyo, Mendoza",
    wineryMaps: "https://maps.app.goo.gl/HDTmyDEDe6ths12t5",
    office: "Av. Ortiz de Ocampo 2839, C1425DSD, CABA",
    officeMaps: "https://maps.app.goo.gl/RXsVN5sCCaAfnhaz9",
    distance: "Unos 30 km al sur de la ciudad de Mendoza, a 40 minutos en auto.",
  },
  phone: "(+54 11) 4121 8001",
  consumerLine: "0800-999-2426",
  email: "info@chandon.com.ar",
  visits: {
    email: "centrodevisitas@chandon.com.ar",
    whatsapp: "https://wa.me/2614859656",
    whatsappLabel: "+54 9 261 485-9656",
  },
  instagram: "https://www.instagram.com/chandonbodegas",
  legal: "Beber con moderación. Prohibida su venta a menores de 18 años.",
  copyright: "Chandon Argentina. Todos los derechos reservados.",
} as const;

// Textos de interfaz (accesibilidad, etiquetas de pie de pagina, descripciones de imagen).
export const ui = {
  newTab: "se abre en una pestaña nueva",
  viewMap: "Ver mapa",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  footer: { winery: "Bodega", office: "Oficina", contact: "Contacto", site: "Sitio" },
  nav: { home: "Chandon, inicio", main: "Principal", mobile: "Menú móvil", open: "Abrir menú", close: "Cerrar menú" },
  filters: "Filtros",
  chefList: "Chefs de Cave",
  timeline: "Línea de tiempo",
  varieties: "Variedades",
  vineyardPrefix: "Viñedo",
  viaWhatsapp: "por WhatsApp",
  alt: {
    hero: "Brindis con Chandon bajo el cielo de Mendoza",
    origin: "Edificio de la bodega y sus jardines en Agrelo",
    bodega: "Trabajadores de Chandon en el viñedo",
    cava: "Cava de ladrillo con botellas",
    historia: "Primeros años de la bodega en Agrelo",
    panorama: "Vista aérea de los viñedos con la cordillera al fondo",
    chefSuffix: "Chef de Cave de Chandon Argentina",
  },
} as const;

export const nav = [
  { label: "Espumantes", href: "/espumantes" },
  { label: "Bodega", href: "/bodega" },
  { label: "Viñedos", href: "/vinedos" },
  { label: "Historia", href: "/historia" },
] as const;
export const navCta = { label: "Visitanos", href: "/bodega" } as const;

export const ageGate = {
  question: "¿Sos mayor de 18 años?",
  yes: "Sí",
  no: "No",
  bye: "Vuelve cuando cumplas 18 años. Gracias por tu visita.",
  note: "Beber con moderación.",
} as const;

export const home = {
  heroTitle: "CHANDON",
  heroSubtitle: "Descubrí un mundo de posibilidades",
  heroImage: "/media/site/home-hero-1.webp",
  origin: {
    kicker: "Desde",
    fromYear: 1743,
    toYear: 1959,
    caption: "Año de fundación de Chandon Argentina, la primera filial de la Maison fuera de Francia.",
    lines: [
      "En 1743 nace la Maison Moët & Chandon en Champagne.",
      "En 1957 una expedición recorre Río Negro, Salta y Mendoza buscando dónde instalarse.",
      "En 1959 nace Chandon en Agrelo, al pie de los Andes.",
    ],
    image: "/media/site/edificio.webp",
  },
  carousel: {
    title: "Elegí tu espumante",
    cta: "Conocé la ficha",
    prev: "Espumante anterior",
    next: "Espumante siguiente",
  },
  altitude: {
    title: "Espumantes de altura",
    intro: "La cordillera bloquea los vientos húmedos del Pacífico: clima continental de desierto de altura.",
    unit: "msnm",
  },
  manifesto: {
    parts: [
      "Creemos que la tierra",
      { img: "/media/site/vinedos-pano.webp" },
      "nos brinda mucho más que",
      { img: "/media/site/el-espinillo.webp" },
      "uvas.",
    ],
    cta: "Conocé los viñedos",
  },
  collections: {
    title: "Tres colecciones",
    cta: "Ver todos",
  },
  method: {
    title: "El método",
    kicker: "Charmat prolongado",
    intro: "Fermentación lenta en tanques de acero, con la mano del Chef de Cave en cada paso.",
  },
  chef: {
    kicker: "Chef de Cave",
    name: "Ana Paula Bartolucci",
    text: "Primera mujer Chef de Cave de Chandon Argentina y quinta en la historia de la bodega. Su firma es Chandon Apéritif, que se vende en Alemania, Austria, Suiza y Bélgica.",
    image: "/media/site/chef-de-cave.webp",
    lineage: ["Renaud Poirier", "Onofre Arcos", "Diego Ribbert", "Ana Paula Bartolucci"],
    lineageNote: "Chefs de Cave en la historia de Chandon Argentina. Onofre Arcos trabajó 45 años en la bodega y una cava lleva su nombre.",
  },
  experiences: {
    title: "Todos son bienvenidos a nuestra mesa",
    titleParts: [
      "Todos son",
      { img: "/media/exp/picnic.webp" },
      "bienvenidos a",
      { img: "/media/exp/visita-clasica.webp" },
      "nuestra mesa",
    ],
    sub: "Desde nuestro brand home en Mendoza elaboramos espumosos excepcionales.",
    book: "Reservar",
    contact: "Consultar",
    cta: "Planeá tu visita a la bodega",
  },
  moments: {
    title: "Momentos que nos unen",
    open: "Ver reel",
  },
} as const;

export const collections: Record<
  CollectionId,
  { name: string; text: string }
> = {
  signature: {
    name: "Signature Collection",
    text: "Define el estilo de Chandon: equilibrio, frescura y versatilidad.",
  },
  "free-spirits": {
    name: "Free Spirits",
    text: "Vibrantes, dulces y versátiles, pensados para servir con hielo en momentos relajados.",
  },
  roots: {
    name: "The Roots",
    text: "Homenaje al origen y al terroir, con larga crianza sobre levaduras.",
  },
};

export const products: Product[] = [
  {
    slug: "extra-brut",
    name: "Chandon Extra Brut",
    short: "EXTRA BRUT",
    collection: "signature",
    tagline: "Pionero y referente",
    blend: [{ variety: "Chardonnay", pct: 60 }, { variety: "Pinot Noir", pct: 40 }],
    origin: "El Yaima y Caicayén",
    vineyards: ["el-yaima", "caicayen"],
    altitude: "1.000-1.200 m",
    aromas: "Fresco, frutado, elegante, cremoso y equilibrado.",
    occasion: "Aperitivo, platos ligeros y brindis.",
    pairing: "Salmón rosado a la parrilla con morrones asados, ensalada niçoise, bondiola braseada.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "seco",
    rose: false,
    aging: AGING,
    accent: "#d7a663",
    bottle: m("bottle", "bottle-extra-brut"),
    photo: m("product", "extra-brut"),
  },
  {
    slug: "rose",
    name: "Chandon Rosé",
    short: "ROSÉ",
    collection: "signature",
    tagline: "Suave y frutado",
    blend: [{ variety: "Chardonnay", pct: 58 }, { variety: "Pinot Noir", pct: 38 }, { variety: "Malbec", pct: 4 }],
    origin: "Mendoza",
    vineyards: [],
    altitude: "Mendoza",
    aromas: "Frutos rojos intensos y notas florales. Boca amable, cremosa, con dulzor agradable.",
    occasion: "Atardecer y celebraciones con amigos, platos ligeros.",
    serviceLabel: "Copa con hielo",
    ice: true,
    sweetness: "dulce",
    rose: true,
    aging: AGING,
    accent: "#e58a94",
    bottle: m("bottle", "bottle-rose"),
    photo: m("product", "rose"),
  },
  {
    slug: "demi-sec",
    name: "Chandon Demi Sec",
    short: "DEMI SEC",
    collection: "signature",
    tagline: "Cremosidad y sensación dulce",
    blend: [{ variety: "Chardonnay", pct: 60 }, { variety: "Pinot Noir", pct: 40 }],
    origin: "El Yaima y Caicayén",
    vineyards: ["el-yaima", "caicayen"],
    altitude: "1.000-1.200 m",
    aromas: "Frutado, amplio, fresco y dulce.",
    occasion: "Aperitivo y postres.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "dulce",
    rose: false,
    aging: AGING,
    accent: "#b9c2cc",
    bottle: m("bottle", "bottle-demi-sec"),
    photo: m("product", "demi-sec"),
  },
  {
    slug: "delice",
    name: "Chandon Délice",
    short: "DÉLICE",
    collection: "free-spirits",
    tagline: "Fresco y versátil",
    blend: [{ variety: "Chardonnay", pct: 70 }, { variety: "Pinot Noir", pct: 30 }],
    blendNote: "Más Petit Manseng y Semillón de cosecha tardía.",
    origin: "Mendoza",
    vineyards: [],
    altitude: "Mendoza",
    aromas: "Tropical y cítrico, con dulzor explosivo.",
    occasion: "Aperitivo, brunch, tapas y cócteles.",
    serviceLabel: "Con hielo y un toque de sabor",
    ice: true,
    sweetness: "dulce",
    rose: false,
    aging: AGING,
    accent: "#e9cf5c",
    bottle: m("bottle", "bottle-delice"),
    photo: m("product", "delice"),
  },
  {
    slug: "aperitif",
    name: "Chandon Apéritif",
    short: "APÉRITIF",
    collection: "free-spirits",
    tagline: "Especiado y audaz: Better Than Bitter",
    blend: [{ variety: "Chardonnay", pct: 47 }, { variety: "Pinot Noir", pct: 33 }, { variety: "Semillón", pct: 20 }],
    blendNote: "Con maceración artesanal de naranjas de Entre Ríos y especias del mundo.",
    origin: "Mendoza",
    vineyards: [],
    altitude: "Mendoza",
    aromas: "Fresco, con el amargor característico.",
    occasion: "Atardecer, brindis y comidas.",
    serviceLabel: "Con hielo",
    ice: true,
    sweetness: "aperitivo",
    rose: false,
    aging: AGING,
    accent: "#e5772b",
    bottle: m("bottle", "bottle-aperitif"),
    photo: m("product", "aperitif"),
  },
  {
    slug: "delice-rose",
    name: "Chandon Délice Rosé",
    short: "DÉLICE ROSÉ",
    collection: "free-spirits",
    tagline: "Dulce y refrescante",
    blend: [{ variety: "Chardonnay", pct: null }, { variety: "Malbec", pct: null }, { variety: "Pinot Noir", pct: null }],
    origin: "Mendoza",
    vineyards: [],
    altitude: "Mendoza",
    aromas: "Frutos rojos como frambuesa y cereza, con un toque floral y dulzor.",
    occasion: "Atardecer, celebraciones y platos ligeros.",
    serviceLabel: "Copa con hielo",
    ice: true,
    sweetness: "dulce",
    rose: true,
    aging: AGING,
    accent: "#ec6f8e",
    bottle: m("bottle", "bottle-delice-rose"),
    photo: m("product", "delice-rose"),
  },
  {
    slug: "cuvee-brut-nature",
    name: "Chandon Cuvée Brut Nature",
    short: "BRUT NATURE",
    collection: "roots",
    tagline: "Puro y complejo gracias a su larga evolución sobre levaduras",
    blend: [{ variety: "Chardonnay", pct: 60 }, { variety: "Pinot Noir", pct: 40 }],
    origin: "Caicayén y Cepas del Plata",
    vineyards: ["caicayen", "cepas-del-plata"],
    altitude: "1.200-1.450 m",
    aromas: "Fresco, puro y seductor. Seco, complejo y amplio.",
    occasion: "Entradas, carnes blancas y arroces.",
    pairing: "Pescados y mariscos.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "seco",
    rose: false,
    aging: "Larga crianza sobre levaduras",
    accent: "#8fb3c4",
    bottle: m("bottle", "bottle-brut-nature"),
    photo: m("product", "brut-nature"),
  },
  {
    slug: "cuvee-brut-nature-rose",
    name: "Chandon Cuvée Brut Nature Rosé",
    short: "BRUT NATURE ROSÉ",
    collection: "roots",
    tagline: "Puro, sensual, complejo y de paladar seco",
    blend: [{ variety: "Chardonnay", pct: 59 }, { variety: "Pinot Noir", pct: 39 }, { variety: "Malbec", pct: 2 }],
    origin: "Caicayén II y III",
    vineyards: ["caicayen"],
    altitude: "1.200-1.450 m",
    aromas: "Frutos rojos y brioche.",
    occasion: "Aperitivo, entradas y brindis.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "seco",
    rose: true,
    aging: "Larga crianza sobre levaduras",
    accent: "#d97f8d",
    bottle: m("bottle", "bottle-brut-nature-rose"),
    photo: m("product", "brut-nature-rose"),
  },
  {
    slug: "cuvee-reserve-blanc-de-blancs",
    name: "Chandon Cuvée Réserve Blanc de Blancs",
    short: "BLANC DE BLANCS",
    collection: "roots",
    tagline: "Cítrico y cremoso",
    blend: [{ variety: "Chardonnay", pct: 100 }],
    blendNote: "Chardonnay de altura.",
    origin: "Viñedos de altura de Mendoza",
    vineyards: [],
    altitude: "Mendoza",
    aromas: "Intenso y complejo: frutas blancas y cítricos, cremoso y elegante.",
    occasion: "Entradas y platos principales.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "seco",
    rose: false,
    aging: "Larga crianza sobre levaduras",
    accent: "#d9d28a",
    bottle: m("bottle", "bottle-blanc-de-blancs"),
    photo: m("product", "blanc-de-blancs"),
  },
  {
    slug: "cuvee-reserve-blanc-de-noirs",
    name: "Chandon Cuvée Réserve Blanc de Noirs",
    short: "BLANC DE NOIRS",
    collection: "roots",
    tagline: "Elegante y equilibrado",
    blend: [{ variety: "Pinot Noir", pct: 100 }],
    blendNote: "Pinot Noir de altura.",
    origin: "Cepas del Plata y El Espinillo",
    vineyards: ["cepas-del-plata", "el-espinillo"],
    altitude: "1.400-1.650 m",
    aromas: "Intenso y profundo, con frutas rojas y gran estructura.",
    occasion: "Brunch, tapas y platos principales.",
    serviceLabel: "Copa",
    ice: false,
    sweetness: "seco",
    rose: false,
    aging: "Larga crianza sobre levaduras",
    accent: "#b0566b",
    bottle: m("bottle", "bottle-blanc-de-noirs"),
    photo: m("product", "blanc-de-noirs"),
  },
];

export const common = {
  volume: "750 ml",
  serveTemp: "6-8 °C",
  method: "Charmat prolongado",
  country: "Mendoza, Argentina",
} as const;

export const productLabels = {
  inNumbers: "En números",
  origin: "Origen",
  notes: "Notas",
  aromas: "Aromas y boca",
  pairing: "Maridaje y ocasión",
  process: "Proceso",
  others: "Otros de la colección",
  blend: "Corte",
  temp: "Temperatura",
  aging: "Crianza",
  method: "Método",
  service: "Servicio",
  occasion: "Ocasión",
  collection: "Colección",
  volume: "Presentación",
  unspecifiedBlend: "Chardonnay, Malbec y Pinot Noir",
  sweetness: "Dulzor",
  altitude: "Altura",
  viewSheet: "Ver ficha",
  vineyard: "Viñedo",
} as const;

export const comparator = {
  title: "¿Cuál es para vos?",
  sub: "Elegí hasta tres espumantes y compará.",
  pickHint: "Elegí hasta 3",
  max: "Ya elegiste 3. Sacá uno para cambiar.",
  filters: [
    { id: "seco", label: "Seco" },
    { id: "dulce", label: "Dulce" },
    { id: "hielo", label: "Con hielo" },
    { id: "rose", label: "Rosados" },
  ],
  clear: "Ver todos",
  empty: "Elegí un espumante para ver la comparación.",
  sweetness: { seco: "Seco", dulce: "Dulce", aperitivo: "Aperitivo" },
  withIce: "Con hielo",
  withoutIce: "Sin hielo",
} as const;

export const vineyards = [
  {
    id: "agrelo",
    name: "Agrelo",
    zone: "Luján de Cuyo",
    altFrom: 1000,
    altTo: 1000,
    altLabel: "1.000 m",
    soil: "Arenoso sobre canto rodado andino, con drenaje excepcional y riego por goteo de precisión.",
    note: "Los viñedos originales y la base del estilo de la casa.",
    image: "/media/site/agrelo.webp",
  },
  {
    id: "caicayen",
    name: "Caicayén y Cepas del Plata",
    zone: "Valle de Uco",
    altFrom: 1250,
    altTo: 1550,
    altLabel: "1.250-1.550 m",
    soil: "Al pie del cerro Tupungato, con sol intenso, noches frías y gran amplitud térmica.",
    note: "Bayas chicas, concentradas y aromáticas.",
    image: "/media/site/cepas-del-plata.webp",
  },
  {
    id: "el-espinillo",
    name: "El Espinillo",
    zone: "Gualtallary",
    altFrom: 1625,
    altTo: 1625,
    altLabel: "1.625 m",
    soil: "Suelos pobres, pedregosos y calcáreos, cerca del límite de la viticultura en Mendoza.",
    note: "Mineralidad y pureza, principalmente Chardonnay y Pinot Noir.",
    image: "/media/site/el-espinillo.webp",
  },
  {
    id: "el-yaima",
    name: "El Yaima",
    zone: "Valle de Uco",
    altFrom: 1000,
    altTo: 1200,
    altLabel: "1.000-1.200 m",
    soil: "Franco arenoso a limoso, con caliza.",
    note: "Origen del Extra Brut y del Demi Sec.",
    image: "/media/site/vinedos-pano.webp",
  },
] as const;

export const vineyardsPage = {
  title: "Creemos que la tierra nos brinda mucho más que uvas",
  varieties:
    "Unas 800 ha de Chardonnay y 400 ha de Pinot Noir, más pequeñas cantidades de Semillón, Petit Manseng y Malbec, que da color a los rosados.",
  panorama: "/media/site/vinedos-pano.webp",
  range: "Entre 1.000 y 1.700 m de altura en todos los viñedos.",
  plantings: [
    { variety: "Chardonnay", ha: 800 },
    { variety: "Pinot Noir", ha: 400 },
  ],
  haUnit: "hectáreas",
  listTitle: "Cuatro viñedos",
} as const;

export const espumantesPage = {
  title: "Espumantes",
  sub: "Tres colecciones elaboradas al pie de los Andes. Elegí hasta tres y compará.",
} as const;

export const method = [
  { n: "01", title: "Cosecha", text: "De febrero a fines de marzo. Se prensa la uva para obtener el mosto.", icon: "/media/process/harvest.webp" },
  { n: "02", title: "Primera fermentación", text: "Con levaduras seleccionadas, en tanques de acero separados según el origen de la uva. Nacen los vinos base.", icon: "/media/process/first-fermentation.webp" },
  { n: "03", title: "Assemblage", text: "En junio, el Chef de Cave combina los vinos base para mantener la personalidad de cada etiqueta.", icon: "/media/process/blending.webp" },
  { n: "04", title: "Segunda fermentación", text: "En tanques Charmat de acero nacen las burbujas. Después, de 6 a 8 meses sobre levaduras.", icon: "/media/process/second-fermentation.webp" },
  { n: "05", title: "Dosage y embotellado", text: "Licor de expedición, embotellado y 3 meses de crianza en botella.", icon: "/media/process/dosage.webp" },
] as const;

export const timeline = [
  { year: "1743", title: "Nace la Maison", text: "Se funda Moët & Chandon en Champagne.", image: null },
  { year: "1957", title: "La expedición", text: "Robert-Jean de Vogüé, director de Moët & Chandon, y el enólogo Renaud Poirier recorren Río Negro, Salta y Mendoza en un Citroën 2CV buscando dónde instalarse.", image: null },
  { year: "1959", title: "Chandon Argentina", text: "Se funda en Agrelo la primera filial de la Maison fuera de Francia.", image: "/media/site/edificio.webp" },
  { year: "Comienzos", title: "Condiciones extremas", text: "Zona árida, con el teléfono más cercano a más de 10 km. Para llamar al exterior había que ir 40 km hasta Mendoza, y el equipo trabajaba en barracas sin calefacción.", image: "/media/site/historia-2.webp" },
  { year: "1969", title: "El primer tanque", text: "Llega el primer tanque de acero inoxidable para espumantes por método Charmat.", image: null },
  { year: "Década del 90", title: "Frío controlado", text: "Tanques de acero inoxidable y fermentación con temperatura controlada. En 1990 se planta Gualtallary.", image: null },
  { year: "2005", title: "El Peral", text: "Se planta El Peral, en Tupungato, a unos 1.550 m.", image: null },
  { year: "2012", title: "Chandon Délice", text: "Nace el primero de los Free Spirits.", image: null },
  { year: "2015", title: "El Espinillo", text: "Se planta en Gualtallary, a unos 1.625 m, cerca del límite de la viticultura en Mendoza.", image: "/media/site/el-espinillo.webp" },
  { year: "2017", title: "Mejor rosado", text: "Chandon Brut Rosé es elegido mejor rosado del mundo en Londres.", image: null },
  { year: "2019", title: "Better Than Bitter", text: "Chandon crea Apéritif, una nueva categoría.", image: null },
  { year: "2020", title: "Reconocimientos", text: "Cuvée Brut Nature obtiene 92 puntos en Decanter World Wine Awards y es Mejor Espumante Argentino en CSWWC 2020.", image: null },
  { year: "2021", title: "Garden Spritz", text: "Apéritif llega a Europa como Chandon Garden Spritz.", image: null },
] as const;

export const historyPage = {
  title: "Desde 1959",
  sub: "Desde Argentina, Chandon llevó su saber hacer a Brasil, Estados Unidos, Australia, China e India.",
  image: "/media/site/historia-2.webp",
} as const;

export interface Experience {
  id: string;
  name: string;
  type: string;
  text: string;
  duration: string | null;
  bookingUrl: string | null;
  image: string;
}

export const experiences: Experience[] = [
  { id: "visita-clasica", name: "Visita Clásica", type: "Degustación", text: "Recorrido guiado por viñedo, historia y elaboración, visita a la cava y degustación de 3 espumantes emblema.", duration: null, bookingUrl: "https://www.sevenrooms.com/experiences/chandonargentina/visita-degustacion-clasica-9359951343", image: "/media/exp/visita-clasica.webp" },
  { id: "visita-premium", name: "Visita Premium", type: "Degustación", text: "Viñedo y bodega, con cierre de degustación de 4 etiquetas con bocados en una cava privada.", duration: "1 h 40 min", bookingUrl: "https://www.sevenrooms.com/experiences/chandonargentina/visita-degustacion-premium-9385106766?lang=en", image: "/media/exp/visita-premium.webp" },
  { id: "chef-de-cave", name: "Experiencia Chef de Cave", type: "Enoturismo", text: "Sé aprendiz del Chef de Cave: probá vinos de los tanques, creá y etiquetá tu propio assemblage.", duration: null, bookingUrl: null, image: "/media/exp/chef-de-cave.webp" },
  { id: "5-sentidos", name: "5 Sentidos", type: "Enoturismo", text: "Visita a la cava y secretos de elaboración, con 4 etiquetas maridadas.", duration: null, bookingUrl: null, image: "/media/exp/5-sentidos.webp" },
  { id: "sweeties", name: "Sweeties", type: "Enoturismo", text: "Recorrido y 4 espumantes con pastelería del Bistró.", duration: null, bookingUrl: null, image: "/media/exp/sweeties.webp" },
  { id: "menu-casa", name: "Menú Casa Chandon", type: "Gastronomía", text: "El nuevo menú de estación del Bistró, con platos para compartir pensados para los espumantes.", duration: "2 h", bookingUrl: "https://www.sevenrooms.com/experiences/chandonargentina/bistro-reservation-9383319357?lang=en", image: "/media/exp/menu-casa.webp" },
  { id: "picada", name: "Picada Argentina", type: "Gastronomía", text: "Picada en los jardines con una copa del espumante que elijas.", duration: "1 h 50 min", bookingUrl: "https://www.sevenrooms.com/experiences/chandonargentina/picada-reservation-9367180560", image: "/media/exp/picada.webp" },
  { id: "picnic", name: "Picnic en nuestros jardines", type: "Gastronomía", text: "Picnic en jardines de inspiración francesa: empanadas caseras, sándwiches, verduras de la huerta, algo dulce y una botella de Chandon de 375 cc.", duration: "1 h 50 min", bookingUrl: "https://www.sevenrooms.com/reservations/chandonargentina?experience_id=picnic-en-los-jardines-9409039909", image: "/media/exp/picnic.webp" },
];

export const bodegaPage = {
  title: "La bodega",
  sub: "Jardines de inspiración francesa, cavas de ladrillo y el Bistró a los pies de la cordillera.",
  hero: "/media/site/bodega-hero.webp",
  cava: "/media/site/cava-hero.webp",
  bistro: {
    title: "Bistró Chandon",
    text: "El menú de cada temporada está maridado 100% con espumantes. El ambiente está integrado al jardín, con mesas afuera en días de sol y vista a los viñedos.",
    note: "En julio de 2026 recibió en sus cocinas a Brutal, restaurante mendocino recomendado por la Guía Michelin 2025.",
    image: "/media/exp/menu-casa.webp",
  },
  howTo: { title: "Cómo llegar", map: "Abrir en Google Maps", contact: "Centro de visitas" },
  contactCta: "Escribinos por WhatsApp",
} as const;

export const gallery = {
  title: "La bodega por dentro",
  hint: "Arrastrá para girar. Tocá una foto para verla grande.",
  close: "Cerrar",
  open: "Ver las fotos en grande",
  prev: "Foto anterior",
  next: "Foto siguiente",
  images: [
    { src: "/media/site/cava-hero.webp", alt: "Cava de ladrillo con botellas" },
    { src: "/media/exp/visita-clasica.webp", alt: "Cava abovedada de ladrillo durante la visita clásica" },
    { src: "/media/site/edificio.webp", alt: "Edificio de la bodega y sus jardines" },
    { src: "/media/exp/picnic.webp", alt: "Picnic en los jardines de inspiración francesa" },
    { src: "/media/site/agrelo.webp", alt: "Cosecha en el viñedo de Agrelo" },
    { src: "/media/exp/visita-premium.webp", alt: "Degustación de la visita premium" },
    { src: "/media/site/atardecer-vina.webp", alt: "Atardecer en el viñedo con Chandon" },
    { src: "/media/exp/menu-casa.webp", alt: "Platos del Bistró Chandon" },
    { src: "/media/site/degustacion.webp", alt: "Degustación de espumantes" },
    { src: "/media/exp/chef-de-cave.webp", alt: "Experiencia Chef de Cave" },
    { src: "/media/site/brindis-sol.webp", alt: "Brindis al sol" },
    { src: "/media/exp/sweeties.webp", alt: "Pastelería del Bistró con espumantes" },
  ],
} as const;

export const sphere = {
  title: "Cada copa cuenta una historia",
  hint: "Arrastrá para girar la esfera. Tocá una foto para verla.",
  close: "Cerrar",
  images: [
    { id: "s1", src: "/media/exp/picnic.webp", alt: "Picnic en los jardines", title: "Picnic en los jardines", description: "Empanadas caseras, sándwiches y una botella de Chandon bajo los árboles." },
    { id: "s2", src: "/media/site/cava-hero.webp", alt: "Cava de ladrillo", title: "La cava", description: "Botellas descansando sobre ladrillo, en la penumbra de la bodega." },
    { id: "s3", src: "/media/site/agrelo.webp", alt: "Cosecha en Agrelo", title: "Cosecha en Agrelo", description: "Los viñedos originales, base del estilo de la casa." },
    { id: "s4", src: "/media/moments/home-experience.webp", alt: "Chandon Home Experience", title: "Chandon Home Experience", description: "Gastronomía, música y arte en su quinta edición." },
    { id: "s5", src: "/media/exp/visita-premium.webp", alt: "Visita Premium", title: "Visita Premium", description: "Cuatro etiquetas con bocados en una cava privada." },
    { id: "s6", src: "/media/site/atardecer-vina.webp", alt: "Atardecer en el viñedo", title: "Atardecer en el viñedo", description: "Brut y Rosé frente a la cordillera." },
    { id: "s7", src: "/media/exp/menu-casa.webp", alt: "Menú Casa Chandon", title: "Menú Casa Chandon", description: "Platos para compartir pensados para los espumantes." },
    { id: "s8", src: "/media/moments/baf-week.webp", alt: "BAF Week x Chandon", title: "BAF Week x Chandon", description: "Presencia en la semana de la moda." },
    { id: "s9", src: "/media/site/el-espinillo.webp", alt: "Manos cosechando Chardonnay", title: "El Espinillo", description: "Chardonnay cosechado a 1.625 metros de altura." },
    { id: "s10", src: "/media/exp/sweeties.webp", alt: "Sweeties", title: "Sweeties", description: "Espumantes con pastelería del Bistró." },
    { id: "s11", src: "/media/site/brindis-sol.webp", alt: "Brindis al sol", title: "Brindis al sol", description: "Una copa para cada momento." },
    { id: "s12", src: "/media/moments/roads.webp", alt: "Chandon Roads", title: "Chandon Roads", description: "En cada temporada, un nuevo destino." },
    { id: "s13", src: "/media/exp/picada.webp", alt: "Picada Argentina", title: "Picada Argentina", description: "Picada en los jardines con la copa que elijas." },
    { id: "s14", src: "/media/site/historia-2.webp", alt: "Primeros años de la bodega", title: "Los primeros años", description: "Agrelo, 1959." },
    { id: "s15", src: "/media/exp/chef-de-cave.webp", alt: "Experiencia Chef de Cave", title: "Experiencia Chef de Cave", description: "Creá y etiquetá tu propio assemblage." },
    { id: "s16", src: "/media/site/degustacion.webp", alt: "Degustación", title: "Degustación", description: "Tres espumantes emblema para empezar." },
    { id: "s17", src: "/media/exp/visita-clasica.webp", alt: "Visita Clásica", title: "Visita Clásica", description: "Viñedo, historia y elaboración." },
    { id: "s18", src: "/media/site/vinedos-pano.webp", alt: "Viñedos y cordillera", title: "Los viñedos", description: "Un desierto de altura al pie de los Andes." },
    { id: "s19", src: "/media/exp/5-sentidos.webp", alt: "5 Sentidos", title: "5 Sentidos", description: "Cuatro etiquetas maridadas." },
    { id: "s20", src: "/media/site/cepas-del-plata.webp", alt: "Cepas del Plata", title: "Cepas del Plata", description: "Amplitud térmica y bayas concentradas." },
  ],
} as const;

export const moments = [
  { id: "home-experience", name: "Chandon Home Experience", text: "Quinta edición, 2026: gastronomía, música y arte. Cierre de Fito Páez con un show íntimo de piano.", reel: "https://www.instagram.com/reel/DXfTJO3j7F3/", image: "/media/moments/home-experience.webp" },
  { id: "baf-week", name: "BAF Week x Chandon", text: "Presencia en la semana de la moda AW2026-SS2027, con Las Pepas y Mishka.", reel: "https://www.instagram.com/reel/Dc4UAPwvpfD/", image: "/media/moments/baf-week.webp" },
  { id: "roads", name: "Chandon Roads", text: "En cada temporada, un nuevo destino.", reel: "https://www.instagram.com/reel/DTJYtrAjxkW/", image: "/media/moments/roads.webp" },
] as const;

export const meta = {
  siteName: "Chandon Argentina",
  title: "Chandon Argentina | Espumantes de altura",
  description: "Bodega Chandon en Agrelo, Mendoza. Espumantes de altura elaborados al pie de los Andes desde 1959.",
} as const;

// --- helpers de datos (el comparador y los filtros se calculan desde aquí) ---
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byCollection = (id: CollectionId) => products.filter((p) => p.collection === id);
export const getVineyard = (id: string) => vineyards.find((v) => v.id === id);
