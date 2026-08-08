// data/services.ts

export interface Plan {
  id: string; // ej: "mensual", "trimestral", "clase-unica"
  label: string;
  price: number; // Pesos COP enteros para backend/Mercado Pago
  isRecommended?: boolean;
  tag?: string;
}

export interface ServiceItem {
  id: string;
  category: string;
  microTitle: string;
  title: string;
  isSpecial?: boolean;
  isCustomQuote?: boolean; // true si requiere cotización
  note?: string;
  metadata: {
    age?: string;
    schedule?: string;
    mode: string;
    intensityOrDuration: string;
  };
  description: string;
  learnList: string[];
  plans: Plan[];
}

export const SERVICES: ServiceItem[] = [
  // BLOQUE 1: PROGRAMAS GRUPALES
  {
    id: "kids-grupales",
    category: "Canto para niños",
    microTitle: "Para los más pequeños",
    title: "Clases Grupales Kids",
    metadata: {
      age: "Niños de 5 a 10 años",
      schedule: "Sábados 8:00 a. m. a 10:00 a. m.",
      mode: "Presencial",
      intensityOrDuration: "2 horas semanales"
    },
    description: "El primer escenario para que los niños descubran su voz cantando, jugando y compartiendo. Un proceso seguro y creativo para desarrollar respiración, afinación, ritmo, confianza y amor por la música.",
    learnList: ["Fundamentos del canto", "Seguridad y expresión", "Escucha musical", "Trabajo en grupo"],
    plans: [
      { id: "mensual", label: "Mensual", price: 809000 },
      { id: "trimestral", label: "Trimestral", price: 2299000, isRecommended: true, tag: "Más elegido para ver progreso real." },
      { id: "anual", label: "Anual", price: 8699000 }
    ]
  },
  {
    id: "teens-grupales",
    category: "Canto para jóvenes",
    microTitle: "Voz e identidad joven",
    title: "Clases Grupales Teens",
    metadata: {
      age: "Adolescentes de 11 a 16 años",
      schedule: "Sábados 10:00 a. m. a 12:00 m.",
      mode: "Presencial",
      intensityOrDuration: "2 horas semanales"
    },
    description: "Un espacio para que los adolescentes desarrollen su voz, ganen seguridad y empiecen a construir identidad artística en comunidad con otros jóvenes.",
    learnList: ["Técnica vocal", "Interpretación y proyección", "Estilo propio", "Presencia escénica y confianza"],
    plans: [
      { id: "mensual", label: "Mensual", price: 809000 },
      { id: "trimestral", label: "Trimestral", price: 2299000, isRecommended: true, tag: "Más elegido para crear hábito vocal." },
      { id: "anual", label: "Anual", price: 8699000 }
    ]
  },
  {
    id: "adultos-grupales",
    category: "Canto para adultos",
    microTitle: "Un programa por módulos",
    title: "Clases Grupales Adultos",
    metadata: {
      age: "17 años en adelante",
      schedule: "Miércoles 6:00 p. m. a 7:00 p. m.",
      mode: "Presencial",
      intensityOrDuration: "18 módulos progresivos"
    },
    description: "Un programa estructurado para formarte a cualquier edad, desde cero o con experiencia. Avanzas módulo a módulo mientras trabajas técnica, interpretación, repertorio y seguridad al cantar.",
    learnList: ["Respiración y afinación", "Técnica base e interpretación", "Estilo y repertorio", "Presencia escénica"],
    plans: [
      { id: "mensual", label: "Mensual", price: 569000 },
      { id: "trimestral", label: "Trimestral", price: 1609000, isRecommended: true, tag: "Más elegido para avanzar con continuidad." },
      { id: "anual", label: "Anual", price: 6069000 }
    ]
  },

  // BLOQUE 2: CLASES INDIVIDUALES
  {
    id: "tecnica-vocal-ind",
    category: "Técnica vocal",
    microTitle: "Tu voz, uno a uno",
    title: "Canto · Técnica Vocal",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Clase individual enfocada por completo en tu voz. El maestro trabaja tu técnica e interpretación desde tu punto de partida, tus metas y el repertorio que quieres dominar.",
    learnList: ["Respiración, apoyo y afinación", "Resonancia y rango vocal", "Cuidado de la voz", "Interpretación"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 279000 },
      { id: "paquete-5", label: "Paquete 5", price: 1329000, isRecommended: true, tag: "Más elegido para notar avance." },
      { id: "paquete-10", label: "Paquete 10", price: 2509000 }
    ]
  },
  {
    id: "teatro",
    category: "Escena",
    microTitle: "Presencia y actuación",
    title: "Teatro",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Formación en actuación y expresión escénica para artistas que quieren potenciar su presencia, su interpretación y su conexión con el público.",
    learnList: ["Actuación y manejo corporal", "Expresión emocional", "Interpretación", "Conexión con la audiencia"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 279000 },
      { id: "paquete-5", label: "Paquete 5", price: 1329000, isRecommended: true, tag: "Más elegido para ganar seguridad escénica." },
      { id: "paquete-10", label: "Paquete 10", price: 2509000 }
    ]
  },
  {
    id: "produccion-musical",
    category: "Instrumentos",
    microTitle: "Crea tu propia música",
    title: "Producción Musical",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Un proceso para transformar tus ideas musicales en canciones. Aprende a estructurar, grabar, editar y dar forma a un proyecto sonoro propio.",
    learnList: ["Fundamentos de producción", "Herramientas digitales", "Estructura de canción", "Grabación, edición y mezcla"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 279000 },
      { id: "paquete-5", label: "Paquete 5", price: 1329000, isRecommended: true, tag: "Más elegido para empezar tu proyecto." },
      { id: "paquete-10", label: "Paquete 10", price: 2509000 }
    ]
  },
  {
    id: "expresion-corporal",
    category: "Escena",
    microTitle: "Tu cuerpo también canta",
    title: "Expresión Corporal",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Entrenamiento para integrar cuerpo, movimiento y presencia escénica. Ideal para artistas que quieren comunicar mejor y sentirse más naturales en escena.",
    learnList: ["Conciencia corporal y movimiento", "Presencia en escena", "Manejo de tensiones", "Expresión y seguridad"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 279000 },
      { id: "paquete-5", label: "Paquete 5", price: 1329000, isRecommended: true, tag: "Más elegido para soltar el cuerpo." },
      { id: "paquete-10", label: "Paquete 10", price: 2509000 }
    ]
  },
  {
    id: "yoga-voz",
    category: "Bienestar",
    microTitle: "Bienestar como base",
    title: "Yoga para voz y cuerpo",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "El bienestar también sostiene la voz. Este proceso trabaja respiración, postura, relajación y manejo del estrés para cuidar el cuerpo como herramienta artística.",
    learnList: ["Respiración y control corporal", "Relajación y postura", "Manejo de ansiedad escénica", "Cuidado del instrumento"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 279000 },
      { id: "paquete-5", label: "Paquete 5", price: 1329000, isRecommended: true, tag: "Más elegido para cuidar tu instrumento." },
      { id: "paquete-10", label: "Paquete 10", price: 2509000 }
    ]
  },

  // BLOQUE 3: INSTRUMENTOS
  {
    id: "piano",
    category: "Instrumentos",
    microTitle: "Domina un instrumento",
    title: "Piano",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Aprende piano y comprende la música desde otra dimensión. Dominar un instrumento amplía tu musicalidad, fortalece tu oído y te da herramientas para cantar, componer y acompañarte.",
    learnList: ["Notas, acordes y ritmo", "Lectura musical y coordinación", "Acompañamiento vocal", "Interpretación"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 219000 },
      { id: "paquete-5", label: "Paquete 5", price: 1029000, isRecommended: true, tag: "Más elegido para crear hábito musical." },
      { id: "paquete-10", label: "Paquete 10", price: 1939000 }
    ]
  },
  {
    id: "guitarra",
    category: "Instrumentos",
    microTitle: "Acompaña tu voz",
    title: "Guitarra",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "Aprende a tocar guitarra y acompaña tu voz. Un instrumento versátil para interpretar tus canciones favoritas, crear música y fortalecer tu camino artístico.",
    learnList: ["Acordes y ritmos", "Técnica de acompañamiento", "Lectura aplicada", "Interpretación vocal"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 219000 },
      { id: "paquete-5", label: "Paquete 5", price: 1029000, isRecommended: true, tag: "Más elegido para acompañar tu voz." },
      { id: "paquete-10", label: "Paquete 10", price: 1939000 }
    ]
  },

  // BLOQUE 4: DIRECTO CON YANETSIS
  {
    id: "asesoria-yanetsis",
    category: "Trabajar con Yanetsis",
    microTitle: "Tu punto de partida",
    title: "Asesoría con Yanetsis",
    isSpecial: true,
    metadata: {
      mode: "Virtual",
      intensityOrDuration: "30 minutos"
    },
    description: "Una sesión inicial directamente con Yanetsis Alfonso para diagnosticar tu punto de partida como artista, conocer tu voz, resolver dudas y definir los siguientes pasos de tu proceso.",
    learnList: ["Diagnóstico vocal personalizado", "Orientación artística", "Respuestas de técnica e industria", "Experiencia directa con Yanetsis"],
    plans: [
      { id: "sesion-unica", label: "Sesión única", price: 179000, isRecommended: true, tag: "Entrada al mundo Yanetsis." }
    ]
  },
  {
    id: "tecnica-yanetsis",
    category: "Trabajar con Yanetsis",
    microTitle: "Formación al más alto nivel",
    title: "Técnica Vocal con Yanetsis",
    isSpecial: true,
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "1 hora por sesión"
    },
    description: "La experiencia de formarte directamente con Yanetsis Alfonso, la coach que ha preparado artistas para televisión, escenarios y producciones de alto nivel.",
    learnList: ["Técnica vocal avanzada", "Interpretación y estilo propio", "Cuidado vocal", "Estándares profesionales de TV"],
    plans: [
      { id: "clase-unica", label: "Clase única", price: 419000 },
      { id: "paquete-5", label: "Paquete 5", price: 1959000, isRecommended: true, tag: "Más elegido para avanzar con Yanetsis." },
      { id: "paquete-10", label: "Paquete 10", price: 3709000 }
    ]
  },
  {
    id: "coaching-yanetsis",
    category: "Trabajar con Yanetsis",
    microTitle: "Construye tu carrera",
    title: "Coaching Artístico",
    isSpecial: true,
    isCustomQuote: true,
    note: "Valor desde. Puede variar según el artista y los servicios integrados.",
    metadata: {
      mode: "Presencial o virtual",
      intensityOrDuration: "4 sesiones mensuales"
    },
    description: "Un acompañamiento estratégico para artistas que quieren profesionalizar su carrera. Define tu identidad, ordena tus ideas y traza una ruta para proyectar tu propuesta musical.",
    learnList: ["Nombre artístico e identidad", "Propósito musical y sello personal", "Repertorio y proyecto artístico", "Estrategia de proyección"],
    plans: [
      { id: "mes-inicial", label: "Mes inicial", price: 3129000 },
      { id: "trimestral", label: "Trimestral", price: 8909000, isRecommended: true, tag: "Más elegido para construir carrera." },
      { id: "anual", label: "Anual", price: 33729000 }
    ]
  }
];