import { useState, useEffect } from "react";
import { Package, Plus, MagnifyingGlass, PencilSimple, Trash } from "@phosphor-icons/react";
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
import { servicioRepuestos } from "../servicios/servicioRepuestos";

const ITEMS_POR_PAGINA = 10;

const CATEGORIAS = ["Motor", "Frenos", "Suspension", "Electrico", "Carroceria", "Aceites", "Filtros", "Otros"];

const repuestoVacio = {
  nombre: "",
  codigo: "",
  categoria: "",
  stock: 0,
  precioUnitario: 0,
  proveedor: "",
};

const PaginaRepuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({ total: 0, stockBajo: 0, categorias: 0 });
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [repuestoEdicion, setRepuestoEdicion] = useState(null);
  const [formulario, setFormulario] = useState(repuestoVacio);
  const [guardando, setGuardando] = useState(false);

  const cargarRepuestos = async (termino = "") => {
    setCargando(true);
    try {
      const datos = await servicioRepuestos.obtenerTodos(termino ? { termino } : {});
      setRepuestos(datos);
      const categoriasUnicas = new Set(datos.map((r) => r.categoria).filter(Boolean));
      setStats({
        total: datos.length,
        stockBajo: datos.filter((r) => Number(r.stock) < 5).length,
        categorias: categoriasUnicas.size,
      });
    } catch (err) {
      console.error("Error al cargar repuestos:", err);
      setRepuestos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!CARACTERISTICAS.INVENTARIO_ACTIVO) return;
    cargarRepuestos();
  }, []);

  if (!CARACTERISTICAS.INVENTARIO_ACTIVO) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <Package size={64} weight="duotone" className="text-[var(--texto-deshabilitado)] mx-auto" />
            <h2 className="text-xl font-semibold text-[var(--texto-principal)]">Inventario de Repuestos</h2>
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
    cargarRepuestos(valor);
  };

  const handleEliminar = async (id) => {
    try {
      await servicioRepuestos.eliminar(id);
      cargarRepuestos(busqueda);
    } catch (err) {
      console.error("Error al eliminar repuesto:", err);
    }
  };

  const abrirCrear = () => {
    setRepuestoEdicion(null);
    setFormulario(repuestoVacio);
    setDialogoAbierto(true);
  };

  const abrirEditar = (repuesto) => {
    setRepuestoEdicion(repuesto);
    setFormulario({
      nombre: repuesto.nombre || "",
      codigo: repuesto.codigo || "",
      categoria: repuesto.categoria || "",
      stock: repuesto.stock ?? 0,
      precioUnitario: repuesto.precioUnitario ?? 0,
      proveedor: repuesto.proveedor || "",
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.nombre.trim()) return;
    setGuardando(true);
    try {
      if (repuestoEdicion) {
        await servicioRepuestos.actualizar(repuestoEdicion.id, formulario);
      } else {
        await servicioRepuestos.crear(formulario);
      }
      setDialogoAbierto(false);
      cargarRepuestos(busqueda);
    } catch (err) {
      console.error("Error al guardar repuesto:", err);
    } finally {
      setGuardando(false);
    }
  };

  const totalPaginas = Math.ceil(repuestos.length / ITEMS_POR_PAGINA);
  const repuestosPagina = repuestos.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            Inventario de Repuestos
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Gestion de stock y repuestos del taller
          </p>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Repuesto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Repuestos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--peligro)]">{stats.stockBajo}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{stats.categorias}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--texto-deshabilitado)]" />
            <Input
              placeholder="Buscar por nombre, codigo, categoria..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-9 bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando repuestos...
            </div>
          ) : repuestos.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay repuestos registrados
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Nombre</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Codigo</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Categoria</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Stock</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Precio Unitario</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Proveedor</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repuestosPagina.map((repuesto) => (
                    <TableRow
                      key={repuesto.id}
                      className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                    >
                      <TableCell className="text-[var(--texto-principal)] font-medium">
                        {repuesto.nombre}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {repuesto.codigo || "-"}
                      </TableCell>
                      <TableCell>
                        {repuesto.categoria ? (
                          <Badge
                            variant="outline"
                            className="border-[var(--borde)] text-[var(--texto-secundario)]"
                          >
                            {repuesto.categoria}
                          </Badge>
                        ) : (
                          <span className="text-[var(--texto-deshabilitado)]">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            Number(repuesto.stock) < 5
                              ? "text-[var(--peligro)] font-semibold"
                              : "text-[var(--texto-principal)]"
                          }
                        >
                          {repuesto.stock ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {repuesto.precioUnitario != null
                          ? `€${Number(repuesto.precioUnitario).toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-principal)]">
                        {repuesto.proveedor || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Editar"
                            onClick={() => abrirEditar(repuesto)}
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
                                <AlertDialogTitle>Eliminar repuesto</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta accion no se puede deshacer. Se eliminara permanentemente el
                                  repuesto <strong>{repuesto.nombre}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                  onClick={() => handleEliminar(repuesto.id)}
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
        <DialogContent className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]">
          <DialogHeader>
            <DialogTitle>
              {repuestoEdicion ? "Editar Repuesto" : "Nuevo Repuesto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Nombre *</Label>
              <Input
                value={formulario.nombre}
                onChange={(e) => setFormulario((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre del repuesto"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Codigo</Label>
                <Input
                  value={formulario.codigo}
                  onChange={(e) => setFormulario((f) => ({ ...f, codigo: e.target.value }))}
                  placeholder="REP-001"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Categoria</Label>
                <select
                  value={formulario.categoria}
                  onChange={(e) => setFormulario((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full h-9 rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={formulario.stock}
                  onChange={(e) => setFormulario((f) => ({ ...f, stock: Number(e.target.value) }))}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Precio Unitario (€)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.precioUnitario}
                  onChange={(e) => setFormulario((f) => ({ ...f, precioUnitario: Number(e.target.value) }))}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Proveedor</Label>
              <Input
                value={formulario.proveedor}
                onChange={(e) => setFormulario((f) => ({ ...f, proveedor: e.target.value }))}
                placeholder="Nombre del proveedor"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
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
              disabled={guardando || !formulario.nombre.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : repuestoEdicion ? "Guardar Cambios" : "Crear Repuesto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaRepuestos;
