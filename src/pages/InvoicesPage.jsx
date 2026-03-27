
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockInvoices } from '../data/mockData';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// lucide-react icons
import {
  Search, Plus, MoreHorizontal, Eye, Pencil, Download, Trash2,
  TrendingUp, Clock, AlertTriangle, FileText, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────
const statusConfig = {
  pagada:    { label: 'Pagada',    variant: 'default' },
  pendiente: { label: 'Pendiente', variant: 'secondary' },
  vencida:   { label: 'Vencida',   variant: 'destructive' },
};

const formatCurrency = (value) =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €';

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

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const q = search.toLowerCase();
      const matchSearch =
        inv.number.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.clientCIF.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'todas' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  const stats = useMemo(() => {
    const pagadas = invoices.filter(i => i.status === 'pagada');
    const pendientes = invoices.filter(i => i.status === 'pendiente');
    const vencidas = invoices.filter(i => i.status === 'vencida');
    return {
      total: invoices.reduce((s, i) => s + i.total, 0),
      cobrado: pagadas.reduce((s, i) => s + i.total, 0),
      porCobrar: pendientes.reduce((s, i) => s + i.total, 0),
      vencidas: vencidas.length,
      count: invoices.length,
    };
  }, [invoices]);

  return (
    <>
      <CommonPageHero title="Facturas" />
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px' }}>

        {/* ── Cards de resumo ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturado</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.count} facturas emitidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cobrado</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{formatCurrency(stats.cobrado)}</div>
              <p className="text-xs text-muted-foreground mt-1">Facturas pagadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Por Cobrar</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{formatCurrency(stats.porCobrar)}</div>
              <p className="text-xs text-muted-foreground mt-1">Pendientes de pago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vencidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.vencidas}</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente o CIF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pagada">
                  Pagada ({invoices.filter(i => i.status === 'pagada').length})
                </TabsTrigger>
                <TabsTrigger value="pendiente">
                  Pendiente ({invoices.filter(i => i.status === 'pendiente').length})
                </TabsTrigger>
                <TabsTrigger value="vencida">
                  Vencida ({invoices.filter(i => i.status === 'vencida').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button asChild>
            <Link to="/create-invoice">
              <Plus className="h-4 w-4 mr-1" />
              Nueva Factura
            </Link>
          </Button>
        </div>

        {/* ── Tabela ── */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {search || statusFilter !== 'todas'
                      ? 'No se encontraron facturas con esos filtros.'
                      : 'No hay facturas registradas.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((invoice) => {
                  const config = statusConfig[invoice.status] || statusConfig.pendiente;
                  return (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/invoice/${invoice.id}`)}
                    >
                      <TableCell className="font-semibold">
                        <span className="text-muted-foreground font-normal">#</span>
                        {invoice.number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-xs text-muted-foreground">{invoice.clientCIF}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(invoice.date, "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/invoice/${invoice.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/invoice/${invoice.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ── Paginacao ── */}
          {filtered.length > perPage && (
            <>
              <Separator />
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} de {filtered.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

      </div>
    </>
  );
};

export default InvoicesPage;
