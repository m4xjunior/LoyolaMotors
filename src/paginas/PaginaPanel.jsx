import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contextos/ContextoAutenticacion";
import {
  Users, Car, Clock, CheckCircle, CurrencyEur, Plus, Wrench, GearSix,
  TrendUp,
} from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, RadialBarChart, RadialBar, PolarGrid, Label } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { servicioClientes } from "../servicios/servicioClientes";
import { servicioServicios } from "../servicios/servicioServicios";
import { servicioVehiculos } from "../servicios/servicioVehiculos";
import Carrusel from "../componentes/Carrusel/Carrusel";

/* ── Helpers ── */
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
    case "completado":  return "Completado";
    case "en_proceso":  return "En Proceso";
    case "pendiente":   return "Pendiente";
    default:            return estado;
  }
};

/* ── Estilos reutilizables ── */
const estiloTarjeta = "bg-gradient-to-br from-card to-background border-border shadow-lg shadow-black/20";
const estiloTarjetaPlana = "bg-card border-border";

const configGrafico = {
  servicios: {
    label: "Servicios",
    color: "var(--acento, #e04e28)",
  },
  facturado: {
    label: "Facturado",
    color: "var(--info, #3b82f6)",
  },
};

/* ── Datos de grafico radial ── */
const configRadial = {
  satisfaccion: {
    label: "Satisfaccion",
    color: "var(--exito, #22c55e)",
  },
};

