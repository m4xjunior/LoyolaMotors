// Mock data for customers
export const mockCustomers = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'García López',
    email: 'juan.garcia@email.com',
    telefono: '+34 666 123 456',
    direccion: 'Calle Valencia 123, 2º A',
    ciudad: 'Valencia',
    codigoPostal: '46001',
    fechaRegistro: new Date('2024-01-15'),
    activo: true,
    notas: 'Cliente VIP - Descuento 10%',
    tipo: 'VIP',
    descuento: 10,
    vehiculosCount: 2,
    coordenadas: { lat: 39.4699, lng: -0.3763 }
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'Rodríguez Martín',
    email: 'maria.rodriguez@email.com',
    telefono: '+34 677 234 567',
    direccion: 'Avenida del Puerto 45',
    ciudad: 'Valencia',
    codigoPostal: '46011',
    fechaRegistro: new Date('2024-02-20'),
    activo: true,
    notas: 'Prefiere citas por la mañana',
    tipo: 'Regular',
    descuento: 0,
    vehiculosCount: 1,
    coordenadas: { lat: 39.4751, lng: -0.3828 }
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'Fernández Ruiz',
    email: 'carlos.fernandez@email.com',
    telefono: '+34 688 345 678',
    direccion: 'Calle Colón 78, 1º B',
    ciudad: 'Valencia',
    codigoPostal: '46004',
    fechaRegistro: new Date('2024-03-10'),
    activo: true,
    notas: 'Cliente empresarial - Flota de 3 vehículos',
    tipo: 'Empresarial',
    descuento: 15,
    vehiculosCount: 3,
    coordenadas: { lat: 39.4668, lng: -0.3762 }
  },
  {
    id: '4',
    nombre: 'Ana',
    apellidos: 'López Sánchez',
    email: 'ana.lopez@email.com',
    telefono: '+34 699 456 789',
    direccion: 'Plaza del Ayuntamiento 12',
    ciudad: 'Valencia',
    codigoPostal: '46002',
    fechaRegistro: new Date('2024-04-05'),
    activo: true,
    notas: 'Recomendada por Juan García',
    tipo: 'Regular',
    descuento: 5,
    vehiculosCount: 1,
    coordenadas: { lat: 39.4736, lng: -0.3754 }
  },
  {
    id: '5',
    nombre: 'Pedro',
    apellidos: 'Martínez González',
    email: 'pedro.martinez@email.com',
    telefono: '+34 610 567 890',
    direccion: 'Calle Xàtiva 156',
    ciudad: 'Valencia',
    codigoPostal: '46007',
    fechaRegistro: new Date('2024-05-12'),
    activo: true,
    notas: 'Especialista en vehículos clásicos',
    tipo: 'Especial',
    descuento: 0,
    vehiculosCount: 1,
    coordenadas: { lat: 39.4622, lng: -0.3707 }
  }
];

