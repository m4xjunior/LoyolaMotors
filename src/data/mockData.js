
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
    clientName: 'Cliente de Ejemplo S.L.',
    clientCIF: 'B12345678',
    total: 1210.0,
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_002',
    number: '2024-002',
    date: new Date('2024-07-21T00:00:00.000Z'),
    clientName: 'Otro Cliente S.A.',
    clientCIF: 'A87654321',
    total: 750.5,
    userId: 'clxmjm8py000008l3g6f8h2j2',
  },
  {
    id: 'inv_003',
    number: '2024-003',
    date: new Date('2024-07-22T00:00:00.000Z'),
    clientName: 'Compañía Ficticia',
    clientCIF: 'C11223344',
    total: 320.0,
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
