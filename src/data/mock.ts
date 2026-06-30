// Datos mock para Happy Smile
export type EstadoCita = "Confirmada" | "Pendiente" | "Cancelada" | "Completada";
export type EstadoTratamiento = "En curso" | "Completado" | "Pausado";
export type EstadoCuota = "Pagado" | "Pendiente" | "Vencido";

export interface Especialidad {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  duracionMin: number;
  precioBase: number;
}

export interface Profesional {
  id: string;
  nombre: string;
  especialidadId: string;
  rut: string;
  email: string;
  telefono: string;
  horario: string;
  comision: number; // %
  bio: string;
  credenciales: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  ficha: string;
}

export interface Cita {
  id: string;
  pacienteId: string;
  profesionalId: string;
  especialidadId: string;
  fechaISO: string; // ISO datetime
  duracionMin: number;
  box: string;
  estado: EstadoCita;
  notas?: string;
}

export interface Cuota {
  numero: number;
  monto: number;
  vencimiento: string; // ISO date
  estado: EstadoCuota;
}

export interface Tratamiento {
  id: string;
  pacienteId: string;
  profesionalId: string;
  especialidadId: string;
  nombre: string;
  fechaInicio: string;
  fechaFinEstim?: string;
  estado: EstadoTratamiento;
  costoTotal: number;
  cuotas: Cuota[];
  etapas: { nombre: string; completada: boolean }[];
  notas: string;
}

export interface Material {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMin: number;
  precioUnit: number;
  proveedor: string;
}

export interface Gasto {
  id: string;
  fecha: string;
  categoria: "Materiales" | "Arriendo" | "Servicios básicos" | "Sueldos" | "Otros";
  descripcion: string;
  monto: number;
  comprobante: string;
}

export const especialidades: Especialidad[] = [
  {
    id: "e1",
    nombre: "Implantología",
    descripcion: "Reemplazo de piezas dentales con implantes de titanio de última generación.",
    icono: "🦷",
    duracionMin: 60,
    precioBase: 850000,
  },
  {
    id: "e2",
    nombre: "Ortodoncia",
    descripcion: "Brackets, alineadores invisibles y corrección de mordida para todas las edades.",
    icono: "😁",
    duracionMin: 45,
    precioBase: 1800000,
  },
  {
    id: "e3",
    nombre: "Endodoncia",
    descripcion: "Tratamientos de conducto para salvar piezas dentales dañadas.",
    icono: "🩺",
    duracionMin: 90,
    precioBase: 220000,
  },
  {
    id: "e4",
    nombre: "Periodoncia",
    descripcion: "Cuidado de encías, tratamiento de gingivitis y enfermedad periodontal.",
    icono: "🌿",
    duracionMin: 45,
    precioBase: 180000,
  },
  {
    id: "e5",
    nombre: "Odontología General",
    descripcion: "Limpiezas, tapaduras, controles preventivos y diagnóstico integral.",
    icono: "✨",
    duracionMin: 30,
    precioBase: 35000,
  },
];

export const profesionales: Profesional[] = [
  {
    id: "p1",
    nombre: "Dr. Rodrigo Fuentes",
    especialidadId: "e1",
    rut: "12.345.678-9",
    email: "rfuentes@happysmile.cl",
    telefono: "+56 9 8765 4321",
    horario: "Lun-Vie 09:00-18:00",
    comision: 45,
    bio: "Especialista en implantes con más de 15 años de experiencia.",
    credenciales: "Cirujano Dentista U. de Chile · Magíster en Implantología",
  },
  {
    id: "p2",
    nombre: "Dra. Catalina Vega",
    especialidadId: "e2",
    rut: "14.567.890-1",
    email: "cvega@happysmile.cl",
    telefono: "+56 9 7654 3210",
    horario: "Lun-Sáb 10:00-19:00",
    comision: 40,
    bio: "Ortodoncista certificada en alineadores invisibles.",
    credenciales: "Cirujano Dentista U. de los Andes · Especialista en Ortodoncia",
  },
  {
    id: "p3",
    nombre: "Dr. Martín Ríos",
    especialidadId: "e3",
    rut: "16.789.012-3",
    email: "mrios@happysmile.cl",
    telefono: "+56 9 6543 2109",
    horario: "Mar-Vie 08:00-17:00",
    comision: 42,
    bio: "Endodoncista microscópico con foco en preservación dental.",
    credenciales: "Cirujano Dentista UDP · Especialista en Endodoncia",
  },
  {
    id: "p4",
    nombre: "Dra. Paula Morales",
    especialidadId: "e5",
    rut: "13.456.789-0",
    email: "pmorales@happysmile.cl",
    telefono: "+56 9 5432 1098",
    horario: "Lun-Vie 08:30-17:30",
    comision: 35,
    bio: "Odontóloga general enfocada en prevención y odontopediatría.",
    credenciales: "Cirujano Dentista U. Mayor · Diplomada en Odontopediatría",
  },
];