// Mock data for vehicles
export const mockVehicles = [
  {
    id: '1',
    clienteId: '1',
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
    matricula: '1234ABC',
    vin: 'JT2BF28K0X0123456',
    color: 'Blanco',
    kilometraje: 45000,
    fechaRegistro: new Date('2024-01-15'),
    activo: true
  },
  {
    id: '2',
    clienteId: '1',
    marca: 'Honda',
    modelo: 'Civic',
    año: 2019,
    matricula: '5678DEF',
    vin: '2HGFC2F59JH123456',
    color: 'Azul',
    kilometraje: 52000,
    fechaRegistro: new Date('2024-01-15'),
    activo: true
  },
  {
    id: '3',
    clienteId: '2',
    marca: 'Volkswagen',
    modelo: 'Golf',
    año: 2021,
    matricula: '9012GHI',
    vin: 'WVWZZZ1JZ3W123456',
    color: 'Rojo',
    kilometraje: 28000,
    fechaRegistro: new Date('2024-02-20'),
    activo: true
  },
  {
    id: '4',
    clienteId: '3',
    marca: 'Ford',
    modelo: 'Focus',
    año: 2018,
    matricula: '3456JKL',
    vin: '1FADP3F26JL123456',
    color: 'Negro',
    kilometraje: 68000,
    fechaRegistro: new Date('2024-03-10'),
    activo: true
  },
  {
    id: '5',
    clienteId: '3',
    marca: 'Ford',
    modelo: 'Transit',
    año: 2020,
    matricula: '7890MNO',
    vin: '1FTBW2CM6LKA12345',
    color: 'Blanco',
    kilometraje: 85000,
    fechaRegistro: new Date('2024-03-10'),
    activo: true
  },
  {
    id: '6',
    clienteId: '3',
    marca: 'Ford',
    modelo: 'Fiesta',
    año: 2019,
    matricula: '2468PQR',
    vin: '3FADP4BJ3KM123456',
    color: 'Gris',
    kilometraje: 42000,
    fechaRegistro: new Date('2024-03-10'),
    activo: true
  },
  {
    id: '7',
    clienteId: '4',
    marca: 'Seat',
    modelo: 'León',
    año: 2022,
    matricula: '1357STU',
    vin: 'VSSZZZ5FZ3R123456',
    color: 'Blanco',
    kilometraje: 15000,
    fechaRegistro: new Date('2024-04-05'),
    activo: true
  },
  {
    id: '8',
    clienteId: '5',
    marca: 'BMW',
    modelo: 'Serie 3',
    año: 1995,
    matricula: '9753VWX',
    vin: 'WBABA53090A123456',
    color: 'Azul Oscuro',
    kilometraje: 180000,
    fechaRegistro: new Date('2024-05-12'),
    activo: true
  }
];

// Mock data for service history
export const mockServiceHistory = [
  {
    id: '1',
    clienteId: '1',
    vehiculoId: '1',
    tipoServicio: 'Mantenimiento',
    descripcion: 'Cambio de aceite y filtros',
    fecha: new Date('2024-06-15'),
    kilometraje: 44500,
    costo: 85.50,
    estado: 'completado',
    tecnico: 'Miguel Ángel',
    notas: 'Todo en perfecto estado',
    facturaId: 'FAC-001'
  },
  {
    id: '2',
    clienteId: '1',
    vehiculoId: '1',
    tipoServicio: 'Reparación',
    descripcion: 'Reparación de parachoques delantero',
    fecha: new Date('2024-07-20'),
    kilometraje: 45000,
    costo: 320.00,
    estado: 'completado',
    tecnico: 'José Luis',
    notas: 'Pintura perfecta, garantía 1 año',
    facturaId: 'FAC-002'
  },
  {
    id: '3',
    clienteId: '2',
    vehiculoId: '3',
    tipoServicio: 'Chapa y Pintura',
    descripcion: 'Reparación de arañazos laterales',
    fecha: new Date('2024-08-10'),
    kilometraje: 27800,
    costo: 180.00,
    estado: 'en_proceso',
    tecnico: 'Antonio',
    notas: 'En proceso de lijado',
    facturaId: null
  },
  {
    id: '4',
    clienteId: '3',
    vehiculoId: '4',
    tipoServicio: 'Revisión Pre-ITV',
    descripcion: 'Revisión completa pre-ITV',
    fecha: new Date('2024-08-22'),
    kilometraje: 68000,
    costo: 45.00,
    estado: 'pendiente',
    tecnico: 'Miguel Ángel',
    notas: 'Programado para mañana',
    facturaId: null
  },
  {
    id: '5',
    clienteId: '4',
    vehiculoId: '7',
    tipoServicio: 'Mantenimiento',
    descripcion: 'Primera revisión - 15.000 km',
    fecha: new Date('2024-08-18'),
    kilometraje: 15000,
    costo: 120.00,
    estado: 'completado',
    tecnico: 'José Luis',
    notas: 'Vehículo en garantía',
    facturaId: 'FAC-003'
  },
  {
    id: '6',
    clienteId: '5',
    vehiculoId: '8',
    tipoServicio: 'Restauración',
    descripcion: 'Restauración de faros delanteros',
    fecha: new Date('2024-08-05'),
    kilometraje: 180000,
    costo: 95.00,
    estado: 'completado',
    tecnico: 'Antonio',
    notas: 'Faros como nuevos, mejora notable en iluminación',
    facturaId: 'FAC-004'
  }
];

