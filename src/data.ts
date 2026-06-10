import { Project, ProprietaryProject } from './types';

export const METRICS = {
  yearsOfExperience: '10',
  projectsCompleted: '+100',
  agenciesFounded: '3',
  globalReach: 'Spain / Worldwide'
};

export const PROJECTS_DATA: Project[] = [
  // --- 01 WEB ---
  {
    id: 'dskonnect-web',
    name: 'dskonnect.com',
    branch: 'web',
    branchLabel: '01 — Web',
    type: 'CLIENTE BASSSE',
    category: 'WEB · MUSIC INDUSTRY',
    year: '2025',
    description: 'Diseñé y desarrollé la plataforma web definitiva de Dskonnect, el hogar de grandes artistas de la industria electrónica.',
    detailedDescription: 'Llevé a cabo el diseño completo de dskonnect.com integrando los seis módulos estructurales clave recomendados: Roster interactivo, Calendario dinámico (Artist Dates), DskNews corporativo, Sello discográfico (DskRecords), Escudería interna (DskTeam) y contacto. Incorporé un sistema tipográfico de alto impacto unificando Josefin Sans (títulos), Kanit (etiquetas de redes o géneros) y Archivo (párrafos de lectura fluida), con optimización extrema para móviles.',
    image: '/imagenes/1- WEB/1.1- DSKONNECT.COM/dskonnect web.jpg',
    image_url: '/imagenes/1- WEB/1.1- DSKONNECT.COM/dskonnect web.jpg',
    images: [
      '/imagenes/1- WEB/1.1- DSKONNECT.COM/dskonnect web.jpg'
    ],
    tags: ['JOSEFIN SANS', 'SISTEMA DE 6 SECCIONES', 'ROSTER DINÁMICO', 'MÜSICA UNDERGROUND', 'ESTRATEGIA SEO'],
    link: 'https://dskonnect.com',
    accentColor: '#006BFF', // Corporate Blue representing BASSSE's professional tone
    metrics: [
      { label: 'Carga Web', value: '0.8s' },
      { label: 'Booking Leads', value: '+45%' },
      { label: 'Secciones', value: '6 Módulos' }
    ]
  },
  {
    id: 'technoexperience-web',
    name: 'technoexperience.es',
    branch: 'web',
    branchLabel: '01 — Web',
    type: 'PROYECTO PROPIO',
    category: 'WEB · EDITORIAL · TECHNO CULTURE',
    year: '2026',
    description: 'Diseñé y desarrollé la plataforma líder en divulgación de la cultura de club internacional y música electrónica underground en español.',
    detailedDescription: 'Creé desde cero la web technoexperience.es, combinando una revista digital con agendas dinámicas de festivales y clubes. Optimicé personalmente el embudo de recomendación, el CMS editorial y el deejay tracking, logrando competir en los primeros puestos del sector.',
    image: '/imagenes/1- WEB/1.2- TECHNOEXPERIENCE.ES/technoexperience web.jpg',
    image_url: '/imagenes/1- WEB/1.2- TECHNOEXPERIENCE.ES/technoexperience web.jpg',
    images: [
      '/imagenes/1- WEB/1.2- TECHNOEXPERIENCE.ES/technoexperience web.jpg'
    ],
    tags: ['EDITORIAL CMS', 'EMBUDO INTEGRADO', 'SEO DE ALTO TRÁFICO', 'COMMUNITY INSIGHTS', 'CLUBBING'],
    link: 'https://technoexperience.es',
    accentColor: '#00A3FF', // Cyan blue focus accent color
    metrics: [
      { label: 'Visitas Mensuales', value: '80K+' },
      { label: 'Tráfico Orgánico', value: '72%' },
      { label: 'Venta de Entradas', value: 'Integrada' }
    ]
  },

  // --- 02 BRANDING ---
  {
    id: 'dskonnect-bookings-branding',
    name: 'Dskonnect Bookings',
    branch: 'branding',
    branchLabel: '02 — Branding',
    type: 'CLIENTE BASSSE',
    category: 'BRANDING · MUSIC INDUSTRY',
    year: '2025',
    description: 'Rediseñé la identidad visual corporativa de Dskonnect, unificando proporción y simetría geométrica.',
    detailedDescription: 'En 2024, desde BASSSE iniciamos la renovación estética de la marca dskonnect sin perder sus dos décadas de trayectoria. Ajusté ángulos clave a 17° y 62°, estructuré la icónica tipografía Eurostile LT Std Demi Oblique en el logotipo corporativo y definí zonas de seguridad estrictas que garanticen una visibilidad óptima. Consolida el lema eterno de la firma: "A JOURNEY THROUGH ELECTRONIC MUSIC", usando el púrpura corporativo #7A01AC como baluarte.',
    image: '/imagenes/2- BRANDING/2.1- DSKONNECT BOOKINGS/guia dskonnect.jpg',
    image_url: '/imagenes/2- BRANDING/2.1- DSKONNECT BOOKINGS/guia dskonnect.jpg',
    images: [
      '/imagenes/2- BRANDING/2.1- DSKONNECT BOOKINGS/guia dskonnect.jpg',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['EUROSTILE LT STD', 'MOCKUPS CORPORATIVOS', 'DSKONNECT PURPLE', 'ZONA DE SEGURIDAD', 'SISTEMA MODULAR'],
    link: 'https://dskonnect.com',
    accentColor: '#006BFF',
    metrics: [
      { label: 'Ángulo de Matriz', value: '17° / 62°' },
      { label: 'Proporción de Logo', value: 'Perfeccionada' },
      { label: 'Formatos Diseñados', value: '45+' }
    ]
  },
  {
    id: 'sun-flower-branding',
    name: 'Sun & Flower Agency',
    branch: 'branding',
    branchLabel: '02 — Branding',
    type: 'CLIENTE BASSSE',
    category: 'BRANDING · LIFESTYLE · TRAVEL',
    year: '2024',
    description: 'Creé el universo estratégico y de relaciones públicas premium de esta boutique boutique nacida en el Caribe mexicano.',
    detailedDescription: 'Conceptualicé la identidad visual corporativa uniendo la energía del sol con el crecimiento de las flores. Diseñé un ecosistema estricto de fuentes tipográficas: Bebas Neue (para títulos de alto impacto), Alegreya Sans (subtítulos y CTA), Inter (botones o llamadas a la acción) y Montserrat (para cuerpo de texto generales). Paleta de colores soberbia: Azul-Morado #5b3ee4, Naranja Brillante #ff9000, Negro puro y Blanco espacioso.',
    image: '/imagenes/2- BRANDING/2.2- SUN & FLOWER AGENCY/guia sun & flower.jpg',
    image_url: '/imagenes/2- BRANDING/2.2- SUN & FLOWER AGENCY/guia sun & flower.jpg',
    images: [
      '/imagenes/2- BRANDING/2.2- SUN & FLOWER AGENCY/guia sun & flower.jpg',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['BEBAS NEUE', 'ALEGREYA SANS', 'NUESTRA HISTORIA', 'PR BOUTIQUE', 'CARIBE MEXICANO'],
    link: 'https://bassse.co',
    accentColor: '#0077FF', // Premium Slate Blue focus
    metrics: [
      { label: 'NPS de Cliente', value: '10/10' },
      { label: 'Lanzamiento RRSS', value: 'Exitoso' },
      { label: 'Paleta Corporal', value: '#5b3ee4' }
    ]
  },
  {
    id: 'nevur-branding',
    name: 'NEVÜR',
    branch: 'branding',
    branchLabel: '02 — Branding',
    type: 'CLIENTE BASSSE',
    category: 'BRANDING · LOGO & IDENTITY',
    year: '2026',
    description: 'Diseño de logotipo e identidad visual para NEVÜR, el nuevo alter ego del deejay salmantino Rubén Herráez en su andadura electrónica.',
    detailedDescription: 'Conceptualización y desarrollo visual integral centrado en el diseño de logotipo y dirección artística para NEVÜR, la nueva identidad de Rubén Herráez, deejay que inicia desde Salamanca su trayectoria musical en la electrónica underground. Un sistema visual puro, elegante y minimalista adaptado para su proyección profesional.',
    image: '/imagenes/2- BRANDING/2.3- NEVÜR/guia nevur.jpg',
    image_url: '/imagenes/2- BRANDING/2.3- NEVÜR/guia nevur.jpg',
    images: [
      '/imagenes/2- BRANDING/2.3- NEVÜR/guia nevur.jpg',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['DISEÑO DE LOGO', 'IDENTIDAD VISUAL', 'NUEVA ANDADURA', 'RUBÉN HERRÁEZ', 'SALAMANCA UNDERGROUND'],
    link: 'https://bassse.co',
    accentColor: '#00A3FF', // Electric Blue representing tech-research
    metrics: [
      { label: 'Matriz visual', value: 'Brutalista' },
      { label: 'Origen Artista', value: 'Salamanca' },
      { label: 'Dirección', value: 'BASSSE' }
    ]
  },
  // --- 03 EVENTOS ---
  {
    id: 'natos-waor-event',
    name: 'Natos y Waor',
    branch: 'events',
    branchLabel: '03 — Eventos',
    type: 'EVENTO',
    category: 'EVENTO · CONCERT · PROMOTION',
    year: '2024',
    description: 'Estrategia y promoción digital integral de gran alcance para los mayores referentes del rap en España durante su gira en Villarrubia.',
    detailedDescription: 'Me encargué del soporte y diseño publicitario, adaptando piezas y banners del cartel principal de Villarrubia de los Ojos (Campo de Fútbol). Implementé flujos avanzados de email marketing y social ads automatizados vinculados con Logiticket y Punto0.40 para maximizar la venta rápida de entradas.',
    image: '/imagenes/3- EVENTOS/3.1- NATOS Y WAOR/4.jpg',
    image_url: '/imagenes/3- EVENTOS/3.1- NATOS Y WAOR/4.jpg',
    images: [
      '/imagenes/3- EVENTOS/3.1- NATOS Y WAOR/4.jpg',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['GIRA NACIONAL', 'PUNTO 0.40', 'LOGITICKET', 'RAP ESPAÑOL', 'SOLD OUT'],
    accentColor: '#006BFF', // Electric High-Contrast Blue
    metrics: [
      { label: 'Medio', value: 'Logiticket' },
      { label: 'Gira de Conciertos', value: 'Sold Out' },
      { label: 'Espectadores', value: '15.000+' }
    ]
  },
  {
    id: 'noctar-event',
    name: 'NÖCTAR',
    branch: 'events',
    branchLabel: '03 — Eventos',
    type: 'PROYECTO PROPIO',
    category: 'PROYECTO PROPIO · EVENTO · TECHNO CULTURE',
    year: '2025',
    description: 'Mi propia serie de sesiones e identidad estroboscópica donde la penumbra absoluta y la nitidez sonora dominan la pista.',
    detailedDescription: 'Creé NÖCTAR Club como una experiencia underground irrepetible, con dirección estética fundamentada en el negro absoluto sustentada con destellos verdes radiactivos de matriz 9:16 y sistema analógico. Políticas estrictas contra cámaras para salvaguardar la intimidad en la pista de baile.',
    image: '/imagenes/3- EVENTOS/3.2- NÖCTAR/cuagrado.jpg',
    image_url: '/imagenes/3- EVENTOS/3.2- NÖCTAR/cuagrado.jpg',
    images: [
      '/imagenes/3- EVENTOS/3.2- NÖCTAR/cuagrado.jpg',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['NÖCTAR CLUB', 'EXPERIENCIA UNDERGROUND', 'NO-PHOTO POLICY', 'AUDIO DE ALTA FIDELIDAD', 'ATMÓSFERA INMERSIVA'],
    accentColor: '#00A3FF', // Techno Cyan matching neon flyer style
    metrics: [
      { label: 'Asistencia Media', value: '800+' },
      { label: 'Estilo', value: 'Industrial' },
      { label: 'Retorno Clubber', value: '88%' }
    ]
  },
  {
    id: 'fish-cheese-event',
    name: 'Fish & Cheese',
    branch: 'events',
    branchLabel: '03 — Eventos',
    type: 'EVENTO',
    category: 'EVENTO · CLUB CULTURE · MUSIC COMMUNITY',
    year: '2024',
    description: 'Dirección visual y marketing rebelde de alto impacto para la sesión híbrida que reunié gastronomía canalla, rap y cultura urbana.',
    detailedDescription: 'Implementé una campaña de identidad brutalista sumamente irreverente uniendo marcas alternativas como Cocotea, HD y La Mata Fest. Conectamos con un público joven a través de memes estratégicos, cartelería de corte rebelde y drops express de alta expectación.',
    image: '/imagenes/3- EVENTOS/3.3- FISH & CHEESE MUSIK/gf.jpg',
    image_url: '/imagenes/3- EVENTOS/3.3- FISH & CHEESE MUSIK/gf.jpg',
    images: [
      '/imagenes/3- EVENTOS/3.3- FISH & CHEESE MUSIK/gf.jpg',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['LA MATA FEST', 'COCOTEA', 'COMMUNITY DRIVEN', 'MEME MARKETING', 'CULTURA URBANA'],
    accentColor: '#00D1FF', // Ice-blue water-drops focus from their artwork
    metrics: [
      { label: 'Impactos Redes', value: '350K+' },
      { label: 'Velocidad de Lleno', value: 'Récord' },
      { label: 'Tickets vendidos', value: '100%' }
    ]
  },

  // --- 05 MERCHANDISING ---
  {
    id: 'fclub-merch',
    name: 'F Club Merchandising',
    branch: 'merch',
    branchLabel: '05 — Merchandising',
    type: 'CLIENTE BASSSE',
    category: 'CLIENTE BASSSE · MERCHANDISING · CLUB CULTURE',
    year: '2025',
    description: 'Línea de moda streetwear de alta densidad conceptual que diseñé en BASSSE, uniendo prendas físicas y cultura club.',
    detailedDescription: 'Creé la serie premium de camisetas de alto gramaje e identificadores lanyards para F Club. Utilicé tejidos orgánicos, cortes oversized modernos y una sobriedad gráfica orientada a generar orgullo de pertenencia entre los seguidores asiduos a Techno Experience.',
    image: '/imagenes/5- MERCHANDISING/5.1- FCLUB/f club merch.jpg',
    image_url: '/imagenes/5- MERCHANDISING/5.1- FCLUB/f club merch.jpg',
    images: [
      '/imagenes/5- MERCHANDISING/5.1- FCLUB/f club merch.jpg',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['F CLUB WEAR', 'ALTO GRAMAJE', 'LANYARD BORDADO', 'SERIGRAFÍA TÁCTIL', 'EDICIÓN PREMIUM'],
    accentColor: '#006BFF',
    metrics: [
      { label: 'Unidades Vendidas', value: '1.5K+' },
      { label: 'Tejido Técnico', value: 'Oversized' },
      { label: ' drops agotados', value: '48h' }
    ]
  },
  {
    id: 'techno-seven-merch',
    name: '7ECHNO SEVEN',
    branch: 'merch',
    branchLabel: '05 — Merchandising',
    type: 'CLIENTE BASSSE',
    category: 'CLIENTE BASSSE · MERCHANDISING · TECHNO CULTURE',
    year: '2026',
    description: 'Prendas utilitarias y accesorios técnicos diseñados para durar en los festivales y pistas rave del mundo.',
    detailedDescription: 'Llevé a cabo el diseño de accesorios reflectantes y cortavientos técnicos para la marca Techno Seven. Logré equilibrar resistencia utilitaria con estilo brutalista contemporáneo empleando lanyards tejidos en jacquard de alta densidad y drops rápidos de alta expectación B2C.',
    image: '/imagenes/5- MERCHANDISING/5.2- TECHNO SEVEN/techno seven merch.jpg',
    image_url: '/imagenes/5- MERCHANDISING/5.2- TECHNO SEVEN/techno seven merch.jpg',
    images: [
      '/imagenes/5- MERCHANDISING/5.2- TECHNO SEVEN/techno seven merch.jpg',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'
    ],
    tags: ['ACCESORIO EXCLUSIVO', 'BRUTALISTA', 'TEJIDO TÉCNICO', 'DROP UTILITARIO', 'REFLECTANTES'],
    accentColor: '#00A3FF',
    metrics: [
      { label: 'Drop Agotado', value: '48 Horas' },
      { label: 'Margen de Beneficio', value: '+60%' }
    ]
  }
];

export const AI_CAPABILITIES = [
  {
    title: 'Automatización editorial para medios',
    description: 'Creo canales automatizados que monitorizan lanzamientos de música en Beatport, Spotify y Bandcamp, clasificando por género para generar resúmenes estilísticos redactados con mi voz editorial propia y publicándolos automáticamente con SEO optimizado.',
    key: 'INTEGRIDAD DE CONTENIDO',
    tags: ['Modelos de Lenguaje (LLM)', 'API de Beatport', 'Sincronización de CMS']
  },
  {
    title: 'Sistemas de contenido para redes sociales',
    description: 'Diseño estructuras automatizadas que toman vídeos de mis sets de deejays o grabaciones en formato largo, extraen ganchos estéticos clave para generar videos verticales en 9:16 y programan su publicación directa con copies sumamente atractivos.',
    key: 'FLUJO DE VIRALIDAD',
    tags: ['Corte de Video AI', 'Procesamiento de Contexto', 'Publicación Programada']
  },
  {
    title: 'Workflows de email marketing estratégico',
    description: 'Implemento flujos de email marketing con personalización infinita basada en el comportamiento real de promotores y seguidores de mis marcas, segmentando por subgéneros y automatizando copys persuasivos para disparar la conversión.',
    key: 'INTELIGENCIA DE EMAIL',
    tags: ['Bases de Datos Vectoriales', 'Segmentación de Cohortes', 'Copy Dinámico']
  },
  {
    title: 'Automatización de captación B2B',
    description: 'Desarrollo agentes inteligentes de prospección comercial que localizan promotores o marcas de mi sector, analizan de forma autónoma sus necesidades estéticas, cruzan el histórico y redactan propuestas comerciales de alto impacto en PDF.',
    key: 'CAPTACIÓN DE CLIENTES IA',
    tags: ['Web Scraping', 'Generador de Propuestas PDF', 'Integración con CRM']
  },
  {
    title: 'Análisis automatizado de escenas y tendencias',
    description: 'Diseño herramientas de predicción proactiva de sonidos en auge y comunidades emergentes. Mi sistema recolecta datos de redes y foros para alertarme a mí y a mis mánagers sobre hacia dónde se dirige el mercado antes que a la competencia.',
    key: 'PREDICCIÓN DE TENDENCIAS',
    tags: ['Recolectores de Datos', 'Análisis Predictivo', 'Paneles en Tiempo Real']
  }
];

export const PROPRIETARY_PROJECTS_DATA: ProprietaryProject[] = [
  {
    id: 'techno-experience',
    name: 'TECHNO EXPERIENCE',
    role: 'Comunidad y medio de divulgación de cultura de club',
    description: 'Mi plataforma líder de divulgación sobre música de club, techno y lifestyle underground en España y Latinoamérica, de la cual soy cofundador y codirector.',
    longDescription: 'Co-fundé y dirijo Techno Experience. Comenzamos como un simple canal de expresión comunitaria y hemos madurado hasta convertirnos en una corporación editorial y promotora propia. Además de coordinar el contenido artístico, guías de eventos y noticias premium, sirvo de soporte publicitario de alto rango e impulso la visibilidad de jóvenes talentos.',
    image: '/imagenes/1- WEB/1.2- TECHNOEXPERIENCE.ES/technoexperience web.jpg',
    tags: ['MEDIO EDITORIAL', 'SEO AGRESIVO', 'TECHNO CULTURE', 'COMMUNITY DRIVEN', 'EVENT PROMOTION'],
    link: 'https://technoexperience.es',
    stats: [
      { label: 'Lectores Mensuales', value: '80K+' },
      { label: 'Comunidad Redes', value: '120K+' },
      { label: 'Tráfico Orgánico', value: '72%' }
    ]
  },
  {
    id: 'bassse-agency',
    name: 'BASSSE',
    role: 'Agencia creativa, dirección de arte e integración de IA',
    description: 'Mi agencia creativa de dirección de arte, desarrollo digital de alto rendimiento, estrategias de marketing y soluciones con IA aplicadas a proyectos culturales y de vanguardia.',
    longDescription: 'Fundé BASSSE para redefinir el significado de la ingeniería de marca en la industria musical y de ocio. Con mi equipo actúo como el nexo perfecto entre la estética underground de club y la conversión comercial premium, integrando análisis de datos, automatizaciones avanzadas mediante IA de vanguardia y drops de streetwear exclusivos.',
    image: '/imagenes/2- BRANDING/2.1- DSKONNECT BOOKINGS/guia dskonnect.jpg',
    tags: ['ESTRATEGIA DIGITAL', 'DIRECCIÓN CREATIVA', 'IA APLICADA', 'CONSTRUCCIÓN DE MARCA', 'EVENT MARKETING'],
    link: 'https://bassse.co',
    stats: [
      { label: 'Proyectos Activos', value: '35+' },
      { label: 'Drops Hechos', value: '12' },
      { label: 'Retorno Medio', value: '+40%' }
    ]
  },
  {
    id: 'sodoma-project',
    name: 'SODOMA',
    role: 'EVENTO de clubbing',
    description: 'Mi serie de eventos de clubbing y mi colectivo underground enfocado en techno industrial, sonido de absoluta fidelidad y dirección de arte extrema.',
    longDescription: 'Con Sodoma reconfiguro por completo la propuesta de club tradicional creando un espacio libre, seguro y sumamente inmersivo. Mi propuesta descansa en la provocación artística, iluminación estroboscópica implacable, política estricta de no-fotos y una curaduría musical en la que congrego a los mayores exponentes de la escena techno industrial global.',
    image: '/imagenes/3- EVENTOS/3.2- NÖCTAR/cuagrado.jpg',
    tags: ['DIRECCIÓN VISUAL', 'CLUBBING RADICAL', 'UNDERGROUND COMMUNITY', 'PRODUCCIÓN ESTROBOSCÓPICA', 'EXPERIENCIA SEGURA'],
    stats: [
      { label: 'Tasa Sold Out', value: '94%' },
      { label: 'Fidelización de Clubbers', value: '91%' },
      { label: 'Eventos Realizados', value: '8+' }
    ]
  }
];

