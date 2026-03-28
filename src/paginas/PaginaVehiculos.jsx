import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MagnifyingGlass, PencilSimple, Trash, Eye, Car } from "@phosphor-icons/react";
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
import { servicioVehiculos } from "../servicios/servicioVehiculos";

const ITEMS_POR_PAGINA = 10;

const PaginaVehiculos = () => {
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, enServicio: 0, disponibles: 0 });

  const cargarVehiculos = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioVehiculos.obtenerTodos(termino ? { termino } : {});
      setVehiculos(datos);
      setStats({
        total: datos.length,
        enServicio: datos.filter((v) => v.estado === "en_servicio").length,
        disponibles: datos.filter((v) => v.estado !== "en_servicio").length,
      });
    } catch (err) {
      console.error("Error al cargar vehiculos:", err);
      setVehiculos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarVehiculos(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioVehiculos.eliminar(id);
      cargarVehiculos(busqueda);
    } catch (err) {
      console.error("Error al eliminar vehiculo:", err);
    }
  };

  const totalPaginas = Math.ceil(vehiculos.length / ITEMS_POR_PAGINA);
  const vehiculosPagina = vehiculos.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const getBadgeEstado = (estado) => {
    if (estado === "en_servicio") {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const getEtiquetaEstado = (estado) => {
    if (estado === "en_servicio") return "En Servicio";
    return "Disponible";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            Gestion de Vehiculos
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Administra los vehiculos registrados en el taller
          </p>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to="/panel/vehiculos/novo">
            <Plus weight="bold" className="mr-2 size-4" />
            Nuevo Vehiculo
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Vehiculos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              En Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.enServicio}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.disponibles}
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
              placeholder="Buscar por marca, modelo, matricula..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando vehiculos...
            </div>
          ) : vehiculos.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              <Car className="mx-auto mb-3 size-10 opacity-30" />
              No hay vehiculos registrados
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Marca</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Modelo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Ano</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Matricula</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Cliente</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosPagina.map((vehiculo) => (
                    <TableRow
                      key={vehiculo.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {vehiculo.marca || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {vehiculo.modelo || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {vehiculo.anio || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {vehiculo.matricula || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {vehiculo.clienteNombre || vehiculo.clienteId || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getBadgeEstado(vehiculo.estado)}
                          variant="outline"
                        >
                          {getEtiquetaEstado(vehiculo.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Ver servicios"
                            onClick={() =>
                              navigate(`/panel/vehiculos/${vehiculo.id}/servicios`)
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
                                `/panel/vehiculos/editar/${vehiculo.id}`
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
                                  Eliminar vehiculo
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara
                                  permanentemente el vehiculo{" "}
                                  <strong>
                                    {vehiculo.marca} {vehiculo.modelo}{" "}
                                    {vehiculo.matricula
                                      ? `(${vehiculo.matricula})`
                                      : ""}
                                  </strong>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(vehiculo.id)}
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

export default PaginaVehiculos;