// Mock data for users/technicians
export const mockUsers = [
  {
    id: '1',
    nombre: 'Miguel Ángel',
    apellidos: 'Fernández Ruiz',
    email: 'miguel.fernandez@loyolamotors.es',
    telefono: '+34 600 000 001',
    role: 'Técnico Senior',
    especialidad: 'Motor y Transmisión',
    fechaContratacion: new Date('2020-03-15'),
    activo: true,
    serviciosCompletados: 1250,
    calificacion: 4.9
  },
  {
    id: '2',
    nombre: 'José Luis',
    apellidos: 'Martínez García',
    email: 'jose.martinez@loyolamotors.es',
    telefono: '+34 600 000 002',
    role: 'Especialista en Chapa y Pintura',
    especialidad: 'Carrocería y Pintura',
    fechaContratacion: new Date('2019-08-10'),
    activo: true,
    serviciosCompletados: 890,
    calificacion: 4.8
  },
  {
    id: '3',
    nombre: 'Antonio',
    apellidos: 'López Sánchez',
    email: 'antonio.lopez@loyolamotors.es',
    telefono: '+34 600 000 003',
    role: 'Técnico en Restauración',
    especialidad: 'Vehículos Clásicos y Restauración',
    fechaContratacion: new Date('2021-01-20'),
    activo: true,
    serviciosCompletados: 340,
    calificacion: 4.7
  },
  {
    id: '4',
    nombre: 'Carlos',
    apellidos: 'Méndez González',
    email: 'carlos.mendez@loyolamotors.es',
    telefono: '+34 600 000 004',
    role: 'Jefe de Taller',
    especialidad: 'Gestión y Diagnóstico General',
    fechaContratacion: new Date('2018-05-12'),
    activo: true,
    serviciosCompletados: 2100,
    calificacion: 4.9
  },
  {
    id: '5',
    nombre: 'Admin',
    apellidos: 'Sistema',
    email: 'admin@loyolamotors.es',
    telefono: '+34 640 162 947',
    role: 'Administrador',
    especialidad: 'Gestión del Sistema',
    fechaContratacion: new Date('2018-01-01'),
    activo: true,
    serviciosCompletados: 0,
    calificacion: 5.0
  }
];

// Mock data for expanded services
export const mockServicesTypes = [
  {
    id: '1',
    nombre: 'Mantenimiento Preventivo',
    descripcion: 'Cambio de aceite, filtros, revisión general',
    precio: 85.00,
    duracion: '2 horas',
    categoria: 'Mantenimiento'
  },
  {
    id: '2',
    nombre: 'Reparación de Motor',
    descripcion: 'Diagnóstico y reparación de problemas del motor',
    precio: 450.00,
    duracion: '1-2 días',
    categoria: 'Reparación'
  },
  {
    id: '3',
    nombre: 'Chapa y Pintura',
    descripcion: 'Reparación de carrocería y repintura',
    precio: 300.00,
    duracion: '2-3 días',
    categoria: 'Carrocería'
  },
  {
    id: '4',
    nombre: 'Revisión Pre-ITV',
    descripcion: 'Revisión completa antes de la ITV',
    precio: 45.00,
    duracion: '1 hora',
    categoria: 'Revisión'
  },
  {
    id: '5',
    nombre: 'Restauración Clásicos',
    descripcion: 'Restauración especializada en vehículos clásicos',
    precio: 2500.00,
    duracion: '2-4 semanas',
    categoria: 'Restauración'
  },
  {
    id: '6',
    nombre: 'Diagnóstico Electrónico',
    descripcion: 'Diagnóstico completo con equipos especializados',
    precio: 65.00,
    duracion: '1 hora',
    categoria: 'Diagnóstico'
  }
];

