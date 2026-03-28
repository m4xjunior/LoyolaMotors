import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, Plus, MagnifyingGlass, PencilSimple, Trash } from "@phosphor-icons/react";
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

const PaginaServicios = () => {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, pendientes: 0, enProceso: 0, completados: 0 });

  const cargarServicios = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioServicios.obtenerTodos(termino ? { termino } : {});
      setServicios(datos);
      setStats({
        total: datos.length,
        pendientes: datos.filter((s) => s.estado === "pendiente").length,
        enProceso: datos.filter((s) => s.estado === "en_proceso").length,
        completados: datos.filter((s) => s.estado === "completado").length,
      });
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      setServicios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarServicios(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioServicios.eliminar(id);
      cargarServicios(busqueda);
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
    }
  };

  const totalPaginas = Math.ceil(servicios.length / ITEMS_POR_PAGINA);
  const serviciosPagina = servicios.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Gestion de Servicios
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra las ordenes de servicio del taller
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to="/panel/servicios/nuevo">
            <Plus weight="bold" className="mr-2 size-4" />
            Nuevo Servicio
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{stats.pendientes}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{stats.enProceso}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{stats.completados}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por tipo de servicio o descripcion..."
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
              <p className="text-[var(--texto-deshabilitado)]">No hay servicios registrados</p>
              <Button
                asChild
                className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
              >
                <Link to="/panel/servicios/nuevo">
                  <Plus weight="bold" className="mr-2 size-4" />
                  Crear primer servicio
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Tipo Servicio</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Descripcion</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Vehiculo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Tecnico</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Costo</TableHead>
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
                      <TableCell className="text-[var(--texto-principal)] max-w-[200px] truncate">
                        {servicio.descripcion || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {servicio.vehiculoNombre || servicio.vehiculoId || "-"}
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

export default PaginaServicios;