export const pacientes: Paciente[] = [
  {
    id: "pa1",
    nombre: "María González",
    rut: "17.234.567-8",
    email: "maria.gonzalez@mail.cl",
    telefono: "+56 9 1111 2222",
    fechaNacimiento: "1990-04-12",
    ficha: "HS-0001",
  },
  {
    id: "pa2",
    nombre: "Ana Rodríguez",
    rut: "18.345.678-9",
    email: "ana.rodriguez@mail.cl",
    telefono: "+56 9 2222 3333",
    fechaNacimiento: "1985-08-25",
    ficha: "HS-0002",
  },
  {
    id: "pa3",
    nombre: "Carlos Muñoz",
    rut: "15.456.789-K",
    email: "carlos.munoz@mail.cl",
    telefono: "+56 9 3333 4444",
    fechaNacimiento: "1978-11-03",
    ficha: "HS-0003",
  },
  {
    id: "pa4",
    nombre: "Javiera Pérez",
    rut: "19.567.890-1",
    email: "javiera.perez@mail.cl",
    telefono: "+56 9 4444 5555",
    fechaNacimiento: "1995-02-18",
    ficha: "HS-0004",
  },
  {
    id: "pa5",
    nombre: "Pedro Soto",
    rut: "16.678.901-2",
    email: "pedro.soto@mail.cl",
    telefono: "+56 9 5555 6666",
    fechaNacimiento: "1982-07-30",
    ficha: "HS-0005",
  },
];

const today = new Date();
const dISO = (offsetDays: number, hour = 10, min = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};
const dayISO = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const citas: Cita[] = [
  {
    id: "c1",
    pacienteId: "pa1",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(2, 10, 0),
    duracionMin: 60,
    box: "Box 1",
    estado: "Confirmada",
  },
  {
    id: "c2",
    pacienteId: "pa1",
    profesionalId: "p2",
    especialidadId: "e2",
    fechaISO: dISO(9, 15, 30),
    duracionMin: 45,
    box: "Box 2",
    estado: "Pendiente",
  },
  {
    id: "c3",
    pacienteId: "pa2",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(1, 11, 0),
    duracionMin: 60,
    box: "Box 1",
    estado: "Confirmada",
  },
  {
    id: "c4",
    pacienteId: "pa3",
    profesionalId: "p3",
    especialidadId: "e3",
    fechaISO: dISO(3, 9, 0),
    duracionMin: 90,
    box: "Box 3",
    estado: "Confirmada",
  },
  {
    id: "c5",
    pacienteId: "pa4",
    profesionalId: "p4",
    especialidadId: "e5",
    fechaISO: dISO(0, 16, 0),
    duracionMin: 30,
    box: "Box 4",
    estado: "Confirmada",
  },
  {
    id: "c6",
    pacienteId: "pa5",
    profesionalId: "p2",
    especialidadId: "e2",
    fechaISO: dISO(5, 14, 0),
    duracionMin: 45,
    box: "Box 2",
    estado: "Confirmada",
  },
  {
    id: "c7",
    pacienteId: "pa1",
    profesionalId: "p4",
    especialidadId: "e5",
    fechaISO: dISO(-7, 10, 0),
    duracionMin: 30,
    box: "Box 4",
    estado: "Completada",
  },
  {
    id: "c8",
    pacienteId: "pa2",
    profesionalId: "p3",
    especialidadId: "e3",
    fechaISO: dISO(7, 13, 0),
    duracionMin: 90,
    box: "Box 3",
    estado: "Pendiente",
  },
  {
    id: "c9",
    pacienteId: "pa3",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(4, 16, 30),
    duracionMin: 60,
    box: "Box 1",
    estado: "Confirmada",
  },
  {
    id: "c10",
    pacienteId: "pa4",
    profesionalId: "p2",
    especialidadId: "e2",
    fechaISO: dISO(11, 11, 0),
    duracionMin: 45,
    box: "Box 2",
    estado: "Confirmada",
  },
  {
    id: "c11",
    pacienteId: "pa5",
    profesionalId: "p4",
    especialidadId: "e5",
    fechaISO: dISO(-3, 9, 30),
    duracionMin: 30,
    box: "Box 4",
    estado: "Completada",
  },
  {
    id: "c12",
    pacienteId: "pa2",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(13, 10, 0),
    duracionMin: 60,
    box: "Box 1",
    estado: "Confirmada",
  },
  {
    id: "c13",
    pacienteId: "pa1",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(-14, 11, 0),
    duracionMin: 60,
    box: "Box 1",
    estado: "Completada",
  },
  {
    id: "c14",
    pacienteId: "pa3",
    profesionalId: "p3",
    especialidadId: "e3",
    fechaISO: dISO(-1, 17, 0),
    duracionMin: 90,
    box: "Box 3",
    estado: "Cancelada",
  },
  {
    id: "c15",
    pacienteId: "pa4",
    profesionalId: "p1",
    especialidadId: "e1",
    fechaISO: dISO(6, 12, 0),
    duracionMin: 60,
    box: "Box 1",
    estado: "Confirmada",
  },
];

