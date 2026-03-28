import { useState, useEffect } from "react";
import { Question, Plus, PencilSimple, Trash } from "@phosphor-icons/react";
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

const COLECCION = "preguntas";

const preguntaVacia = {
  pregunta: "",
  respuesta: "",
  orden: 0,
  activo: true,
};

const PaginaAdminPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(preguntaVacia);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION, { orden: true });
      setPreguntas(datos);
    } catch (err) {
      console.error("Error al cargar preguntas:", err);
      setPreguntas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario({ ...preguntaVacia, orden: preguntas.length });
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    setFormulario({
      pregunta: item.pregunta || "",
      respuesta: item.respuesta || "",
      orden: item.orden ?? 0,
      activo: item.activo !== false,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.pregunta.trim()) return;
    setGuardando(true);
    try {
      const datos = {
        ...formulario,
        pregunta: formulario.pregunta.trim(),
        respuesta: formulario.respuesta.trim(),
        orden: Number(formulario.orden) || 0,
      };
      await servicioContenido.guardar(COLECCION, itemEdicion?.id || null, datos);
      setDialogoAbierto(false);
      cargar();
    } catch (err) {
      console.error("Error al guardar pregunta:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar pregunta:", err);
    }
  };

  const campo = (c, v) => setFormulario((f) => ({ ...f, [c]: v }));

  const truncar = (texto, max = 80) => {
    if (!texto) return "-";
    return texto.length > max ? texto.slice(0, max) + "..." : texto;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Question weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Preguntas Frecuentes
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra las preguntas y respuestas frecuentes del sitio
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nueva Pregunta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{preguntas.length}</p>
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
              {preguntas.filter((p) => p.activo !== false).length}
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
              {preguntas.filter((p) => p.activo === false).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando preguntas...
            </div>
          ) : preguntas.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay preguntas registradas. Crea la primera.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)]">Pregunta</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Respuesta</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Orden</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Activo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preguntas.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                  >
                    <TableCell className="text-[var(--texto-principal)] font-medium max-w-[220px] truncate">
                      {item.pregunta || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)] max-w-[280px]">
                      <span className="line-clamp-2 text-sm text-[var(--texto-secundario)]">
                        {truncar(item.respuesta)}
                      </span>
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)]">
                      {item.orden ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.activo !== false
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {item.activo !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar"
                          onClick={() => abrirEditar(item)}
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
                              <AlertDialogTitle>Eliminar pregunta</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente la
                                pregunta <strong>{item.pregunta}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                onClick={() => handleEliminar(item.id)}
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
              {itemEdicion ? "Editar Pregunta" : "Nueva Pregunta"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Pregunta *</Label>
              <Input
                value={formulario.pregunta}
                onChange={(e) => campo("pregunta", e.target.value)}
                placeholder="Escribe la pregunta..."
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Respuesta</Label>
              <textarea
                value={formulario.respuesta}
                onChange={(e) => campo("respuesta", e.target.value)}
                placeholder="Escribe la respuesta completa..."
                rows={5}
                className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Orden</Label>
              <Input
                type="number"
                value={formulario.orden}
                onChange={(e) => campo("orden", e.target.value)}
                min={0}
                placeholder="0"
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
              disabled={guardando || !formulario.pregunta.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Crear Pregunta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminPreguntas;
