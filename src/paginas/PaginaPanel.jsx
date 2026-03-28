import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contextos/ContextoAutenticacion";
import { Users, Car, Clock, CheckCircle, CurrencyEur, Plus, Wrench, GearSix } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { servicioClientes } from "../servicios/servicioClientes";
import { servicioServicios } from "../servicios/servicioServicios";
import { servicioVehiculos } from "../servicios/servicioVehiculos";

const badgeClase = (estado) => {
  switch (estado) {
    case "completado":
      return "bg-[var(--exito)]/20 text-[var(--exito)] border-[var(--exito)]/30";
    case "en_proceso":
      return "bg-[var(--advertencia)]/20 text-[var(--advertencia)] border-[var(--advertencia)]/30";
    case "pendiente":
      return "bg-[var(--peligro)]/20 text-[var(--peligro)] border-[var(--peligro)]/30";
    default:
      return "";
  }
};

const estadoLabel = (estado) => {
  switch (estado) {
    case "completado":   return "Completado";
    case "en_proceso":  return "En Proceso";
    case "pendiente":   return "Pendiente";
    default:            return estado;
  }
};

const PaginaPanel = () => {
  const { user } = useAutenticacion();

  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalVehiculos: 0,
    serviciosPendientes: 0,
    serviciosCompletados: 0,
    ingresosMes: 0,
    satisfaccion: 96,
  });
  const [serviciosRecientes, setServiciosRecientes] = useState([]);
  const [clientesRecientes, setClientesRecientes] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([
    { mes: 'Ene', servicios: 12 },
    { mes: 'Feb', servicios: 19 },
    { mes: 'Mar', servicios: 15 },
    { mes: 'Abr', servicios: 22 },
    { mes: 'May', servicios: 28 },
    { mes: 'Jun', servicios: 24 },
    { mes: 'Jul', servicios: 18 },
    { mes: 'Ago', servicios: 14 },
    { mes: 'Sep', servicios: 21 },
    { mes: 'Oct', servicios: 26 },
    { mes: 'Nov', servicios: 31 },
    { mes: 'Dic', servicios: 20 },
  ]);

  const cargarDatos = async () => {
    try {
      const clientes = await servicioClientes.obtenerTodos();
      const servicios = await servicioServicios.obtenerTodos();
      const vehiculos = await servicioVehiculos.obtenerTodos();

      const pendientes = servicios.filter((s) => s.estado === "pendiente").length;
      const completados = servicios.filter((s) => s.estado === "completado").length;

      setEstadisticas((prev) => ({
        ...prev,
        totalClientes: clientes.length,
        totalVehiculos: vehiculos.length,
        serviciosPendientes: pendientes,
        serviciosCompletados: completados,
      }));

      setServiciosRecientes(
        servicios
          .sort((a, b) => new Date(b.fecha ?? b.creadoEn) - new Date(a.fecha ?? a.creadoEn))
          .slice(0, 6)
      );

      setClientesRecientes(
        clientes
          .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
          .slice(0, 5)
      );
    } catch {
      // empty state is fine
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const iniciales = (nombre, apellidos) => {
    const n = nombre?.charAt(0) ?? "";
    const a = apellidos?.charAt(0) ?? "";
    return `${n}${a}`.toUpperCase() || "?";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--texto-principal)] font-[family-name:var(--fuente-encabezado)]">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-[var(--texto-secundario)] mt-1">
            Panel de control &mdash;{" "}
            {format(new Date(), "dd 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            asChild
            variant="default"
            className="bg-[var(--acento)] hover:bg-[var(--acento-hover)] text-white"
          >
            <Link to="/panel/clientes">
              <Plus size={18} weight="bold" className="mr-2" />
              Nuevo Cliente
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--borde)] text-[var(--texto-principal)] hover:bg-[var(--fondo-tarjeta)]"
          >
            <Link to="/panel/servicios/nuevo">
              <Wrench size={18} weight="bold" className="mr-2" />
              Nuevo Servicio
            </Link>
          </Button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-[var(--acento)]/20 transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-[var(--radio-lg)] bg-[var(--acento)]/15 p-3 ring-1 ring-[var(--acento)]/20">
              <Users size={32} weight="duotone" className="text-[var(--acento)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--texto-secundario)]">Total Clientes</p>
              <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                {estadisticas.totalClientes}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-[var(--info)]/20 transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-[var(--radio-lg)] bg-[var(--info)]/15 p-3 ring-1 ring-[var(--info)]/20">
              <Car size={32} weight="duotone" className="text-[var(--info)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--texto-secundario)]">Vehículos</p>
              <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                {estadisticas.totalVehiculos}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-[var(--advertencia)]/20 transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-[var(--radio-lg)] bg-[var(--advertencia)]/15 p-3 ring-1 ring-[var(--advertencia)]/20">
              <Clock size={32} weight="duotone" className="text-[var(--advertencia)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--texto-secundario)]">Pendientes</p>
              <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                {estadisticas.serviciosPendientes}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-[var(--exito)]/20 transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-[var(--radio-lg)] bg-[var(--exito)]/15 p-3 ring-1 ring-[var(--exito)]/20">
              <CheckCircle size={32} weight="duotone" className="text-[var(--exito)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--texto-secundario)]">Completados</p>
              <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                {estadisticas.serviciosCompletados}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-[var(--acento)]/20 transition-all duration-300">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-[var(--radio-lg)] bg-[var(--acento)]/15 p-3 ring-1 ring-[var(--acento)]/20">
              <CurrencyEur size={32} weight="duotone" className="text-[var(--acento)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--texto-secundario)]">Ingresos</p>
              <p className="text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                €{estadisticas.ingresosMes.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Satisfaction side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20">
          <CardHeader>
            <CardTitle className="text-[var(--texto-principal)]">Servicios por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            {datosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
                  <XAxis dataKey="mes" stroke="var(--texto-secundario)" fontSize={12} />
                  <YAxis stroke="var(--texto-secundario)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--fondo-tarjeta)",
                      border: "1px solid var(--borde)",
                      borderRadius: "var(--radio-md)",
                      color: "var(--texto-principal)",
                    }}
                  />
                  <Bar dataKey="servicios" fill="var(--acento)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[var(--texto-deshabilitado)]">
                Sin datos de gráfico disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader>
            <CardTitle className="text-[var(--texto-principal)]">Satisfacción</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] gap-4">
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--borde)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--exito)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - estadisticas.satisfaccion / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-2xl font-bold font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                {estadisticas.satisfaccion}%
              </span>
            </div>
            <p className="text-sm text-[var(--texto-secundario)] text-center">
              Tasa de satisfacción del cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent services table + Recent customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-[var(--fondo-tarjeta)] to-[#0F172A] border-[var(--borde)] shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--texto-principal)]">Servicios Recientes</CardTitle>
            <Link
              to="/panel/servicios"
              className="text-sm text-[var(--acento)] hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {serviciosRecientes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--borde)]">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Cliente</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Servicio</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviciosRecientes.map((s) => (
                    <TableRow key={s.id} className="border-[var(--borde)]">
                      <TableCell className="text-[var(--texto-principal)]">
                        {s.clienteNombre ?? s.clienteId ?? "—"}
                      </TableCell>
                      <TableCell className="text-[var(--texto-secundario)]">
                        {s.tipoServicio ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={badgeClase(s.estado)}
                        >
                          {estadoLabel(s.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--fuente-datos)] text-[var(--texto-principal)]">
                        €{(s.costo ?? 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-[var(--texto-deshabilitado)]">
                No hay servicios registrados aún.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--texto-principal)]">Nuevos Clientes</CardTitle>
            <Link
              to="/panel/clientes"
              className="text-sm text-[var(--acento)] hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {clientesRecientes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {clientesRecientes.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 rounded-[var(--radio-md)] hover:bg-[var(--acento)]/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--acento)]/20 flex items-center justify-center text-xs font-bold text-[var(--acento)]">
                      {iniciales(c.nombre, c.apellidos)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--texto-principal)] truncate">
                        {c.nombre} {c.apellidos}
                      </p>
                      <p className="text-xs text-[var(--texto-secundario)] truncate">
                        {c.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-[var(--texto-deshabilitado)]">
                No hay clientes registrados aún.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--texto-principal)] mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] hover:border-[var(--acento)]/30 transition-colors cursor-pointer">
            <Link to="/panel/clientes/nuevo" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-[var(--acento)]/10 p-3 w-fit mb-3">
                <Plus size={24} weight="duotone" className="text-[var(--acento)]" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--texto-principal)] mb-1">
                Nuevo Cliente
              </h4>
              <p className="text-xs text-[var(--texto-secundario)]">
                Registrar un nuevo cliente en el sistema
              </p>
            </Link>
          </Card>

          <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] hover:border-[var(--acento)]/30 transition-colors cursor-pointer">
            <Link to="/panel/servicios/nuevo" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-[var(--info)]/10 p-3 w-fit mb-3">
                <Wrench size={24} weight="duotone" className="text-[var(--info)]" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--texto-principal)] mb-1">
                Nuevo Servicio
              </h4>
              <p className="text-xs text-[var(--texto-secundario)]">
                Registrar un nuevo servicio para un cliente
              </p>
            </Link>
          </Card>

          <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] hover:border-[var(--acento)]/30 transition-colors cursor-pointer">
            <Link to="/panel/vehiculos" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-[var(--advertencia)]/10 p-3 w-fit mb-3">
                <Car size={24} weight="duotone" className="text-[var(--advertencia)]" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--texto-principal)] mb-1">
                Gestionar Vehículos
              </h4>
              <p className="text-xs text-[var(--texto-secundario)]">
                Ver y administrar vehículos registrados
              </p>
            </Link>
          </Card>

          {user?.rol === "admin" && (
            <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] hover:border-[var(--acento)]/30 transition-colors cursor-pointer">
              <Link to="/panel/usuarios" className="block p-6 no-underline">
                <div className="rounded-[var(--radio-lg)] bg-[var(--exito)]/10 p-3 w-fit mb-3">
                  <GearSix size={24} weight="duotone" className="text-[var(--exito)]" />
                </div>
                <h4 className="text-sm font-semibold text-[var(--texto-principal)] mb-1">
                  Gestionar Usuarios
                </h4>
                <p className="text-xs text-[var(--texto-secundario)]">
                  Administrar usuarios del sistema
                </p>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaPanel;