const buildCuotas = (
  total: number,
  n: number,
  pagadas: number,
  primeraVencISO: string,
): Cuota[] => {
  const monto = Math.round(total / n);
  const out: Cuota[] = [];
  const base = new Date(primeraVencISO);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setMonth(d.getMonth() + i);
    let estado: EstadoCuota = "Pendiente";
    if (i < pagadas) estado = "Pagado";
    else if (d < today) estado = "Vencido";
    out.push({ numero: i + 1, monto, vencimiento: d.toISOString().slice(0, 10), estado });
  }
  return out;
};

export const tratamientos: Tratamiento[] = [
  {
    id: "t1",
    pacienteId: "pa1",
    profesionalId: "p1",
    especialidadId: "e1",
    nombre: "Implante unitario premolar superior",
    fechaInicio: dayISO(-60),
    fechaFinEstim: dayISO(60),
    estado: "En curso",
    costoTotal: 1450000,
    cuotas: buildCuotas(1450000, 6, 3, dayISO(-60)),
    etapas: [
      { nombre: "Evaluación inicial y TAC", completada: true },
      { nombre: "Instalación del implante", completada: true },
      { nombre: "Osteointegración (3 meses)", completada: false },
      { nombre: "Instalación de pilar y corona", completada: false },
    ],
    notas: "Paciente con buena respuesta. Próximo control en 4 semanas.",
  },
  {
    id: "t2",
    pacienteId: "pa1",
    profesionalId: "p4",
    especialidadId: "e5",
    nombre: "Limpieza y profilaxis",
    fechaInicio: dayISO(-7),
    estado: "Completado",
    costoTotal: 45000,
    cuotas: buildCuotas(45000, 1, 1, dayISO(-7)),
    etapas: [{ nombre: "Limpieza completa", completada: true }],
    notas: "Sin observaciones.",
  },
  {
    id: "t3",
    pacienteId: "pa2",
    profesionalId: "p2",
    especialidadId: "e2",
    nombre: "Ortodoncia con brackets metálicos",
    fechaInicio: dayISO(-120),
    fechaFinEstim: dayISO(540),
    estado: "En curso",
    costoTotal: 2200000,
    cuotas: buildCuotas(2200000, 24, 4, dayISO(-120)),
    etapas: [
      { nombre: "Estudio cefalométrico", completada: true },
      { nombre: "Instalación de brackets", completada: true },
      { nombre: "Controles mensuales", completada: false },
      { nombre: "Retiro y contención", completada: false },
    ],
    notas: "Próximo control de arco en 30 días.",
  },
  {
    id: "t4",
    pacienteId: "pa3",
    profesionalId: "p3",
    especialidadId: "e3",
    nombre: "Endodoncia molar inferior",
    fechaInicio: dayISO(-30),
    estado: "En curso",
    costoTotal: 280000,
    cuotas: buildCuotas(280000, 3, 1, dayISO(-30)),
    etapas: [
      { nombre: "Apertura cameral", completada: true },
      { nombre: "Conductometría", completada: false },
      { nombre: "Obturación final", completada: false },
    ],
    notas: "Pieza 36 con sintomatología leve.",
  },
  {
    id: "t5",
    pacienteId: "pa4",
    profesionalId: "p2",
    especialidadId: "e2",
    nombre: "Alineadores invisibles",
    fechaInicio: dayISO(-15),
    fechaFinEstim: dayISO(360),
    estado: "En curso",
    costoTotal: 2500000,
    cuotas: buildCuotas(2500000, 12, 1, dayISO(-15)),
    etapas: [
      { nombre: "Escaneo digital", completada: true },
      { nombre: "Entrega aligners fase 1", completada: false },
    ],
    notas: "",
  },
  {
    id: "t6",
    pacienteId: "pa5",
    profesionalId: "p4",
    especialidadId: "e5",
    nombre: "Tapaduras compuestas (3 piezas)",
    fechaInicio: dayISO(-45),
    estado: "Completado",
    costoTotal: 180000,
    cuotas: buildCuotas(180000, 3, 3, dayISO(-45)),
    etapas: [{ nombre: "Sesión única", completada: true }],
    notas: "",
  },
  {
    id: "t7",
    pacienteId: "pa3",
    profesionalId: "p1",
    especialidadId: "e1",
    nombre: "Carga inmediata sobre 2 implantes",
    fechaInicio: dayISO(-10),
    fechaFinEstim: dayISO(120),
    estado: "En curso",
    costoTotal: 2350000,
    cuotas: buildCuotas(2350000, 10, 1, dayISO(-10)),
    etapas: [
      { nombre: "Cirugía de implantes", completada: true },
      { nombre: "Prótesis provisional", completada: false },
      { nombre: "Prótesis definitiva", completada: false },
    ],
    notas: "",
  },
];

