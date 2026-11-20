export const INCIDENT_CATEGORIES = [
  {
    id: 'luminarias',
    shortLabel: 'Luminarias dañadas',
    label: 'Luminarias dañadas en pasillos, parqueaderos y zonas exteriores',
    description: 'Bombillos fundidos, lámparas parpadeando o sectores sin iluminación.',
    iconName: 'Lightbulb',
  },
  {
    id: 'mobiliario_banos',
    shortLabel: 'Mobiliario y baños',
    label: 'Mobiliario y baños en mal estado (bancas, sillas, grifos, sanitarios)',
    description: 'Pupitres rotos, sillas averiadas, fugas en grifos o sanitarios fuera de servicio.',
    iconName: 'Wrench',
  },
  {
    id: 'andenes_rampas',
    shortLabel: 'Andenes, rampas y escaleras',
    label: 'Andenes, rampas y escaleras deterioradas',
    description: 'Baldosas sueltas, barandas flojas, desniveles o problemas de accesibilidad.',
    iconName: 'Footprints',
  },
  {
    id: 'basura_reciclaje',
    shortLabel: 'Basura y reciclaje',
    label: 'Basura acumulada o puntos de reciclaje llenos',
    description: 'Contenedores ecológicos rebosados o residuos acumulados en zonas comunes.',
    iconName: 'Trash2',
  },
];

export const CAMPUS_ZONES = [
  'Edificio Fundadores — Bloque A',
  'Aulas y Salones — Bloque B',
  'Bienestar y Administrativo — Bloque C',
  'Laboratorios y Talleres — Bloque F',
  'Biblioteca Alfonso Palacio Rudas',
  'Plazoleta Central y Zonas Exteriores',
  'Parqueaderos y Accesos Peatonales',
  'Cafetería y Zonas Comunes',
];

export const PRIORITY_LEVELS = [
  { id: 'baja', label: 'Baja', hint: 'No afecta el tránsito ni la seguridad inmediata' },
  { id: 'media', label: 'Media', hint: 'Requiere atención oportuna del equipo de planta' },
  { id: 'alta', label: 'Alta / Urgente', hint: 'Afecta la seguridad, accesibilidad o servicio esencial' },
];

export const REPORT_STATUSES = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'en_revision', label: 'En revisión' },
  { id: 'resuelto', label: 'Resuelto' },
];

export const INITIAL_SEED_REPORTS = [
  {
    id: 'rep-seed-1',
    categoryId: 'luminarias',
    categoryLabel: 'Luminarias dañadas en pasillos, parqueaderos y zonas exteriores',
    zone: 'Parqueaderos y Accesos Peatonales',
    specificLocation: 'Pasillo cubierto hacia la salida peatonal norte',
    priority: 'alta',
    description:
      'Tres reflectores LED del pasillo peatonal están apagados, dejando la zona muy oscura después de las 6:00 p. m.',
    photoDataUrl: null,
    status: 'en_revision',
    authorEmail: 'laura.gomez@upc.edu.co',
    authorName: 'Laura Gomez',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedBy: 'coordinacion@pilotobienestar.edu.co',
  },
  {
    id: 'rep-seed-2',
    categoryId: 'mobiliario_banos',
    categoryLabel: 'Mobiliario y baños en mal estado (bancas, sillas, grifos, sanitarios)',
    zone: 'Aulas y Salones — Bloque B',
    specificLocation: 'Baño de hombres piso 3, segundo lavamanos',
    priority: 'media',
    description:
      'El sensor del grifo quedó goteando continuamente y hay dos sillas con el espaldar suelto en el salón 304.',
    photoDataUrl: null,
    status: 'pendiente',
    authorEmail: 'andres.martinez@upc.edu.co',
    authorName: 'Andres Martinez',
    createdAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 'rep-seed-3',
    categoryId: 'andenes_rampas',
    categoryLabel: 'Andenes, rampas y escaleras deterioradas',
    zone: 'Edificio Fundadores — Bloque A',
    specificLocation: 'Rampa de acceso principal junto a recepción',
    priority: 'alta',
    description:
      'Una cinta antideslizante se desprendió en el tramo medio de la rampa y una baldosa lateral está floja.',
    photoDataUrl: null,
    status: 'pendiente',
    authorEmail: 'camila.rodriguez@upc.edu.co',
    authorName: 'Camila Rodriguez',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 'rep-seed-4',
    categoryId: 'basura_reciclaje',
    categoryLabel: 'Basura acumulada o puntos de reciclaje llenos',
    zone: 'Plazoleta Central y Zonas Exteriores',
    specificLocation: 'Punto ecológico frente a la cafetería central',
    priority: 'baja',
    description:
      'El contenedor blanco de reciclaje (plástico y botellas) ya se encuentra totalmente lleno tras la jornada de la mañana.',
    photoDataUrl: null,
    status: 'resuelto',
    authorEmail: 'mateo.vargas@upc.edu.co',
    authorName: 'Mateo Vargas',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedBy: 'coordinacion@pilotobienestar.edu.co',
  },
];
