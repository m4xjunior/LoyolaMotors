
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockInvoices } from '../data/mockData';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ── Estilos inspirados en shadcn/ui ────────────────────────────
const styles = {
  page: {
    paddingTop: '40px',
    paddingBottom: '100px',
  },

  /* ── Cards de resumo ── */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: '-0.01em',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  statSub: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '2px',
  },

  /* ── Toolbar (busca + filtros + acoes) ── */
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flex: 1,
    minWidth: '280px',
  },
  searchInput: {
    height: '40px',
    padding: '0 14px 0 38px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    background: '#fff',
    outline: 'none',
    width: '100%',
    maxWidth: '320px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    maxWidth: '320px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  filterBtn: (active) => ({
    height: '40px',
    padding: '0 16px',
    border: active ? '1px solid var(--primary-color, #ff3d24)' : '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: active ? 'var(--primary-color, #ff3d24)' : '#6b7280',
    background: active ? 'rgba(255,61,36,0.06)' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  }),
  newBtn: {
    height: '40px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    background: 'var(--primary-color, #ff3d24)',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'opacity 0.15s',
    whiteSpace: 'nowrap',
  },

  /* ── Tabela ── */
  tableWrapper: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid #f3f4f6',
    background: '#fafafa',
  },
  thRight: {
    padding: '12px 20px',
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid #f3f4f6',
    background: '#fafafa',
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  },
  tdBold: {
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    borderBottom: '1px solid #f3f4f6',
  },
  tdRight: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    textAlign: 'right',
  },
  trHover: {
    transition: 'background 0.1s',
    cursor: 'pointer',
  },

  /* ── Badge de status ── */
  badge: (status) => {
    const map = {
      pagada:    { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Pagada' },
      pendiente: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pendiente' },
      vencida:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Vencida' },
    };
    const s = map[status] || map.pendiente;
    return {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        letterSpacing: '-0.01em',
      },
      label: s.label,
      dot: s.color,
    };
  },

  /* ── Paginacao ── */
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderTop: '1px solid #f3f4f6',
    background: '#fafafa',
    fontSize: '13px',
    color: '#6b7280',
  },
  pageBtn: (disabled) => ({
    height: '32px',
    padding: '0 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: disabled ? '#d1d5db' : '#374151',
    background: '#fff',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }),

  /* ── Link de acao ── */
  actionLink: {
    color: 'var(--primary-color, #ff3d24)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'background 0.1s',
    display: 'inline-block',
  },

  /* ── Empty state ── */
  empty: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
};

// ── Componente principal ───────────────────────────────────────
const InvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  // ── Filtros ──
  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.number.toLowerCase().includes(search.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.clientCIF.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todas' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  // ── Paginacao ──
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  // ── Stats ──
  const stats = useMemo(() => {
    const total = invoices.reduce((s, i) => s + i.total, 0);
    const pagadas = invoices.filter(i => i.status === 'pagada');
    const pendientes = invoices.filter(i => i.status === 'pendiente');
    const vencidas = invoices.filter(i => i.status === 'vencida');
    const cobrado = pagadas.reduce((s, i) => s + i.total, 0);
    const porCobrar = pendientes.reduce((s, i) => s + i.total, 0);
    return { total: invoices.length, facturado: total, cobrado, porCobrar, vencidas: vencidas.length };
  }, [invoices]);

  return (
    <>
      <CommonPageHero title="Facturas" />
      <div className="container" style={styles.page}>

        {/* ── Cards de resumo ── */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Facturado</span>
            <span style={styles.statValue}>{stats.facturado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
            <span style={styles.statSub}>{stats.total} facturas emitidas</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Cobrado</span>
            <span style={{ ...styles.statValue, color: '#059669' }}>{stats.cobrado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
            <span style={styles.statSub}>Facturas pagadas</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Por Cobrar</span>
            <span style={{ ...styles.statValue, color: '#d97706' }}>{stats.porCobrar.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
            <span style={styles.statSub}>Pendientes de pago</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Vencidas</span>
            <span style={{ ...styles.statValue, color: '#dc2626' }}>{stats.vencidas}</span>
            <span style={styles.statSub}>Requieren atención</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Buscar por número, cliente o CIF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color, #ff3d24)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,61,36,0.08)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {['todas', 'pagada', 'pendiente', 'vencida'].map(s => (
              <button
                key={s}
                style={styles.filterBtn(statusFilter === s)}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'todas' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
                {s !== 'todas' && (
                  <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                    ({invoices.filter(i => i.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <Link to="/create-invoice" style={styles.newBtn}>
            + Nueva Factura
          </Link>
        </div>

        {/* ── Tabela ── */}
        <div style={styles.tableWrapper}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Factura</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.thRight}>Total</th>
                  <th style={styles.thRight}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={styles.empty}>
                      {search || statusFilter !== 'todas'
                        ? 'No se encontraron facturas con esos filtros.'
                        : 'No hay facturas registradas.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map((invoice) => {
                    const badge = styles.badge(invoice.status);
                    return (
                      <tr
                        key={invoice.id}
                        style={styles.trHover}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => navigate(`/invoice/${invoice.id}`)}
                      >
                        <td style={styles.tdBold}>
                          <span style={{ color: '#6b7280', fontWeight: 400, marginRight: '4px' }}>#</span>
                          {invoice.number}
                        </td>
                        <td style={styles.td}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{invoice.clientName}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{invoice.clientCIF}</div>
                        </td>
                        <td style={styles.td}>
                          {format(invoice.date, "dd MMM yyyy", { locale: es })}
                        </td>
                        <td style={styles.td}>
                          <span style={badge.style}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.dot }} />
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ ...styles.tdRight, fontWeight: '600', color: '#111827' }}>
                          {invoice.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                        </td>
                        <td style={styles.tdRight} onClick={(e) => e.stopPropagation()}>
                          <Link
                            to={`/invoice/${invoice.id}`}
                            style={styles.actionLink}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,61,36,0.06)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Paginacao ── */}
          {filtered.length > perPage && (
            <div style={styles.pagination}>
              <span>
                Mostrando {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} de {filtered.length}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  style={styles.pageBtn(currentPage === 1)}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <button
                  style={styles.pageBtn(currentPage === totalPages)}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default InvoicesPage;