export const materiales: Material[] = [
  {
    id: "m1",
    nombre: "Anestesia lidocaína 2%",
    categoria: "Anestesia",
    unidad: "Tubo",
    stock: 8,
    stockMin: 20,
    precioUnit: 1200,
    proveedor: "DentalChile",
  },
  {
    id: "m2",
    nombre: "Guantes nitrilo M",
    categoria: "Insumos clínicos",
    unidad: "Caja x100",
    stock: 12,
    stockMin: 5,
    precioUnit: 8500,
    proveedor: "MediSupply",
  },
  {
    id: "m3",
    nombre: "Composite A2",
    categoria: "Restauración",
    unidad: "Jeringa",
    stock: 6,
    stockMin: 4,
    precioUnit: 22000,
    proveedor: "3M Chile",
  },
  {
    id: "m4",
    nombre: "Implante titanio 4.0mm",
    categoria: "Implantología",
    unidad: "Unidad",
    stock: 3,
    stockMin: 5,
    precioUnit: 145000,
    proveedor: "Straumann",
  },
  {
    id: "m5",
    nombre: "Brackets metálicos kit",
    categoria: "Ortodoncia",
    unidad: "Kit",
    stock: 14,
    stockMin: 6,
    precioUnit: 38000,
    proveedor: "Ortho Organizers",
  },
  {
    id: "m6",
    nombre: "Limas K endodoncia",
    categoria: "Endodoncia",
    unidad: "Pack x6",
    stock: 22,
    stockMin: 10,
    precioUnit: 12500,
    proveedor: "Maillefer",
  },
  {
    id: "m7",
    nombre: "Hilo retractor",
    categoria: "Insumos clínicos",
    unidad: "Rollo",
    stock: 4,
    stockMin: 3,
    precioUnit: 9800,
    proveedor: "Ultradent",
  },
  {
    id: "m8",
    nombre: "Pasta profiláctica",
    categoria: "Higiene",
    unidad: "Bote",
    stock: 9,
    stockMin: 4,
    precioUnit: 6500,
    proveedor: "DentalChile",
  },
  {
    id: "m9",
    nombre: "Mascarillas quirúrgicas",
    categoria: "EPP",
    unidad: "Caja x50",
    stock: 18,
    stockMin: 10,
    precioUnit: 4500,
    proveedor: "MediSupply",
  },
  {
    id: "m10",
    nombre: "Suero fisiológico",
    categoria: "Insumos clínicos",
    unidad: "Botella 500ml",
    stock: 25,
    stockMin: 12,
    precioUnit: 2200,
    proveedor: "B. Braun",
  },
];

