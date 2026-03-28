import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Wrench, Plus, MagnifyingGlass, PencilSimple, Trash, ArrowLeft, Car } from "@phosphor-icons/react";
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
import { servicioServicios } from "../servicios/servicioServicios";
import { servicioVehiculos } from "../servicios/servicioVehiculos";

const ITEMS_POR_PAGINA = 10;

const badgeEstado = (estado) => {
  switch (estado) {
    case "completado":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "en_proceso":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "pendiente":
    default:
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
};

const textoEstado = (estado) => {
  const map = { completado: "Completado", en_proceso: "En Proceso", pendiente: "Pendiente" };
  return map[estado] || estado;
};

const PaginaServiciosVehiculo = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const cargarDatos = async (termino = "") => {
    setCargando(true);
    try {
      const [v, todos] = await Promise.all([
        servicioVehiculos.obtenerPorId(vehicleId),
        servicioServicios.obtenerTodos(),
      ]);

      if (!v) {
        navigate("/panel/vehiculos");
        return;
      }
      setVehiculo(v);

      let filtrados = todos.filter((s) => s.vehiculoId === vehicleId);
      if (termino) {
        const t = termino.toLowerCase();
        filtrados = filtrados.filter(
          (s) =>
            s.tipoServicio?.toLowerCase().includes(t) ||
            s.descripcion?.toLowerCase().includes(t) ||
            s.tecnicoNombre?.toLowerCase().includes(t) ||
            s.estado?.toLowerCase().includes(t)
        );
      }
      setServicios(filtrados);
    } catch (err) {
      console.error("Error al cargar servicios del vehiculo:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarDatos(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioServicios.eliminar(id);
      cargarDatos(busqueda);
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
    }
  };

  const totalPaginas = Math.ceil(servicios.length / ITEMS_POR_PAGINA);
  const serviciosPagina = servicios.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  if (cargando && !vehiculo) {
    return (
      <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/panel/vehiculos")}
          className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
        >
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <Wrench weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Servicios del Vehiculo
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Historial y gestion de servicios
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle info card */}
      {vehiculo && (
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[var(--acento)]/10 p-3">
                <Car weight="duotone" className="size-6 text-[var(--acento)]" />
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                    Vehiculo
                  </p>
                  <p className="text-sm font-semibold text-[var(--texto-principal)]">
                    {vehiculo.marca} {vehiculo.modelo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                    Matricula
                  </p>
                  <p className="text-sm font-semibold text-[var(--texto-principal)]">
                    {vehiculo.matricula || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                    Anio
                  </p>
                  <p className="text-sm font-semibold text-[var(--texto-principal)]">
                    {vehiculo.anio || vehiculo.año || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                    Servicios
                  </p>
                  <p className="text-sm font-semibold text-[var(--texto-principal)]">
                    {servicios.length}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90 shrink-0"
              >
                <Link to={`/panel/servicios/nuevo`} state={{ vehiculoId: vehicleId }}>
                  <Plus weight="bold" className="mr-2 size-4" />
                  Nuevo Servicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por tipo, descripcion, tecnico o estado..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando servicios...
            </div>
          ) : servicios.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Wrench weight="duotone" className="size-12 mx-auto text-[var(--texto-deshabilitado)]" />
              <p className="text-[var(--texto-deshabilitado)]">
                {busqueda
                  ? "No se encontraron servicios con esa busqueda"
                  : "Este vehiculo no tiene servicios registrados"}
              </p>
              {!busqueda && (
                <Button
                  asChild
                  className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
                >
                  <Link to="/panel/servicios/nuevo" state={{ vehiculoId: vehicleId }}>
                    <Plus weight="bold" className="mr-2 size-4" />
                    Registrar primer servicio
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Tipo Servicio</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Descripcion</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Tecnico</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Costo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Fecha Inicio</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviciosPagina.map((servicio) => (
                    <TableRow
                      key={servicio.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {servicio.tipoServicio || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)] max-w-[180px] truncate">
                        {servicio.descripcion || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {servicio.tecnicoNombre || servicio.tecnicoId || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={badgeEstado(servicio.estado)}
                          variant="outline"
                        >
                          {textoEstado(servicio.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {servicio.costo != null
                          ? `€${Number(servicio.costo).toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {servicio.fechaInicio || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() =>
                              navigate(`/panel/servicios/editar/${servicio.id}`)
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
                                <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara
                                  permanentemente el servicio{" "}
                                  <strong>{servicio.tipoServicio}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(servicio.id)}
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

export default PaginaServiciosVehiculo;
