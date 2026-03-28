import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicioVehiculos } from "../servicios/servicioVehiculos";
import { servicioClientes } from "../servicios/servicioClientes";

const estadoInicial = {
  marca: "",
  modelo: "",
  anio: "",
  matricula: "",
  color: "",
  clienteId: "",
  kilometraje: "",
  notas: "",
};

const PaginaNuevoVehiculo = () => {
  const navigate = useNavigate();
  const { vehiculoId } = useParams();
  const esEdicion = Boolean(vehiculoId);

  const [formulario, setFormulario] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    servicioClientes.obtenerTodos().then((datos) => setClientes(datos)).catch(() => {});
  }, []);

  useEffect(() => {
    if (esEdicion) {
      servicioVehiculos.obtenerPorId(vehiculoId).then((datos) => {
        if (datos) {
          setFormulario({
            marca: datos.marca || "",
            modelo: datos.modelo || "",
            anio: datos.anio != null ? String(datos.anio) : "",
            matricula: datos.matricula || "",
            color: datos.color || "",
            clienteId: datos.clienteId || "",
            kilometraje: datos.kilometraje != null ? String(datos.kilometraje) : "",
            notas: datos.notas || "",
          });
        }
      });
    }
  }, [vehiculoId, esEdicion]);

  const handleCampo = (campo) => (e) =>
    setFormulario({ ...formulario, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formulario.marca.trim()) {
      setError("La marca es obligatoria.");
      return;
    }
    if (!formulario.modelo.trim()) {
      setError("El modelo es obligatorio.");
      return;
    }
    if (!formulario.matricula.trim()) {
      setError("La matricula es obligatoria.");
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        ...formulario,
        anio: formulario.anio ? parseInt(formulario.anio, 10) : null,
        kilometraje: formulario.kilometraje ? parseInt(formulario.kilometraje, 10) : null,
      };

      if (esEdicion) {
        await servicioVehiculos.actualizar(vehiculoId, datos);
      } else {
        await servicioVehiculos.crear(datos);
      }
      navigate("/panel/vehiculos");
    } catch (err) {
      console.error("Error al guardar vehiculo:", err);
      setError("Error al guardar el vehiculo. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/panel/vehiculos")}
          className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
        >
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            {esEdicion ? "Editar Vehiculo" : "Nuevo Vehiculo"}
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            {esEdicion
              ? "Actualiza los datos del vehiculo"
              : "Registra un nuevo vehiculo en el sistema"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-[var(--texto-principal)]">
            Informacion del vehiculo
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Marca <span className="text-[var(--peligro)]">*</span>
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Ej: Toyota, Volkswagen, Ford..."
                  value={formulario.marca}
                  onChange={handleCampo("marca")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Modelo <span className="text-[var(--peligro)]">*</span>
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Ej: Corolla, Golf, Fiesta..."
                  value={formulario.modelo}
                  onChange={handleCampo("modelo")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Ano
                </label>
                <Input
                  type="number"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Ej: 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formulario.anio}
                  onChange={handleCampo("anio")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Matricula <span className="text-[var(--peligro)]">*</span>
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] uppercase"
                  placeholder="Ej: 1234ABC"
                  value={formulario.matricula}
                  onChange={handleCampo("matricula")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Color
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Ej: Negro, Blanco, Azul..."
                  value={formulario.color}
                  onChange={handleCampo("color")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Kilometraje
                </label>
                <Input
                  type="number"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Ej: 50000"
                  min="0"
                  value={formulario.kilometraje}
                  onChange={handleCampo("kilometraje")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Cliente
                </label>
                <select
                  className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  value={formulario.clienteId}
                  onChange={handleCampo("clienteId")}
                >
                  <option value="">Sin cliente asignado</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Notas
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  placeholder="Informacion adicional sobre el vehiculo..."
                  value={formulario.notas}
                  onChange={handleCampo("notas")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--borde)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/panel/vehiculos")}
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
                  : "Crear Vehiculo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaNuevoVehiculo;
