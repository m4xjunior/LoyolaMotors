import { useState, useEffect } from "react";
import { Newspaper, Plus, PencilSimple, Trash } from "@phosphor-icons/react";
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

const COLECCION = "blog";

const postVacio = {
  titulo: "",
  contenido: "",
  autor: "",
  fecha: new Date().toISOString().slice(0, 10),
  imagenUrl: "",
  descripcionCorta: "",
  publicado: false,
};

const PaginaAdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [itemEdicion, setItemEdicion] = useState(null);
  const [formulario, setFormulario] = useState(postVacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const datos = await servicioContenido.obtener(COLECCION);
      setPosts(datos);
    } catch (err) {
      console.error("Error al cargar blog:", err);
      setPosts([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setItemEdicion(null);
    setFormulario({ ...postVacio, fecha: new Date().toISOString().slice(0, 10) });
    setDialogoAbierto(true);
  };

  const abrirEditar = (item) => {
    setItemEdicion(item);
    setFormulario({
      titulo: item.titulo || "",
      contenido: item.contenido || "",
      autor: item.autor || "",
      fecha: item.fecha || new Date().toISOString().slice(0, 10),
      imagenUrl: item.imagenUrl || "",
      descripcionCorta: item.descripcionCorta || "",
      publicado: item.publicado === true,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    if (!formulario.titulo.trim()) return;
    setGuardando(true);
    try {
      const datos = {
        ...formulario,
        titulo: formulario.titulo.trim(),
      };
      await servicioContenido.guardar(COLECCION, itemEdicion?.id || null, datos);
      setDialogoAbierto(false);
      cargar();
    } catch (err) {
      console.error("Error al guardar post:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await servicioContenido.eliminar(COLECCION, id);
      cargar();
    } catch (err) {
      console.error("Error al eliminar post:", err);
    }
  };

  const campo = (c, v) => setFormulario((f) => ({ ...f, [c]: v }));

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Gestion de Blog
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra los articulos y publicaciones del blog
            </p>
          </div>
        </div>
        <Button
          onClick={abrirCrear}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Plus weight="bold" className="mr-2 size-4" />
          Nuevo Articulo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Total Articulos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">{posts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {posts.filter((p) => p.publicado === true).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
              Borradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--texto-principal)]">
              {posts.filter((p) => p.publicado !== true).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              Cargando articulos...
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-[var(--texto-deshabilitado)]">
              No hay articulos publicados. Crea el primero.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)]">Titulo</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Fecha</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Autor</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50"
                  >
                    <TableCell className="text-[var(--texto-principal)] font-medium max-w-[220px] truncate">
                      {post.titulo || "-"}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)]">
                      {formatFecha(post.fecha)}
                    </TableCell>
                    <TableCell className="text-[var(--texto-principal)]">
                      {post.autor || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          post.publicado === true
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }
                      >
                        {post.publicado === true ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Editar"
                          onClick={() => abrirEditar(post)}
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
                              <AlertDialogTitle>Eliminar articulo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente el
                                articulo <strong>{post.titulo}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[var(--peligro)] text-white hover:bg-[var(--peligro)]/90"
                                onClick={() => handleEliminar(post.id)}
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
              {itemEdicion ? "Editar Articulo" : "Nuevo Articulo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Titulo *</Label>
              <Input
                value={formulario.titulo}
                onChange={(e) => campo("titulo", e.target.value)}
                placeholder="Titulo del articulo"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Descripcion Corta</Label>
              <Input
                value={formulario.descripcionCorta}
                onChange={(e) => campo("descripcionCorta", e.target.value)}
                placeholder="Resumen breve para listados y SEO"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Contenido</Label>
              <textarea
                value={formulario.contenido}
                onChange={(e) => campo("contenido", e.target.value)}
                placeholder="Contenido completo del articulo..."
                rows={8}
                className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-tarjeta)] text-[var(--texto-principal)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Autor</Label>
                <Input
                  value={formulario.autor}
                  onChange={(e) => campo("autor", e.target.value)}
                  placeholder="Nombre del autor"
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[var(--texto-secundario)]">Fecha</Label>
                <Input
                  type="date"
                  value={formulario.fecha}
                  onChange={(e) => campo("fecha", e.target.value)}
                  className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
                />
              </div>
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
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Estado</Label>
              <label className="flex items-center gap-2 h-9 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formulario.publicado}
                  onChange={(e) => campo("publicado", e.target.checked)}
                  className="size-4 rounded border-[var(--borde)] accent-[var(--acento)]"
                />
                <span className="text-sm text-[var(--texto-principal)]">Publicado</span>
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
              disabled={guardando || !formulario.titulo.trim()}
              className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
            >
              {guardando ? "Guardando..." : itemEdicion ? "Guardar Cambios" : "Crear Articulo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaAdminBlog;
