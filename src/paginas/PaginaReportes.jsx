import { useState, useEffect } from "react";
import { ChartLine, Plus, MagnifyingGlass, PencilSimple, Trash, DownloadSimple } from "@phosphor-icons/react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CARACTERISTICAS } from "../configuracion/caracteristicas";
import { servicioReportes } from "../servicios/servicioReportes";

const ITEMS_POR_PAGINA = 10;

const TIPOS_REPORTE = ["financiero", "servicios", "clientes", "inventario"];

const badgeTipo = (tipo) => {
  switch (tipo) {
    case "financiero":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "servicios":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "clientes":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "inventario":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const textoTipo = (tipo) => {
  const map = {
    financiero: "Financiero",
    servicios: "Servicios",
    clientes: "Clientes",
    inventario: "Inventario",
  };
  return map[tipo] || tipo;
};

const PERIODOS = ["diario", "semanal", "mensual", "anual", "personalizado"];

const reporteVacio = {
  titulo: "",
  tipo: "financiero",
  periodo: "mensual",
  exportado: false,
};

const PaginaReportes = () => {
  if (!CARACTERISTICAS.REPORTES_ACTIVOS) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <ChartLine size={64} weight="duotone" className="text-[var(--texto-deshabilitado)] mx-auto" />
            <h2 className="text-xl font-semibold text-[var(--texto-principal)]">Reportes y Exportaciones</h2>
            <p className="text-[var(--texto-secundario)]">
              Esta funcionalidad estara disponible proximamente cuando se conecte la base de datos.
            </p>
            <Badge className="bg-[var(--advertencia)]/20 text-[var(--advertencia)]">Proximamente</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, esteMes: 0, exportados: 0 });
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [reporteEdicion, setReporteEdicion] = useState(null);
  const [formulario, setFormulario] = useState(reporteVacio);
  const [guardando, setGuardando] = useState(false);

  const cargarReportes = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioReportes.obtenerTodos(termino ? { termino } : {});
      setReportes(datos);
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      setStats({
        total: datos.length,
        esteMes: datos.filter((r) => r.creadoEn && new Date(r.creadoEn) >= inicioMes).length,
        exportados: datos.filter((r) => r.exportado === true).length,
      });
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setReportes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarReportes(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioReportes.eliminar(id);
      cargarReportes(busqueda);
    } catch (err) {
      console.error("Error al eliminar reporte:", err);
    }
  };

  const handleExportar = async (reporte) => {
    try {
      await servicioReportes.actualizar(reporte.id, { ...reporte, exportado: true });
      cargarReportes(busqueda);
    } catch (err) {
      console.error("Error al exportar reporte:", err);
    }
  };

  const abrirCrear = () => {
    setReporteEdicion(null);
    setFormulario(reporteVacio);
    setDialogoAbierto(true);
  };

  const abrirEditar = (reporte) => {
    setReporteEdicion(reporte);
    setFormulario({
      titulo: reporte.titulo || "",
      tipo: reporte.tipo || "financiero",
      periodo: reporte.periodo || "mensual",
      exportado: reporte.exportado || false,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.titulo.trim()) return;
    setGuardando(true);
    try {
      if (reporteEdicion) {
        await servicioReportes.actualizar(reporteEdicion.id, formulario);
      } else {
        await servicioReportes.crear(formulario);
      }
      setDialogoAbierto(false);
      cargarReportes(busqueda);
    } catch (err) {
      console.error("Error al guardar reporte:", err);
    } finally {
      setGuardando(false);
    }
  };

  const totalPaginas = Math.ceil(reportes.length / ITEMS_POR_PAGINA);
  const reportesPagina = reportes.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      return new Date(fechaStr).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            Reportes y Exportaciones
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Genera y exporta reportes del taller
          </p>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Reporte
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.esteMes}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Exportados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{stats.exportados}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por titulo o tipo..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando reportes...
            </div>
          ) : reportes.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay reportes generados
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Titulo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Tipo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Periodo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Fecha Generacion</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportesPagina.map((reporte) => (
                    <TableRow
                      key={reporte.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {reporte.titulo}
                      </TableCell>
                      <TableCell>
                        {reporte.tipo ? (
                          <Badge variant="outline" className={badgeTipo(reporte.tipo)}>
                            {textoTipo(reporte.tipo)}
                          </Badge>
                        ) : (
                          <span className="text-[var(--texto-deshabilitado)]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)] capitalize">
                        {reporte.periodo || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {formatFecha(reporte.creadoEn)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reporte.exportado
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          }
                        >
                          {reporte.exportado ? "Exportado" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!reporte.exportado && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Exportar"
                              onClick={() => handleExportar(reporte)}
                            >
                              <DownloadSimple className="size-4 text-[var(--texto-deshabilitado)]" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() => abrirEditar(reporte)}
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
                                <AlertDialogTitle>Eliminar reporte</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara permanentemente el
                                  reporte <strong>{reporte.titulo}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(reporte.id)}
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
                      onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
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

      {/* Dialog crear/editar */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="bg-[var(--fondo-tarjeta)] border border-[var(--borde)] text-[var(--texto-principal)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--texto-principal)]">
              {reporteEdicion ? "Editar Reporte" : "Nuevo Reporte"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Titulo *</Label>
              <Input
                value={formulario.titulo}
                onChange={(e) => setFormulario((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Nombre del reporte"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Tipo</Label>
                <select
                  value={formulario.tipo}
                  onChange={(e) => setFormulario((f) => ({ ...f, tipo: e.target.value }))}
                  className="w-full h-9 rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 text-sm"
                >
                  {TIPOS_REPORTE.map((tipo) => (
                    <option key={tipo} value={tipo}>{textoTipo(tipo)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Periodo</Label>
                <select
                  value={formulario.periodo}
                  onChange={(e) => setFormulario((f) => ({ ...f, periodo: e.target.value }))}
                  className="w-full h-9 rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 text-sm capitalize"
                >
                  {PERIODOS.map((p) => (
                    <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogoAbierto(false)}
              className="border-[var(--borde)] text-[var(--texto-principal)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGuardar}
              disabled={guardando || !formulario.titulo.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : reporteEdicion ? "Guardar Cambios" : "Crear Reporte"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaReportes;
