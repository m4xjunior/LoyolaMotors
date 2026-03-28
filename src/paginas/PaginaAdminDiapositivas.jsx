import { useState, useEffect } from "react";
import { Images, Plus, PencilSimple, Trash, ArrowUp, ArrowDown } from "@phosphor-icons/react";
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

const COLECCION = "diapositivas";

const diapositVacia = {
  titulo: "",
  subtitulo: "",
  descripcion: "",
  imagenUrl: "",
  textoBoton: "",
  enlaceBoton: "",
  orden: 0,
  activo: true,
};

const PaginaAdminDiapositivas = () => {
  const [diapositivas, setDiapositivas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(diapositVacia);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION, { orden: true });
      setDiapositivas(datos);
    } catch (err) {
      console.error("Error al cargar diapositivas:", err);
      setDiapositivas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario({ ...diapositVacia, orden: diapositivas.length });
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    setFormulario({
      titulo: item.titulo || "",
      subtitulo: item.subtitulo || "",
      descripcion: item.descripcion || "",
      imagenUrl: item.imagenUrl || "",
      textoBoton: item.textoBoton || "",
      enlaceBoton: item.enlaceBoton || "",
      orden: item.orden ?? 0,
      activo: item.activo !== false,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.titulo.trim()) return;
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
      console.error("Error al guardar diapositiva:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar diapositiva:", err);
    }
  };

  const moverItem = async (index, direccion) => {
    const lista = [...diapositivas];
    const destino = index + direccion;
    if (destino < 0 || destino >= lista.length) return;
    [lista[index], lista[destino]] = [lista[destino], lista[index]];
    const ids = lista.map((d) => d.id);
    await servicioContenido.reordenar(COLECCION, ids);
    cargar();
  };

  const campo = (campo, valor) => setFormulario((f) => ({ ...f, [campo]: valor }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Images weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Gestion de Diapositivas
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra las diapositivas del slider principal
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nueva Diapositiva
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
              {diapositivas.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {diapositivas.filter((d) => d.activo !== false).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Inactivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {diapositivas.filter((d) => d.activo === false).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando diapositivas...
            </div>
          ) : diapositivas.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay diapositivas configuradas. Crea la primera.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)] w-16">Orden</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Titulo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Subtitulo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Imagen</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Activo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diapositivas.map((diap, index) => (
                  <TableRow
                    key={diap.id}
                    className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                  >
                    <TableCell className="text-[var(--texto-principal)]">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">{diap.orden ?? index}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => moverItem(index, -1)}
                            disabled={index === 0}
                            className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Subir"
                          >
                            <ArrowUp className="size-3" />
                          </button>
                          <button
                            onClick={() => moverItem(index, 1)}
                            disabled={index === diapositivas.length - 1}
                            className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)] disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Bajar"
                          >
                            <ArrowDown className="size-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] font-medium max-w-[160px] truncate">
                      {diap.titulo || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] max-w-[160px] truncate">
                      {diap.subtitulo || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] max-w-[120px]">
                      {diap.imagenUrl ? (
                        <span className="text-xs text-[var(--acento)] truncate block" title={diap.imagenUrl}>
                          {diap.imagenUrl.length > 30 ? diap.imagenUrl.slice(0, 30) + "..." : diap.imagenUrl}
                        </span>
                      ) : (
                        <span className="text-[var(--texto-deshabilitado)] text-xs">Sin imagen</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          diap.activo !== false
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {diap.activo !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar"
                          onClick={() => abrirEditar(diap)}
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
                              <AlertDialogTitle>Eliminar diapositiva</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente la
                                diapositiva <strong>{diap.titulo}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                onClick={() => handleEliminar(diap.id)}
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
              {itemEdicion ? "Editar Diapositiva" : "Nueva Diapositiva"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Titulo *</Label>
              <Input
                value={formulario.titulo}
                onChange={(e) => campo("titulo", e.target.value)}
                placeholder="Titulo principal de la diapositiva"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Subtitulo</Label>
              <Input
                value={formulario.subtitulo}
                onChange={(e) => campo("subtitulo", e.target.value)}
                placeholder="Subtitulo o tagline"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Descripcion</Label>
              <textarea
                value={formulario.descripcion}
                onChange={(e) => campo("descripcion", e.target.value)}
                placeholder="Texto descriptivo de la diapositiva"
                rows={3}
                className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">URL de Imagen</Label>
              <Input
                value={formulario.imagenUrl}
                onChange={(e) => campo("imagenUrl", e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Texto del Boton</Label>
                <Input
                  value={formulario.textoBoton}
                  onChange={(e) => campo("textoBoton", e.target.value)}
                  placeholder="Ver servicios"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Enlace del Boton</Label>
                <Input
                  value={formulario.enlaceBoton}
                  onChange={(e) => campo("enlaceBoton", e.target.value)}
                  placeholder="/service"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
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
              disabled={guardando || !formulario.titulo.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Crear Diapositiva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminDiapositivas;