/* ── Componente principal ── */
const PaginaPanel = () => {
  const { user } = useAutenticacion();

  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalVehiculos: 0,
    serviciosPendientes: 0,
    serviciosCompletados: 0,
    ingresosMes: 0,
    satisfaccion: 0,
  });
  const [serviciosRecientes, setServiciosRecientes] = useState([]);
  const [clientesRecientes, setClientesRecientes] = useState([]);
  const [serieActiva, setSerieActiva] = useState("servicios");
  const [cargando, setCargando] = useState(true);

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
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /* ── Totales para las pestanas del grafico ── */
  const totales = useMemo(() => ({
    servicios: estadisticas.serviciosCompletados + estadisticas.serviciosPendientes,
    facturado: estadisticas.ingresosMes,
  }), [estadisticas]);

  /* ── Datos del grafico radial ── */
  const datosRadial = useMemo(
    () => [
      {
        nombre: "satisfaccion",
        valor: estadisticas.satisfaccion,
        fill: "var(--exito, #22c55e)",
      },
    ],
    [estadisticas.satisfaccion]
  );

  /* ── Elementos del carrusel ── */
  const elementosCarrusel = useMemo(
    () => [
      {
        id: 1,
        title: "Total Clientes",
        description: "Clientes registrados en el sistema",
        icon: (
          <Users size={28} weight="duotone" style={{ color: "var(--acento)" }} />
        ),
        valor: estadisticas.totalClientes,
        color: "var(--acento)",
      },
      {
        id: 2,
        title: "Vehiculos",
        description: "Vehiculos registrados",
        icon: (
          <Car size={28} weight="duotone" style={{ color: "var(--info)" }} />
        ),
        valor: estadisticas.totalVehiculos,
        color: "var(--info)",
      },
      {
        id: 3,
        title: "Pendientes",
        description: "Servicios en espera",
        icon: (
          <Clock size={28} weight="duotone" style={{ color: "var(--advertencia)" }} />
        ),
        valor: estadisticas.serviciosPendientes,
        color: "var(--advertencia)",
      },
      {
        id: 4,
        title: "Completados",
        description: "Servicios finalizados",
        icon: (
          <CheckCircle size={28} weight="duotone" style={{ color: "var(--exito)" }} />
        ),
        valor: estadisticas.serviciosCompletados,
        color: "var(--exito)",
      },
      {
        id: 5,
        title: "Ingresos",
        description: "Ingresos del mes actual",
        icon: (
          <CurrencyEur size={28} weight="duotone" style={{ color: "var(--acento)" }} />
        ),
        valor: `\u20AC${estadisticas.ingresosMes.toLocaleString("es-ES", { minimumFractionDigits: 0 })}`,
        color: "var(--acento)",
      },
    ],
    [estadisticas]
  );

  const iniciales = (nombre, apellidos) => {
    const n = nombre?.charAt(0) ?? "";
    const a = apellidos?.charAt(0) ?? "";
    return `${n}${a}`.toUpperCase() || "?";
  };

  /* ── Skeleton de carga ── */
  if (cargando) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        {/* Carrusel skeleton */}
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-72 rounded-xl" />
          ))}
        </div>
        {/* Graficos skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[380px] rounded-xl" />
          <Skeleton className="h-[380px] rounded-xl" />
        </div>
        {/* Tabla skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--fuente-encabezado)]">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-muted-foreground mt-1">
            Panel de control &mdash;{" "}
            {format(new Date(), "dd 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            asChild
            variant="default"
            className="bg-primary hover:bg-primary/80 text-white"
          >
            <Link to="/panel/clientes">
              <Plus size={18} weight="bold" className="mr-2" />
              Nuevo Cliente
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border text-foreground hover:bg-card"
          >
            <Link to="/panel/servicios/nuevo">
              <Wrench size={18} weight="bold" className="mr-2" />
              Nuevo Servicio
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Carrusel de estadisticas ── */}
      <Carrusel
        items={elementosCarrusel}
        baseWidth={280}
        autoplay
        autoplayDelay={4000}
        pauseOnHover
        loop
      />

      {/* ── Grafico interactivo + Radial ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafico de barras interactivo */}
        <Card className={`lg:col-span-2 ${estiloTarjeta}`}>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle className="text-foreground">
                Actividad del Taller
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Ultimos 3 meses de actividad diaria
              </CardDescription>
            </div>
            <div className="flex">
              {["servicios", "facturado"].map((clave) => (
                <button
                  key={clave}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-border px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6 transition-colors data-[active=true]:bg-primary/5"
                  data-active={serieActiva === clave}
                  onClick={() => setSerieActiva(clave)}
                >
                  <span className="text-xs text-muted-foreground">
                    {configGrafico[clave].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl font-[family-name:var(--fuente-datos)] text-foreground">
                    {clave === "facturado"
                      ? `\u20AC${totales.facturado.toLocaleString("es-ES")}`
                      : totales.servicios.toLocaleString("es-ES")}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Sin datos de actividad aun
            </div>
          </CardContent>
        </Card>

        {/* Grafico radial de satisfaccion */}
        <Card className={`${estiloTarjeta} flex flex-col`}>
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-foreground">Satisfaccion</CardTitle>
            <CardDescription className="text-muted-foreground">
              Tasa de satisfaccion del cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pb-0">
            {estadisticas.satisfaccion > 0 ? (
              <ChartContainer
                config={configRadial}
                className="mx-auto aspect-square max-h-[250px] w-full"
              >
                <RadialBarChart
                  data={datosRadial}
                  startAngle={90}
                  endAngle={90 + (360 * estadisticas.satisfaccion) / 100}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-border last:fill-card"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar
                    dataKey="valor"
                    background
                    cornerRadius={10}
                    fill="var(--exito, #22c55e)"
                  />
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="text-4xl font-bold"
                              style={{ fill: "var(--texto-principal)" }}
                            >
                              {estadisticas.satisfaccion}%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </RadialBarChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8">
                <Skeleton className="h-[160px] w-[160px] rounded-full" />
                <p className="text-sm text-muted-foreground">Sin datos de satisfaccion</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm border-t-0 bg-transparent">
            <div className="flex items-center gap-2 font-medium leading-none text-foreground">
              Tendencia positiva este mes <TrendUp size={16} className="text-[var(--exito)]" />
            </div>
            <div className="leading-none text-[var(--texto-deshabilitado)]">
              Basado en encuestas de los ultimos 90 dias
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent services table + Recent customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 ${estiloTarjeta}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Servicios Recientes</CardTitle>
            <Link
              to="/panel/servicios"
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {serviciosRecientes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-[var(--texto-deshabilitado)]">Cliente</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Servicio</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Estado</TableHead>
                    <TableHead className="text-[var(--texto-deshabilitado)]">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviciosRecientes.map((s) => (
                    <TableRow key={s.id} className="border-border">
                      <TableCell className="text-foreground">
                        {s.clienteNombre ?? s.clienteId ?? "\u2014"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.tipoServicio ?? "\u2014"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={badgeClase(s.estado)}
                        >
                          {estadoLabel(s.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--fuente-datos)] text-foreground">
                        \u20AC{(s.costo ?? 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-[var(--texto-deshabilitado)]">
                No hay servicios registrados aun.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={estiloTarjetaPlana}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Nuevos Clientes</CardTitle>
            <Link
              to="/panel/clientes"
              className="text-sm text-primary hover:underline"
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
                    className="flex items-center gap-3 p-3 rounded-[var(--radio-md)] hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {iniciales(c.nombre, c.apellidos)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {c.nombre} {c.apellidos}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-[var(--texto-deshabilitado)]">
                No hay clientes registrados aun.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Acciones Rapidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`${estiloTarjetaPlana} hover:border-primary/30 transition-colors cursor-pointer`}>
            <Link to="/panel/clientes/nuevo" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-primary/10 p-3 w-fit mb-3">
                <Plus size={24} weight="duotone" className="text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Nuevo Cliente
              </h4>
              <p className="text-xs text-muted-foreground">
                Registrar un nuevo cliente en el sistema
              </p>
            </Link>
          </Card>

          <Card className={`${estiloTarjetaPlana} hover:border-primary/30 transition-colors cursor-pointer`}>
            <Link to="/panel/servicios/nuevo" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-[var(--info)]/10 p-3 w-fit mb-3">
                <Wrench size={24} weight="duotone" className="text-[var(--info)]" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Nuevo Servicio
              </h4>
              <p className="text-xs text-muted-foreground">
                Registrar un nuevo servicio para un cliente
              </p>
            </Link>
          </Card>

          <Card className={`${estiloTarjetaPlana} hover:border-primary/30 transition-colors cursor-pointer`}>
            <Link to="/panel/vehiculos" className="block p-6 no-underline">
              <div className="rounded-[var(--radio-lg)] bg-[var(--advertencia)]/10 p-3 w-fit mb-3">
                <Car size={24} weight="duotone" className="text-[var(--advertencia)]" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Gestionar Vehiculos
              </h4>
              <p className="text-xs text-muted-foreground">
                Ver y administrar vehiculos registrados
              </p>
            </Link>
          </Card>

          {user?.rol === "admin" && (
            <Card className={`${estiloTarjetaPlana} hover:border-primary/30 transition-colors cursor-pointer`}>
              <Link to="/panel/usuarios" className="block p-6 no-underline">
                <div className="rounded-[var(--radio-lg)] bg-[var(--exito)]/10 p-3 w-fit mb-3">
                  <GearSix size={24} weight="duotone" className="text-[var(--exito)]" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Gestionar Usuarios
                </h4>
                <p className="text-xs text-muted-foreground">
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
