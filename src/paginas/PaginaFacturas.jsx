import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Receipt, Plus, MagnifyingGlass, PencilSimple, Trash, Eye } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { servicioFacturas } from "../servicios/servicioFacturas";

const ITEMS_POR_PAGINA = 10;

const formatEUR = (valor) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor || 0) + " €";

const badgeEstado = (estado) => {
  switch (estado) {
    case "pagado":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "parcial":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "pendiente":
    default:
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
};

const etiquetaEstado = (estado) => {
  switch (estado) {
    case "pagado":   return "Pagado";
    case "parcial":  return "Parcial";
    case "pendiente":
    default:         return "Pendiente";
  }
};

const PaginaFacturas = () => {
  const navigate = useNavigate();

  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    montoTotal: 0,
    pagadas: 0,
  });

  const cargarFacturas = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioFacturas.obtenerTodos(termino ? { termino } : {});
      setFacturas(datos);
      setStats({
        total: datos.length,
        pendientes: datos.filter((f) => f.estadoPago === "pendiente" || !f.estadoPago).length,
        montoTotal: datos.reduce((s, f) => s + (f.total || 0), 0),
        pagadas: datos.filter((f) => f.estadoPago === "pagado").length,
      });
    } catch (err) {
      console.error("Error al cargar facturas:", err);
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarFacturas(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioFacturas.eliminar(id);
      cargarFacturas(busqueda);
    } catch (err) {
      console.error("Error al eliminar factura:", err);
    }
  };

  const totalPaginas = Math.ceil(facturas.length / ITEMS_POR_PAGINA);
  const facturasPagina = facturas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Gestion de Facturas
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra las facturas del taller
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to="/dashboard/facturas/nueva">
            <Plus weight="bold" className="mr-2 size-4" />
            Nueva Factura
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Pendientes de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500 font-[family-name:var(--fuente-datos)]">
              {stats.pendientes}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Monto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
              {formatEUR(stats.montoTotal)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500 font-[family-name:var(--fuente-datos)]">
              {stats.pagadas}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por numero, cliente..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando facturas...
            </div>
          ) : facturas.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay facturas registradas
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Numero</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Cliente</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Servicios</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">Total</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado Pago</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Fecha</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturasPagina.map((factura) => (
                    <TableRow
                      key={factura.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium font-[family-name:var(--fuente-datos)]">
                        {factura.numero || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {factura.clienteNombre || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {Array.isArray(factura.servicios)
                          ? factura.servicios.length
                          : factura.servicios ?? "-"}
                      </TableCell>
                      <TableCell className="text-right text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                        {formatEUR(factura.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={badgeEstado(factura.estadoPago)}
                          variant="outline"
                        >
                          {etiquetaEstado(factura.estadoPago)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                        {factura.fecha
                          ? new Date(factura.fecha).toLocaleDateString("es-ES")
                          : factura.creadoEn
                          ? new Date(factura.creadoEn).toLocaleDateString("es-ES")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Ver detalle"
                            onClick={() =>
                              navigate(`/dashboard/facturas/${factura.id}`)
                            }
                          >
                            <Eye className="size-4 text-[var(--texto-deshabilitado)]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() =>
                              navigate(
                                `/dashboard/facturas/editar/${factura.id}`
                              )
                            }
                          >
                            <PencilSimple className="size-4 text-[var(--texto-deshabilitado)]" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon-sm" title="Eliminar">
                                <Trash className="size-4 text-[var(--peligro)]" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Eliminar factura
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara
                                  permanentemente la factura{" "}
                                  <strong>{factura.numero || factura.id}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(factura.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--borde)]">
                  <p className="text-sm text-[var(--texto-deshabilitado)]">
                    Pagina {paginaActual} de {totalPaginas}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                      className="border-[var(--borde)] text-[var(--texto-principal)]"
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                      disabled={paginaActual === totalPaginas}
                      className="border-[var(--borde)] text-[var(--texto-principal)]"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaFacturas;