const gISO = (monthsBack: number, day: number) => {
  const d = new Date(today);
  d.setMonth(d.getMonth() - monthsBack);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
};

export const gastos: Gasto[] = [
  {
    id: "g1",
    fecha: gISO(0, 3),
    categoria: "Materiales",
    descripcion: "Reposición composites e insumos",
    monto: 480000,
    comprobante: "F-1024",
  },
  {
    id: "g2",
    fecha: gISO(0, 5),
    categoria: "Arriendo",
    descripcion: "Arriendo local Providencia",
    monto: 1850000,
    comprobante: "F-1025",
  },
  {
    id: "g3",
    fecha: gISO(0, 7),
    categoria: "Servicios básicos",
    descripcion: "Luz, agua, internet",
    monto: 320000,
    comprobante: "F-1026",
  },
  {
    id: "g4",
    fecha: gISO(0, 30),
    categoria: "Sueldos",
    descripcion: "Sueldos equipo administrativo",
    monto: 4200000,
    comprobante: "F-1027",
  },
  {
    id: "g5",
    fecha: gISO(1, 3),
    categoria: "Materiales",
    descripcion: "Implantes y aditamentos",
    monto: 720000,
    comprobante: "F-0987",
  },
  {
    id: "g6",
    fecha: gISO(1, 5),
    categoria: "Arriendo",
    descripcion: "Arriendo local Providencia",
    monto: 1850000,
    comprobante: "F-0988",
  },
  {
    id: "g7",
    fecha: gISO(1, 18),
    categoria: "Otros",
    descripcion: "Mantención sillón dental",
    monto: 240000,
    comprobante: "F-0995",
  },
  {
    id: "g8",
    fecha: gISO(1, 30),
    categoria: "Sueldos",
    descripcion: "Sueldos equipo administrativo",
    monto: 4200000,
    comprobante: "F-0996",
  },
  {
    id: "g9",
    fecha: gISO(2, 3),
    categoria: "Materiales",
    descripcion: "Material de ortodoncia",
    monto: 390000,
    comprobante: "F-0950",
  },
  {
    id: "g10",
    fecha: gISO(2, 5),
    categoria: "Arriendo",
    descripcion: "Arriendo local Providencia",
    monto: 1850000,
    comprobante: "F-0951",
  },
  {
    id: "g11",
    fecha: gISO(2, 7),
    categoria: "Servicios básicos",
    descripcion: "Luz, agua, internet",
    monto: 295000,
    comprobante: "F-0952",
  },
  {
    id: "g12",
    fecha: gISO(2, 30),
    categoria: "Sueldos",
    descripcion: "Sueldos equipo administrativo",
    monto: 4200000,
    comprobante: "F-0960",
  },
];

// Sesión actual mock por portal
export const pacienteActualId = "pa1";
export const profesionalActualId = "p1";

// Testimonios
export const testimonios = [
  {
    id: "ts1",
    nombre: "Constanza M.",
    texto: "El equipo de Happy Smile cambió mi sonrisa y mi autoestima. Atención impecable.",
    estrellas: 5,
  },
  {
    id: "ts2",
    nombre: "Felipe R.",
    texto: "Excelente experiencia con mi tratamiento de implantes. Muy recomendados.",
    estrellas: 5,
  },
  {
    id: "ts3",
    nombre: "Antonia L.",
    texto: "Profesionales cercanos y modernos. Las consultas son rápidas y claras.",
    estrellas: 5,
  },
];
