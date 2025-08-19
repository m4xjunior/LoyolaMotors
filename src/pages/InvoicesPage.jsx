
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { mockInvoices } from '../data/mockData';
import { ButtonCommon } from '../components/Button/Button';
import { format } from 'date-fns';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';

const InvoicesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from an API.
    setInvoices(mockInvoices);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <CommonPageHero title="Dashboard" />
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Facturas</h1>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#4b5563' }}>
            Lista de todas las facturas emitidas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/create-invoice" className="btn btn-primary">
            Nueva Factura
          </Link>
          <button
            onClick={handleLogout}
            className="common-btn"
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Número</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Cliente</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Fecha</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Total</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white', divideY: '1px solid #e5e7eb' }}>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{invoice.number}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{invoice.clientName}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{format(invoice.date, 'dd/MM/yyyy')}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{invoice.total.toFixed(2)} €</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', textAlign: 'right' }}>
                  <Link to={`/invoice/${invoice.id}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>
                    Ver / Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoicesPage;
