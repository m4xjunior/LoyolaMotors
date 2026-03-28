import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserGear, Plus, MagnifyingGlass, PencilSimple, Trash } from "@phosphor-icons/react";
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
import { servicioUsuarios } from "../servicios/servicioUsuarios";

const ITEMS_POR_PAGINA = 10;

const PaginaUsuarios = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, admins: 0, empleados: 0 });

  const cargarUsuarios = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioUsuarios.obtenerTodos(termino ? { termino } : {});
      setUsuarios(datos);
      setStats({
        total: datos.length,
        admins: datos.filter((u) => u.rol === "admin").length,
        empleados: datos.filter((u) => u.rol !== "admin").length,
      });
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
    cargarUsuarios(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioUsuarios.eliminar(id);
      cargarUsuarios(busqueda);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const totalPaginas = Math.ceil(usuarios.length / ITEMS_POR_PAGINA);
  const usuariosPagina = usuarios.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserGear weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Gestion de Usuarios
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra los usuarios del panel
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/dashboard/usuarios/nuevo")}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Usuarios
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
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.admins}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {stats.empleados}
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
              placeholder="Buscar por nombre, email, rol..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando usuarios...
            </div>
          ) : usuarios.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay usuarios registrados
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Nombre</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Email</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Rol</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Ultimo Acceso</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosPagina.map((usuario) => (
                    <TableRow
                      key={usuario.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {usuario.nombre} {usuario.apellidos}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {usuario.email || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            usuario.rol === "admin"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                          }
                          variant="outline"
                        >
                          {usuario.rol === "admin" ? "Admin" : "Empleado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            usuario.activo !== false
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          }
                          variant="outline"
                        >
                          {usuario.activo !== false ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {formatFecha(usuario.ultimoAcceso)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() =>
                              navigate(`/dashboard/usuarios/editar/${usuario.id}`)
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
                                  Eliminar usuario
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara
                                  permanentemente el usuario{" "}
                                  <strong>
                                    {usuario.nombre} {usuario.apellidos}
                                  </strong>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(usuario.id)}
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

export default PaginaUsuarios;
