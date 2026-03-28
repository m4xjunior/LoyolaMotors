import { useState, useEffect } from "react";
import { CalendarDots, Plus, MagnifyingGlass, PencilSimple, Trash } from "@phosphor-icons/react";
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
import { servicioCitas } from "../servicios/servicioCitas";

const ITEMS_POR_PAGINA = 10;

const ESTADOS_CITA = ["pendiente", "confirmada", "cancelada"];

const badgeEstadoCita = (estado) => {
  switch (estado) {
    case "confirmada":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "cancelada":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "pendiente":
    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
};

const textoEstadoCita = (estado) => {
  const map = { confirmada: "Confirmada", cancelada: "Cancelada", pendiente: "Pendiente" };
  return map[estado] || estado;
};

const citaVacia = {
  clienteNombre: "",
  vehiculo: "",
  descripcion: "",
  fecha: "",
  hora: "",
  estado: "pendiente",
};

const esHoy = (fechaStr) => {
  if (!fechaStr) return false;
  const hoy = new Date().toISOString().split("T")[0];
  return fechaStr.startsWith(hoy);
};

const esEstaSemana = (fechaStr) => {
  if (!fechaStr) return false;
  const ahora = new Date();
  const inicio = new Date(ahora);
  inicio.setDate(ahora.getDate() - ahora.getDay());
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 7);
  const fecha = new Date(fechaStr);
  return fecha >= inicio && fecha < fin;
};

const PaginaCitas = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, hoy: 0, semana: 0, pendientes: 0 });
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [citaEdicion, setCitaEdicion] = useState(null);
  const [formulario, setFormulario] = useState(citaVacia);
  const [guardando, setGuardando] = useState(false);

  const cargarCitas = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioCitas.obtenerTodos(termino ? { termino } : {});
      setCitas(datos);
      setStats({
        total: datos.length,
        hoy: datos.filter((c) => esHoy(c.fecha)).length,
        semana: datos.filter((c) => esEstaSemana(c.fecha)).length,
        pendientes: datos.filter((c) => c.estado === "pendiente").length,
      });
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setCitas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!CARACTERISTICAS.CITAS_ONLINE) return;
    cargarCitas();
  }, []);

  if (!CARACTERISTICAS.CITAS_ONLINE) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <CalendarDots size={64} weight="duotone" className="text-[var(--texto-deshabilitado)] mx-auto" />
            <h2 className="text-xl font-semibold text-[var(--texto-principal)]">Gestion de Citas</h2>
            <p className="text-[var(--texto-secundario)]">
              Esta funcionalidad estara disponible proximamente cuando se conecte la base de datos.
            </p>
            <Badge className="bg-[var(--advertencia)]/20 text-[var(--advertencia)]">Proximamente</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarCitas(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioCitas.eliminar(id);
      cargarCitas(busqueda);
    } catch (err) {
      console.error("Error al eliminar cita:", err);
    }
  };

  const abrirCrear = () => {
    setCitaEdicion(null);
    setFormulario(citaVacia);
    setDialogoAbierto(true);
  };

  const abrirEditar = (cita) => {
    setCitaEdicion(cita);
    setFormulario({
      clienteNombre: cita.clienteNombre || "",
      vehiculo: cita.vehiculo || "",
      descripcion: cita.descripcion || "",
      fecha: cita.fecha ? cita.fecha.split("T")[0] : "",
      hora: cita.hora || "",
      estado: cita.estado || "pendiente",
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.clienteNombre.trim()) return;
    setGuardando(true);
    try {
      if (citaEdicion) {
        await servicioCitas.actualizar(citaEdicion.id, formulario);
      } else {
        await servicioCitas.crear(formulario);
      }
      setDialogoAbierto(false);
      cargarCitas(busqueda);
    } catch (err) {
      console.error("Error al guardar cita:", err);
    } finally {
      setGuardando(false);
    }
  };

  const totalPaginas = Math.ceil(citas.length / ITEMS_POR_PAGINA);
  const citasPagina = citas.slice(
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
            Gestion de Citas
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Administra el calendario de citas del taller
          </p>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.hoy}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.semana}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{stats.pendientes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por cliente o descripcion..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando citas...
            </div>
          ) : citas.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay citas registradas
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Cliente</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Vehiculo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Descripcion</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Fecha</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Hora</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citasPagina.map((cita) => (
                    <TableRow
                      key={cita.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {cita.clienteNombre || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {cita.vehiculo || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)] max-w-[180px] truncate">
                        {cita.descripcion || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {formatFecha(cita.fecha)}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {cita.hora || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={badgeEstadoCita(cita.estado)}
                        >
                          {textoEstadoCita(cita.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() => abrirEditar(cita)}
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
                                <AlertDialogTitle>Eliminar cita</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara permanentemente la
                                  cita de <strong>{cita.clienteNombre}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(cita.id)}
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
              {citaEdicion ? "Editar Cita" : "Nueva Cita"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Cliente *</Label>
              <Input
                value={formulario.clienteNombre}
                onChange={(e) => setFormulario((f) => ({ ...f, clienteNombre: e.target.value }))}
                placeholder="Nombre del cliente"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Vehiculo</Label>
              <Input
                value={formulario.vehiculo}
                onChange={(e) => setFormulario((f) => ({ ...f, vehiculo: e.target.value }))}
                placeholder="Modelo y matricula del vehiculo"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Descripcion</Label>
              <Input
                value={formulario.descripcion}
                onChange={(e) => setFormulario((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripcion del trabajo"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Fecha</Label>
                <Input
                  type="date"
                  value={formulario.fecha}
                  onChange={(e) => setFormulario((f) => ({ ...f, fecha: e.target.value }))}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Hora</Label>
                <Input
                  type="time"
                  value={formulario.hora}
                  onChange={(e) => setFormulario((f) => ({ ...f, hora: e.target.value }))}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Estado</Label>
              <select
                value={formulario.estado}
                onChange={(e) => setFormulario((f) => ({ ...f, estado: e.target.value }))}
                className="w-full h-9 rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 text-sm"
              >
                {ESTADOS_CITA.map((estado) => (
                  <option key={estado} value={estado}>{textoEstadoCita(estado)}</option>
                ))}
              </select>
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
              disabled={guardando || !formulario.clienteNombre.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : citaEdicion ? "Guardar Cambios" : "Crear Cita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaCitas;
