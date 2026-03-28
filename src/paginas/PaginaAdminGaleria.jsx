import { useState, useEffect } from "react";
import { Images, Plus, PencilSimple, Trash } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const COLECCION = "galeria";

const imagenVacia = {
  titulo: "",
  descripcion: "",
  imagenUrl: "",
  orientacion: "normal",
  activo: true,
  orden: 0,
};

const PaginaAdminGaleria = () => {
  const [galeria, setGaleria] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(imagenVacia);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION, { orden: true });
      setGaleria(datos);
    } catch (err) {
      console.error("Error al cargar galeria:", err);
      setGaleria([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario({ ...imagenVacia, orden: galeria.length });
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    setFormulario({
      titulo: item.titulo || "",
      descripcion: item.descripcion || "",
      imagenUrl: item.imagenUrl || "",
      orientacion: item.orientacion || "normal",
      activo: item.activo !== false,
      orden: item.orden ?? 0,
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
      console.error("Error al guardar imagen:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
    }
  };

  const campo = (c, v) => setFormulario((f) => ({ ...f, [c]: v }));

  const etiquetaOrientacion = (o) => {
    if (o === "horizontal") return "Horizontal";
    if (o === "vertical") return "Vertical";
    return "Normal";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Images weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Galeria de Imagenes
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra las imagenes de la galeria del sitio
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nueva Imagen
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
              {galeria.length}
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
              {galeria.filter((g) => g.activo !== false).length}
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
              {galeria.filter((g) => g.activo === false).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de tarjetas */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-4">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando galeria...
            </div>
          ) : galeria.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay imagenes en la galeria. Agrega la primera.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galeria.map((imagen) => (
                <div
                  key={imagen.id}
                  className="group relative rounded-lg overflow-hidden border border-[var(--borde)] bg-[var(--fondo-elevado)]"
                >
                  {/* Preview de imagen */}
                  <div className="aspect-square w-full overflow-hidden bg-[var(--fondo-elevado)]">
                    {imagen.imagenUrl ? (
                      <img
                        src={imagen.imagenUrl}
                        alt={imagen.titulo || "Imagen"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images
                          weight="duotone"
                          className="size-10 text-[var(--texto-deshabilitado)]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Overlay de acciones */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Editar"
                      onClick={() => abrirEditar(imagen)}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <PencilSimple className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Eliminar"
                          className="bg-white/10 hover:bg-red-500/60 text-white"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar imagen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta accion no se puede deshacer. Se eliminara permanentemente la
                            imagen <strong>{imagen.titulo}</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                            onClick={() => handleEliminar(imagen.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Info pie de tarjeta */}
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium text-[var(--texto-principal)] truncate">
                      {imagen.titulo || "Sin titulo"}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-[var(--texto-deshabilitado)]">
                        {etiquetaOrientacion(imagen.orientacion)}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          imagen.activo !== false
                            ? "text-[10px] px-1 py-0 bg-green-500/10 text-green-500 border-green-500/20"
                            : "text-[10px] px-1 py-0 bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {imagen.activo !== false ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="bg-[var(--fondo-tarjeta)] border border-[var(--borde)] text-[var(--texto-principal)] max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--texto-principal)]">
              {itemEdicion ? "Editar Imagen" : "Nueva Imagen"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Titulo *</Label>
              <Input
                value={formulario.titulo}
                onChange={(e) => campo("titulo", e.target.value)}
                placeholder="Descripcion breve de la imagen"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Descripcion</Label>
              <textarea
                value={formulario.descripcion}
                onChange={(e) => campo("descripcion", e.target.value)}
                placeholder="Informacion adicional sobre la imagen"
                rows={2}
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
              {formulario.imagenUrl && (
                <div className="mt-2 rounded-md overflow-hidden border border-[var(--borde)] h-32 bg-[var(--fondo-elevado)]">
                  <img
                    src={formulario.imagenUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-1">
                <Label className="text-[var(--texto-secundario)]">Orientacion</Label>
                <select
                  value={formulario.orientacion}
                  onChange={(e) => campo("orientacion", e.target.value)}
                  className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
                >
                  <option value="normal">Normal</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
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
                  <span className="text-sm text-[var(--texto-principal)]">Activa</span>
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
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Agregar Imagen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminGaleria;
