import { useState, useEffect } from "react";
import { Users, Plus, PencilSimple, Trash } from "@phosphor-icons/react";
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

const COLECCION = "equipo";

const miembroVacio = {
  nombre: "",
  cargo: "",
  descripcion: "",
  email: "",
  telefono: "",
  imagenUrl: "",
  redesSociales: {
    twitter: "",
    facebook: "",
    linkedin: "",
  },
  activo: true,
  orden: 0,
};

const PaginaAdminEquipo = () => {
  const [equipo, setEquipo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(miembroVacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION, { orden: true });
      setEquipo(datos);
    } catch (err) {
      console.error("Error al cargar equipo:", err);
      setEquipo([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario({ ...miembroVacio, orden: equipo.length });
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    setFormulario({
      nombre: item.nombre || "",
      cargo: item.cargo || "",
      descripcion: item.descripcion || "",
      email: item.email || "",
      telefono: item.telefono || "",
      imagenUrl: item.imagenUrl || "",
      redesSociales: {
        twitter: item.redesSociales?.twitter || "",
        facebook: item.redesSociales?.facebook || "",
        linkedin: item.redesSociales?.linkedin || "",
      },
      activo: item.activo !== false,
      orden: item.orden ?? 0,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.nombre.trim()) return;
    setGuardando(true);
    try {
      const datos = {
        ...formulario,
        orden: Number(formulario.orden) || 0,
      };
      await servicioContenido.guardar(COLECCION, itemEdicion?.id || null, datos);
      setDialogoAbierto(false);
      cargar();
    } catch (err) {
      console.error("Error al guardar miembro:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar miembro:", err);
    }
  };

  const campo = (c, v) => setFormulario((f) => ({ ...f, [c]: v }));
  const campoRed = (red, v) =>
    setFormulario((f) => ({
      ...f,
      redesSociales: { ...f.redesSociales, [red]: v },
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Equipo del Taller
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra los miembros del equipo que se muestran en el sitio
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Miembro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {equipo.length}
            </p>
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
              {equipo.filter((m) => m.activo !== false).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Inactivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {equipo.filter((m) => m.activo === false).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando equipo...
            </div>
          ) : equipo.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay miembros configurados. Agrega el primero.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)]">Nombre</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Cargo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Email</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Activo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipo.map((miembro) => (
                  <TableRow
                    key={miembro.id}
                    className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                  >
                    <TableCell className="text-[var(--texto-principal)] font-medium max-w-[160px] truncate">
                      {miembro.nombre || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] max-w-[140px] truncate">
                      {miembro.cargo || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] max-w-[180px] truncate">
                      {miembro.email || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          miembro.activo !== false
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {miembro.activo !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar"
                          onClick={() => abrirEditar(miembro)}
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
                              <AlertDialogTitle>Eliminar miembro</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente a{" "}
                                <strong>{miembro.nombre}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                onClick={() => handleEliminar(miembro.id)}
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
        <DialogContent className="bg-[var(--fondo-tarjeta)] border border-[var(--borde)] text-[var(--texto-principal)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--texto-principal)]">
              {itemEdicion ? "Editar Miembro" : "Nuevo Miembro"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Nombre *</Label>
                <Input
                  value={formulario.nombre}
                  onChange={(e) => campo("nombre", e.target.value)}
                  placeholder="Nombre completo"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Cargo</Label>
                <Input
                  value={formulario.cargo}
                  onChange={(e) => campo("cargo", e.target.value)}
                  placeholder="Mecanico, Jefe de Taller..."
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Descripcion</Label>
              <textarea
                value={formulario.descripcion}
                onChange={(e) => campo("descripcion", e.target.value)}
                placeholder="Breve descripcion del miembro del equipo"
                rows={3}
                className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Email</Label>
                <Input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => campo("email", e.target.value)}
                  placeholder="nombre@taller.com"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Telefono</Label>
                <Input
                  value={formulario.telefono}
                  onChange={(e) => campo("telefono", e.target.value)}
                  placeholder="+34 600 000 000"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">URL de Imagen</Label>
              <Input
                value={formulario.imagenUrl}
                onChange={(e) => campo("imagenUrl", e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--texto-secundario)]">Redes Sociales</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--texto-deshabilitado)]">Twitter / X</Label>
                  <Input
                    value={formulario.redesSociales.twitter}
                    onChange={(e) => campoRed("twitter", e.target.value)}
                    placeholder="https://x.com/usuario"
                    className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--texto-deshabilitado)]">Facebook</Label>
                  <Input
                    value={formulario.redesSociales.facebook}
                    onChange={(e) => campoRed("facebook", e.target.value)}
                    placeholder="https://facebook.com/usuario"
                    className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--texto-deshabilitado)]">LinkedIn</Label>
                  <Input
                    value={formulario.redesSociales.linkedin}
                    onChange={(e) => campoRed("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/usuario"
                    className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Orden</Label>
                <Input
                  type="number"
                  min={0}
                  value={formulario.orden}
                  onChange={(e) => campo("orden", e.target.value)}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Estado</Label>
                <label className="flex items-center gap-2 h-9 cursor-pointer">
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
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Crear Miembro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminEquipo;
