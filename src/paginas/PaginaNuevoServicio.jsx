import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicioServicios } from "../servicios/servicioServicios";
import { servicioVehiculos } from "../servicios/servicioVehiculos";
import { servicioUsuarios } from "../servicios/servicioUsuarios";

const TIPOS_SERVICIO = [
  "Chapa y Pintura",
  "Mecanica General",
  "Revision ITV",
  "Neumaticos",
  "Aire Acondicionado",
  "Electricidad",
];

const estadoInicial = {
  tipoServicio: "",
  descripcion: "",
  vehiculoId: "",
  tecnicoId: "",
  estado: "pendiente",
  costo: "",
  fechaInicio: "",
  fechaFin: "",
  notas: "",
};

const PaginaNuevoServicio = () => {
  const navigate = useNavigate();
  const { servicioId } = useParams();
  const esEdicion = Boolean(servicioId);

  const [formulario, setFormulario] = useState(estadoInicial);
  const [vehiculos, setVehiculos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load vehicles and users for selects
    servicioVehiculos.obtenerTodos().then((datos) => setVehiculos(datos));
    servicioUsuarios.obtenerTodos().then((datos) => setTecnicos(datos));

    if (esEdicion) {
      servicioServicios.obtenerPorId(servicioId).then((datos) => {
        if (datos) {
          setFormulario({
            tipoServicio: datos.tipoServicio || "",
            descripcion: datos.descripcion || "",
            vehiculoId: datos.vehiculoId || "",
            tecnicoId: datos.tecnicoId || "",
            estado: datos.estado || "pendiente",
            costo: datos.costo != null ? String(datos.costo) : "",
            fechaInicio: datos.fechaInicio || "",
            fechaFin: datos.fechaFin || "",
            notas: datos.notas || "",
          });
        }
      });
    }
  }, [servicioId, esEdicion]);

  const handleCampo = (campo) => (e) =>
    setFormulario({ ...formulario, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formulario.tipoServicio) {
      setError("El tipo de servicio es obligatorio.");
      return;
    }
    if (!formulario.descripcion.trim()) {
      setError("La descripcion es obligatoria.");
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        ...formulario,
        costo: formulario.costo !== "" ? parseFloat(formulario.costo) : null,
      };

      // Denormalize vehicle label for display in list
      if (formulario.vehiculoId) {
        const v = vehiculos.find((x) => x.id === formulario.vehiculoId);
        if (v) payload.vehiculoNombre = `${v.marca || ""} ${v.modelo || ""} ${v.matricula ? `(${v.matricula})` : ""}`.trim();
      }
      // Denormalize technician label
      if (formulario.tecnicoId) {
        const t = tecnicos.find((x) => x.id === formulario.tecnicoId);
        if (t) payload.tecnicoNombre = t.nombre || t.email || "";
      }

      if (esEdicion) {
        await servicioServicios.actualizar(servicioId, payload);
      } else {
        await servicioServicios.crear(payload);
      }
      navigate("/panel/servicios");
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      setError("Error al guardar el servicio. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const labelSelect = "w-full rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/panel/servicios")}
          className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
        >
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            {esEdicion ? "Editar Servicio" : "Nuevo Servicio"}
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            {esEdicion
              ? "Actualiza los datos de la orden de servicio"
              : "Registra una nueva orden de servicio"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-[var(--texto-principal)]">
            Datos del servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-[var(--peligro)]/30 bg-[var(--peligro)]/10 px-4 py-3 text-sm text-[var(--peligro)]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de servicio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Tipo de servicio <span className="text-[var(--peligro)]">*</span>
                </label>
                <select
                  className={labelSelect}
                  value={formulario.tipoServicio}
                  onChange={handleCampo("tipoServicio")}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {TIPOS_SERVICIO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Estado <span className="text-[var(--peligro)]">*</span>
                </label>
                <select
                  className={labelSelect}
                  value={formulario.estado}
                  onChange={handleCampo("estado")}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              {/* Vehiculo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Vehiculo
                </label>
                <select
                  className={labelSelect}
                  value={formulario.vehiculoId}
                  onChange={handleCampo("vehiculoId")}
                >
                  <option value="">Sin vehiculo asignado</option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo}{v.matricula ? ` (${v.matricula})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tecnico */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Tecnico
                </label>
                <select
                  className={labelSelect}
                  value={formulario.tecnicoId}
                  onChange={handleCampo("tecnicoId")}
                >
                  <option value="">Sin tecnico asignado</option>
                  {tecnicos.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre || u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Costo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Costo (€)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="0.00"
                  value={formulario.costo}
                  onChange={handleCampo("costo")}
                />
              </div>

              {/* Fecha Inicio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Fecha de inicio
                </label>
                <Input
                  type="date"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  value={formulario.fechaInicio}
                  onChange={handleCampo("fechaInicio")}
                />
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Fecha de finalizacion
                </label>
                <Input
                  type="date"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  value={formulario.fechaFin}
                  onChange={handleCampo("fechaFin")}
                />
              </div>

              {/* Descripcion */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Descripcion <span className="text-[var(--peligro)]">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  placeholder="Describe el trabajo a realizar..."
                  value={formulario.descripcion}
                  onChange={handleCampo("descripcion")}
                  required
                />
              </div>

              {/* Notas */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Notas adicionales
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  placeholder="Observaciones adicionales..."
                  value={formulario.notas}
                  onChange={handleCampo("notas")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--borde)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/panel/servicios")}
                className="border-[var(--borde)] text-[var(--texto-principal)]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={guardando}
                className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
              >
                {guardando
                  ? "Guardando..."
                  : esEdicion
                  ? "Guardar Cambios"
                  : "Crear Servicio"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaNuevoServicio;
