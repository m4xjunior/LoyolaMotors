import { useState, useEffect } from "react";
import { Sliders, CheckCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { servicioConfiguracion } from "../servicios/servicioConfiguracion";

const PaginaAdminConfiguracion = () => {
  const [formulario, setFormulario] = useState({
    nombreEmpresa: "",
    eslogan: "",
    telefono: "",
    email: "",
    direccion: "",
    horario: "",
    redesSociales: {
      twitter: "",
      facebook: "",
      linkedin: "",
      instagram: "",
    },
    videoYoutube: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const config = await servicioConfiguracion.obtener();
        setFormulario({
          nombreEmpresa: config.nombreEmpresa || "",
          eslogan: config.eslogan || "",
          telefono: config.telefono || "",
          email: config.email || "",
          direccion: config.direccion || "",
          horario: config.horario || "",
          redesSociales: {
            twitter: config.redesSociales?.twitter || "",
            facebook: config.redesSociales?.facebook || "",
            linkedin: config.redesSociales?.linkedin || "",
            instagram: config.redesSociales?.instagram || "",
          },
          videoYoutube: config.videoYoutube || "",
        });
      } catch (err) {
        console.error("Error al cargar configuracion:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const campo = (clave, valor) => {
    setFormulario((f) => ({ ...f, [clave]: valor }));
    setExito(false);
  };

  const campoRed = (red, valor) => {
    setFormulario((f) => ({
      ...f,
      redesSociales: { ...f.redesSociales, [red]: valor },
    }));
    setExito(false);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setExito(false);
    try {
      await servicioConfiguracion.actualizar(formulario);
      setExito(true);
      setTimeout(() => setExito(false), 4000);
    } catch (err) {
      console.error("Error al guardar configuracion:", err);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[var(--texto-deshabilitado)]">Cargando configuracion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sliders weight="duotone" className="size-7 text-[var(--acento)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              Configuracion del Sitio
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Administra la informacion y configuracion general del negocio
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {exito && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle weight="fill" className="size-4" />
              <span>Guardado correctamente</span>
            </div>
          )}
          <Button
            onClick={handleGuardar}
            disabled={guardando}
            className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* Informacion del Negocio */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[var(--texto-principal)]">
            Informacion del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Nombre de la Empresa</Label>
              <Input
                value={formulario.nombreEmpresa}
                onChange={(e) => campo("nombreEmpresa", e.target.value)}
                placeholder="Loyola Motors"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Eslogan</Label>
              <Input
                value={formulario.eslogan}
                onChange={(e) => campo("eslogan", e.target.value)}
                placeholder="Taller de Chapa y Pintura en Valencia"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Telefono</Label>
              <Input
                value={formulario.telefono}
                onChange={(e) => campo("telefono", e.target.value)}
                placeholder="+34 640 16 29 47"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Email</Label>
              <Input
                type="email"
                value={formulario.email}
                onChange={(e) => campo("email", e.target.value)}
                placeholder="info@loyolamotors.es"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[var(--texto-secundario)]">Direccion</Label>
            <Input
              value={formulario.direccion}
              onChange={(e) => campo("direccion", e.target.value)}
              placeholder="C/ Sant Ignasi de Loiola, 21-BJ IZ, 46008 Valencia"
              className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[var(--texto-secundario)]">Horario</Label>
            <Input
              value={formulario.horario}
              onChange={(e) => campo("horario", e.target.value)}
              placeholder="Lun - Vie: 9:00 - 18:00"
              className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[var(--texto-principal)]">
            Redes Sociales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Twitter / X</Label>
              <Input
                value={formulario.redesSociales.twitter}
                onChange={(e) => campoRed("twitter", e.target.value)}
                placeholder="https://www.x.com/"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Facebook</Label>
              <Input
                value={formulario.redesSociales.facebook}
                onChange={(e) => campoRed("facebook", e.target.value)}
                placeholder="https://www.facebook.com/"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">LinkedIn</Label>
              <Input
                value={formulario.redesSociales.linkedin}
                onChange={(e) => campoRed("linkedin", e.target.value)}
                placeholder="https://www.linkedin.com/"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--texto-secundario)]">Instagram</Label>
              <Input
                value={formulario.redesSociales.instagram}
                onChange={(e) => campoRed("instagram", e.target.value)}
                placeholder="https://www.instagram.com/"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multimedia */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[var(--texto-principal)]">
            Multimedia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-[var(--texto-secundario)]">ID del Video de YouTube</Label>
            <Input
              value={formulario.videoYoutube}
              onChange={(e) => campo("videoYoutube", e.target.value)}
              placeholder="VcaAVWtP48A"
              className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)]"
            />
            <p className="text-xs text-[var(--texto-deshabilitado)] mt-1">
              Solo el ID del video, no la URL completa. Ej: para https://youtube.com/watch?v=VcaAVWtP48A ingresa solo VcaAVWtP48A
            </p>
          </div>
          {formulario.videoYoutube && (
            <div className="rounded-lg overflow-hidden border border-[var(--borde)] aspect-video max-w-md">
              <iframe
                src={`https://www.youtube.com/embed/${formulario.videoYoutube}`}
                title="Vista previa del video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boton guardar inferior */}
      <div className="flex items-center justify-end gap-3 pb-4">
        {exito && (
          <div className="flex items-center gap-2 text-green-500 text-sm">
            <CheckCircle weight="fill" className="size-4" />
            <span>Guardado correctamente</span>
          </div>
        )}
        <Button
          onClick={handleGuardar}
          disabled={guardando}
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
};

export default PaginaAdminConfiguracion;
