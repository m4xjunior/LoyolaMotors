
// This file will act as a mock database based on the prisma schema.

export const mockUsers = [
  {
    id: 'clxmjm8py000008l3g6f8h2j2',
    email: 'admin@loyolamotors.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
];

export const mockInvoices = [
  {
    id: 'inv_001',
    number: 'FAC-2024-001',
    date: new Date('2024-07-20T00:00:00.000Z'),
    dueDate: new Date('2024-08-19T00:00:00.000Z'),
    clientName: 'Cliente de Ejemplo S.L.',
    clientCIF: 'B12345678',
    clientEmail: 'facturacion@cliente-ejemplo.es',
    subtotal: 1000.0,
    iva: 210.0,
    total: 1210.0,
    status: 'pagada',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_002',
    number: 'FAC-2024-002',
    date: new Date('2024-07-21T00:00:00.000Z'),
    dueDate: new Date('2024-08-21T00:00:00.000Z'),
    clientName: 'Otro Cliente S.A.',
    clientCIF: 'A87654321',
    clientEmail: 'admin@otrocliente.es',
    subtotal: 620.25,
    iva: 130.25,
    total: 750.5,
    status: 'pendiente',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_003',
    number: 'FAC-2024-003',
    date: new Date('2024-07-22T00:00:00.000Z'),
    dueDate: new Date('2024-08-02T00:00:00.000Z'),
    clientName: 'Compañía Ficticia',
    clientCIF: 'C11223344',
    clientEmail: 'contabilidad@ficticia.es',
    subtotal: 264.46,
    iva: 55.54,
    total: 320.0,
    status: 'vencida',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_004',
    number: 'FAC-2024-004',
    date: new Date('2024-08-05T00:00:00.000Z'),
    dueDate: new Date('2024-09-04T00:00:00.000Z'),
    clientName: 'Taller Hermanos Lopez',
    clientCIF: 'B55667788',
    clientEmail: 'taller@hermanoslopez.es',
    subtotal: 1850.0,
    iva: 388.5,
    total: 2238.5,
    status: 'pagada',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_005',
    number: 'FAC-2024-005',
    date: new Date('2024-08-12T00:00:00.000Z'),
    dueDate: new Date('2024-09-11T00:00:00.000Z'),
    clientName: 'Maria Garcia Ruiz',
    clientCIF: '12345678A',
    clientEmail: 'maria.garcia@email.com',
    subtotal: 450.0,
    iva: 94.5,
    total: 544.5,
    status: 'pendiente',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_006',
    number: 'FAC-2024-006',
    date: new Date('2024-08-18T00:00:00.000Z'),
    dueDate: new Date('2024-08-28T00:00:00.000Z'),
    clientName: 'Servicios Costa Norte',
    clientCIF: 'B33445566',
    clientEmail: 'oficina@costanorte.es',
    subtotal: 960.0,
    iva: 201.6,
    total: 1161.6,
    status: 'vencida',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_007',
    number: 'FAC-2024-007',
    date: new Date('2024-08-22T00:00:00.000Z'),
    dueDate: new Date('2024-09-21T00:00:00.000Z'),
    clientName: 'Auto Recambios Levante',
    clientCIF: 'B77889900',
    clientEmail: 'compras@autorecambioslevante.es',
    subtotal: 1320.0,
    iva: 277.2,
    total: 1597.2,
    status: 'pagada',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
];

export const mockInvoiceItems = [
  { id: 'item_1', invoiceId: 'inv_001', description: 'Reparación de motor', quantity: 1, unitPrice: 1000, amount: 1000 },
  { id: 'item_2', invoiceId: 'inv_001', description: 'IVA (21%)', quantity: 1, unitPrice: 210, amount: 210 },
  { id: 'item_3', invoiceId: 'inv_002', description: 'Cambio de aceite y filtros', quantity: 1, unitPrice: 620, amount: 620 },
  { id: 'item_4', invoiceId: 'inv_002', description: 'IVA (21%)', quantity: 1, unitPrice: 130.5, amount: 130.5 },
  { id: 'item_5', invoiceId: 'inv_003', description: 'Revisión de frenos', quantity: 1, unitPrice: 264.46, amount: 264.46 },
  { id: 'item_6', invoiceId: 'inv_003', description: 'IVA (21%)', quantity: 1, unitPrice: 55.54, amount: 55.54 },
  { id: 'item_7', invoiceId: 'inv_004', description: 'Pintura lateral completa', quantity: 1, unitPrice: 1850, amount: 1850 },
  { id: 'item_8', invoiceId: 'inv_005', description: 'Sustitución de bateria', quantity: 1, unitPrice: 450, amount: 450 },
  { id: 'item_9', invoiceId: 'inv_006', description: 'Cambio de amortiguadores', quantity: 1, unitPrice: 960, amount: 960 },
  { id: 'item_10', invoiceId: 'inv_007', description: 'Kit de embrague y mano de obra', quantity: 1, unitPrice: 1320, amount: 1320 },
];

// Function to add a new invoice
export const addInvoice = (invoice) => {
  const emissionDate = new Date();
  const dueDate = new Date(emissionDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const newInvoice = {
    ...invoice,
    id: `inv_${Date.now()}`,
    date: emissionDate,
    dueDate,
    status: invoice.status || 'pendiente',
    clientEmail: invoice.clientEmail || '',
  };
  mockInvoices.push(newInvoice);
  return newInvoice;
};
