import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicioClientes } from "../servicios/servicioClientes";

const estadoInicial = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  direccion: "",
  notas: "",
};

const PaginaNuevoCliente = () => {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const esEdicion = Boolean(clienteId);

  const [formulario, setFormulario] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (esEdicion) {
      servicioClientes.obtenerPorId(clienteId).then((datos) => {
        if (datos) {
          setFormulario({
            nombre: datos.nombre || "",
            apellidos: datos.apellidos || "",
            email: datos.email || "",
            telefono: datos.telefono || "",
            direccion: datos.direccion || "",
            notas: datos.notas || "",
          });
        }
      });
    }
  }, [clienteId, esEdicion]);

  const handleCampo = (campo) => (e) =>
    setFormulario({ ...formulario, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formulario.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion) {
        await servicioClientes.actualizar(clienteId, formulario);
      } else {
        await servicioClientes.crear(formulario);
      }
      navigate("/panel/clientes");
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      setError("Error al guardar el cliente. Intenta de nuevo.");
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
          onClick={() => navigate("/panel/clientes")}
          className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
        >
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            {esEdicion ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            {esEdicion
              ? "Actualiza los datos del cliente"
              : "Registra un nuevo cliente en el sistema"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-[var(--texto-principal)]">
            Informacion del cliente
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
                  Nombre <span className="text-[var(--peligro)]">*</span>
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Nombre del cliente"
                  value={formulario.nombre}
                  onChange={handleCampo("nombre")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Apellidos
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Apellidos del cliente"
                  value={formulario.apellidos}
                  onChange={handleCampo("apellidos")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Email
                </label>
                <Input
                  type="email"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="correo@ejemplo.com"
                  value={formulario.email}
                  onChange={handleCampo("email")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Telefono
                </label>
                <Input
                  type="tel"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="+34 600 000 000"
                  value={formulario.telefono}
                  onChange={handleCampo("telefono")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Direccion
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Calle, numero, ciudad"
                  value={formulario.direccion}
                  onChange={handleCampo("direccion")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Notas
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  placeholder="Informacion adicional sobre el cliente..."
                  value={formulario.notas}
                  onChange={handleCampo("notas")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--borde)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/panel/clientes")}
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
                  : "Crear Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaNuevoCliente;
