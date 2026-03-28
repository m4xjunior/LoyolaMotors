import { useState, useEffect } from "react";
import { Tag, Plus, PencilSimple, Trash, Star } from "@phosphor-icons/react";
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
import { Label } from "@/components/ui/label";
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
import { servicioContenido } from "../servicios/servicioContenido";

const COLECCION = "precios";

const planVacio = {
  nombre: "",
  precio: "",
  precioMercado: "",
  listaCaracteristicas: "",
  destacado: false,
  activo: true,
};

const PaginaAdminPrecios = () => {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(planVacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION);
      setPlanes(datos);
    } catch (err) {
      console.error("Error al cargar precios:", err);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario(planVacio);
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    const caracteristicas = Array.isArray(item.listaCaracteristicas)
      ? item.listaCaracteristicas.join("\n")
      : item.listaCaracteristicas || "";
    setFormulario({
      nombre: item.nombre || "",
      precio: item.precio ?? "",
      precioMercado: item.precioMercado ?? "",
      listaCaracteristicas: caracteristicas,
      destacado: item.destacado === true,
      activo: item.activo !== false,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.nombre.trim()) return;
    setGuardando(true);
    try {
      const caracteristicas = formulario.listaCaracteristicas
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const datos = {
        nombre: formulario.nombre.trim(),
        precio: Number(formulario.precio) || 0,
        precioMercado: formulario.precioMercado !== "" ? Number(formulario.precioMercado) : null,
        listaCaracteristicas: caracteristicas,
        destacado: formulario.destacado,
        activo: formulario.activo,
      };
      await servicioContenido.guardar(COLECCION, itemEdicion?.id || null, datos);
      setDialogoAbierto(false);
      cargar();
    } catch (err) {
      console.error("Error al guardar plan:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar plan:", err);
    }
  };

  const campo = (c, v) => setFormulario((f) => ({ ...f, [c]: v }));

  const formatPrecio = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    return `${Number(val).toLocaleString("es-ES")} €`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Tabla de Precios
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra los planes y precios del sitio
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Planes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{planes.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {planes.filter((p) => p.activo !== false).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">
              {planes.filter((p) => p.destacado === true).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando planes...
            </div>
          ) : planes.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay planes de precios configurados. Crea el primero.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)]">
                    Nombre del Plan
                  </TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Precio</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">
                    Precio Mercado
                  </TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Destacado</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Activo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planes.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                  >
                    <TableCell className="text-[var(--texto-principal)] font-medium">
                      <div className="flex items-center gap-2">
                        {plan.destacado && (
                          <Star weight="fill" className="size-4 text-amber-500 shrink-0" />
                        )}
                        {plan.nombre}
                      </div>
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)]">
                      {formatPrecio(plan.precio)}
                    </TableCell>
                    <TableCell className="text-[var(--texto-deshabilitado)]">
                      {plan.precioMercado ? (
                        <span className="line-through">{formatPrecio(plan.precioMercado)}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          plan.destacado
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {plan.destacado ? "Destacado" : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          plan.activo !== false
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {plan.activo !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar"
                          onClick={() => abrirEditar(plan)}
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
                              <AlertDialogTitle>Eliminar plan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente el
                                plan <strong>{plan.nombre}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                onClick={() => handleEliminar(plan.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="bg-[var(--fondo-tarjeta)] border border-[var(--borde)] text-[var(--texto-principal)] max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--texto-principal)]">
              {itemEdicion ? "Editar Plan" : "Nuevo Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Nombre del Plan *</Label>
              <Input
                value={formulario.nombre}
                onChange={(e) => campo("nombre", e.target.value)}
                placeholder="Plan Basico, Plan Premium..."
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Precio (€)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formulario.precio}
                  onChange={(e) => campo("precio", e.target.value)}
                  placeholder="299"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Precio de Mercado (€)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formulario.precioMercado}
                  onChange={(e) => campo("precioMercado", e.target.value)}
                  placeholder="399 (tachado)"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">
                Caracteristicas (una por linea)
              </Label>
              <textarea
                value={formulario.listaCaracteristicas}
                onChange={(e) => campo("listaCaracteristicas", e.target.value)}
                placeholder={"Lavado exterior\nAspiracion interior\nBrillo de llantas"}
                rows={5}
                className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formulario.destacado}
                  onChange={(e) => campo("destacado", e.target.checked)}
                  className="size-4 rounded border-[var(--borde)] accent-[var(--acento)]"
                />
                <span className="text-sm text-[var(--texto-principal)]">Plan Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formulario.activo}
                  onChange={(e) => campo("activo", e.target.checked)}
                  className="size-4 rounded border-[var(--borde)] accent-[var(--acento)]"
                />
                <span className="text-sm text-[var(--texto-principal)]">Activo</span>
              </label>
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
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Crear Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminPrecios;
