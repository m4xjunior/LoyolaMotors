import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PencilSimple, Car } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { servicioClientes } from "../servicios/servicioClientes";
import { servicioVehiculos } from "../servicios/servicioVehiculos";

const PaginaDetalleCliente = () => {
  const { clienteId } = useParams();

  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const datos = await servicioClientes.obtenerPorId(clienteId);
        if (!datos) {
          setError("Cliente no encontrado.");
          return;
        }
        setCliente(datos);

        const todosVehiculos = await servicioVehiculos.obtenerTodos();
        setVehiculos(
          todosVehiculos.filter((v) => v.clienteId === clienteId)
        );
      } catch (err) {
        console.error("Error al cargar cliente:", err);
        setError("Error al cargar los datos del cliente.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [clienteId]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--texto-deshabilitado)]">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-[var(--texto-deshabilitado)]">
            <Link to="/panel/clientes">
              <ArrowLeft className="mr-1 size-4" />
              Volver a Clientes
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border border-[var(--peligro)]/30 bg-[var(--peligro)]/10 px-4 py-6 text-center text-[var(--peligro)]">
          {error}
        </div>
      </div>
    );
  }

  const fechaRegistro = cliente.creadoEn
    ? new Date(cliente.creadoEn).toLocaleDateString("es-ES")
    : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
          >
            <Link to="/panel/clientes">
              <ArrowLeft className="mr-1 size-4" />
              Volver a Clientes
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
              {cliente.nombre} {cliente.apellidos}
            </h1>
            <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
              Cliente desde {fechaRegistro}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to={`/panel/clientes/editar/${clienteId}`}>
            <PencilSimple className="mr-2 size-4" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Client Info Card */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[var(--texto-principal)]">
            Informacion del cliente
          </CardTitle>
          <Badge
            className={
              cliente.activo !== false
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            }
            variant="outline"
          >
            {cliente.activo !== false ? "Activo" : "Inactivo"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Nombre
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {cliente.nombre} {cliente.apellidos || ""}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {cliente.email || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Telefono
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {cliente.telefono || "-"}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Direccion
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {cliente.direccion || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Registro
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {fechaRegistro}
              </p>
            </div>

            {cliente.notas && (
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                  Notas
                </p>
                <p className="text-sm text-[var(--texto-principal)]">
                  {cliente.notas}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehiculos */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[var(--texto-principal)]">
            Vehiculos ({vehiculos.length})
          </CardTitle>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[var(--borde)] text-[var(--texto-principal)]"
          >
            <Link to={`/panel/vehiculos/novo?clienteId=${clienteId}`}>
              <Car className="mr-2 size-4" />
              Agregar Vehiculo
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {vehiculos.length === 0 ? (
            <div className="py-10 text-center text-[var(--texto-deshabilitado)]">
              No hay vehiculos registrados para este cliente
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehiculos.map((v) => (
                <div
                  key={v.id}
                  className="rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Car className="size-4 text-[var(--acento)]" />
                    <span className="font-medium text-[var(--texto-principal)]">
                      {v.marca} {v.modelo}
                    </span>
                  </div>
                  {v.matricula && (
                    <p className="text-xs text-[var(--texto-deshabilitado)]">
                      Matricula: {v.matricula}
                    </p>
                  )}
                  {v.año && (
                    <p className="text-xs text-[var(--texto-deshabilitado)]">
                      Ano: {v.año}
                    </p>
                  )}
                  {v.kilometraje != null && (
                    <p className="text-xs text-[var(--texto-deshabilitado)]">
                      Km: {v.kilometraje.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaDetalleCliente;
