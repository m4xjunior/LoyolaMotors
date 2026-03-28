import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MagnifyingGlass, PencilSimple, Trash, Eye } from "@phosphor-icons/react";
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
import { servicioClientes } from "../servicios/servicioClientes";

const ITEMS_POR_PAGINA = 10;

const PaginaClientes = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, activos: 0, nuevos: 0 });

  const cargarClientes = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioClientes.obtenerTodos(termino ? { termino } : {});
      setClientes(datos);
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      setStats({
        total: datos.length,
        activos: datos.filter((c) => c.activo !== false).length,
        nuevos: datos.filter((c) => c.creadoEn && new Date(c.creadoEn) >= inicioMes).length,
      });
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setClientes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarClientes(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioClientes.eliminar(id);
      cargarClientes(busqueda);
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
    }
  };

  const totalPaginas = Math.ceil(clientes.length / ITEMS_POR_PAGINA);
  const clientesPagina = clientes.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            Gestion de Clientes
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Administra los clientes del taller
          </p>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to="/panel/clientes/nuevo">
            <Plus weight="bold" className="mr-2 size-4" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Clientes
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
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.activos}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Nuevos Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.nuevos}
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
              placeholder="Buscar por nombre, email, telefono..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando clientes...
            </div>
          ) : clientes.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay clientes registrados
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Nombre</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Email</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Telefono</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Vehiculos</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesPagina.map((cliente) => (
                    <TableRow
                      key={cliente.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {cliente.nombre} {cliente.apellidos}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {cliente.email || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {cliente.telefono || "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {cliente.vehiculos ?? 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            cliente.activo !== false
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                          variant="outline"
                        >
                          {cliente.activo !== false ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Ver detalle"
                            onClick={() =>
                              navigate(`/panel/clientes/${cliente.id}`)
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
                                `/panel/clientes/editar/${cliente.id}`
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
                                  Eliminar cliente
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara
                                  permanentemente el cliente{" "}
                                  <strong>
                                    {cliente.nombre} {cliente.apellidos}
                                  </strong>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(cliente.id)}
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

export default PaginaClientes;
