import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockInvoices, mockInvoiceItems } from '../dados/dadosMock';
import CommonPageHero from '../componentes/HeroPagina/HeroPagina';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SingleInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const foundInvoice = mockInvoices.find(inv => inv.id === id);
    if (foundInvoice) {
      setInvoice(foundInvoice);
      setItems(mockInvoiceItems.filter(item => item.invoiceId === id));
    } else {
      navigate('/invoices'); // Redirect if invoice not found
    }
  }, [id, navigate]);

  if (!invoice) {
    return <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>Cargando factura...</div>;
  }

  const subtotal = invoice.subtotal ?? invoice.total / 1.21;
  const iva = invoice.iva ?? invoice.total - subtotal;
  const statusMap = {
    pagada: { label: 'Pagada', color: '#166534', background: '#dcfce7', border: '#86efac' },
    pendiente: { label: 'Pendiente', color: '#b45309', background: '#fef3c7', border: '#fcd34d' },
    vencida: { label: 'Vencida', color: '#b91c1c', background: '#fee2e2', border: '#fca5a5' },
  };
  const status = statusMap[invoice.status] || statusMap.pendiente;

  return (
    <>
      <CommonPageHero title={`Factura #${invoice.number}`} />
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '0', color: '#333' }}>Detalles de la Factura</h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: `1px solid ${status.border}`,
                backgroundColor: status.background,
                color: status.color,
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: status.color }} />
              {status.label}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <p><strong>Número de Factura:</strong> {invoice.number}</p>
              <p><strong>Fecha:</strong> {format(invoice.date, 'dd MMM yyyy', { locale: es })}</p>
              <p><strong>Vencimiento:</strong> {invoice.dueDate ? format(invoice.dueDate, 'dd MMM yyyy', { locale: es }) : 'Sin fecha'}</p>
            </div>
            <div>
              <p><strong>Cliente:</strong> {invoice.clientName}</p>
              <p><strong>CIF:</strong> {invoice.clientCIF}</p>
              <p><strong>Email:</strong> {invoice.clientEmail || 'No informado'}</p>
            </div>
          </div>

          <h3 style={{ fontSize: '22px', marginBottom: '15px', color: '#333' }}>Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Cantidad</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Precio Unitario</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.description}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.unitPrice.toFixed(2)} €</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', fontSize: '18px', color: '#333' }}>
            <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
            <p><strong>IVA (21%):</strong> {iva.toFixed(2)} €</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>Total: {invoice.total.toFixed(2)} €</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleInvoicePage;
