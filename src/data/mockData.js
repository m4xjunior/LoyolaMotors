
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
    number: '2024-001',
    date: new Date('2024-07-20T00:00:00.000Z'),
    dueDate: new Date('2024-08-20T00:00:00.000Z'),
    clientName: 'Cliente de Ejemplo S.L.',
    clientCIF: 'B12345678',
    clientEmail: 'cliente@ejemplo.com',
    subtotal: 1000.0,
    iva: 210.0,
    total: 1210.0,
    status: 'pagada',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_002',
    number: '2024-002',
    date: new Date('2024-07-21T00:00:00.000Z'),
    dueDate: new Date('2024-08-21T00:00:00.000Z'),
    clientName: 'Otro Cliente S.A.',
    clientCIF: 'A87654321',
    clientEmail: 'info@otrocliente.com',
    subtotal: 620.25,
    iva: 130.25,
    total: 750.5,
    status: 'pendiente',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_003',
    number: '2024-003',
    date: new Date('2024-07-22T00:00:00.000Z'),
    dueDate: new Date('2024-08-22T00:00:00.000Z'),
    clientName: 'Compañía Ficticia',
    clientCIF: 'C11223344',
    clientEmail: 'admin@ficticia.es',
    subtotal: 264.46,
    iva: 55.54,
    total: 320.0,
    status: 'vencida',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_004',
    number: '2024-004',
    date: new Date('2024-08-05T00:00:00.000Z'),
    dueDate: new Date('2024-09-05T00:00:00.000Z'),
    clientName: 'Taller Hermanos López',
    clientCIF: 'B55667788',
    clientEmail: 'taller@hlopez.com',
    subtotal: 1850.0,
    iva: 388.50,
    total: 2238.50,
    status: 'pagada',
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_005',
    number: '2024-005',
    date: new Date('2024-08-12T00:00:00.000Z'),
    dueDate: new Date('2024-09-12T00:00:00.000Z'),
    clientName: 'María García Ruiz',
    clientCIF: '12345678A',
    clientEmail: 'maria.garcia@email.com',
    subtotal: 450.0,
    iva: 94.50,
    total: 544.50,
    status: 'pendiente',
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
];

// Function to add a new invoice
export const addInvoice = (invoice) => {
  const newInvoice = {
    ...invoice,
    id: `inv_${Date.now()}`,
    date: new Date(),
  };
  mockInvoices.push(newInvoice);
  return newInvoice;
};
