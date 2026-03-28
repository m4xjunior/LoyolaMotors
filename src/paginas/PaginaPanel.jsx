import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contextos/ContextoAutenticacion";
import {
  Users, Car, Clock, CheckCircle, TrendUp, TrendDown, Plus, Wrench,
} from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { servicioClientes } from "../servicios/servicioClientes";
import { servicioServicios } from "../servicios/servicioServicios";
import { servicioVehiculos } from "../servicios/servicioVehiculos";

/* ── Helpers ── */
const badgeClase = (estado) => {
  switch (estado) {
    case "completado":
      return "bg-[var(--exito)]/10 text-[var(--exito)] border-[var(--exito)]/30";
    case "en_proceso":
      return "bg-[var(--advertencia)]/10 text-[var(--advertencia)] border-[var(--advertencia)]/30";
    case "pendiente":
      return "bg-[var(--peligro)]/10 text-[var(--peligro)] border-[var(--peligro)]/30";
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

const calcularPorcentaje = (actual, anterior) => {
  if (anterior === 0) return actual > 0 ? 100 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
};

/* ── Chart config ── */
const configGrafico = {
  servicios: { label: "Servicios", color: "var(--primary)" },
  facturado: { label: "Facturado", color: "var(--info, #3b82f6)" },
};

/* ── Section Cards (ported from shadcn v4 section-cards.tsx) ── */
function TarjetasSeccion({ estadisticas, tendencias }) {
  const tarjetas = [
    {
      titulo: "Total Clientes",
      valor: estadisticas.totalClientes,
      descripcion: "Clientes registrados",
      piePagina: "Crecimiento respecto al mes anterior",
      icono: Users,
      porcentaje: tendencias.clientes,
    },
    {
      titulo: "Vehiculos",
      valor: estadisticas.totalVehiculos,
      descripcion: "Vehiculos en el sistema",
      piePagina: "Nuevos registros en el periodo",
      icono: Car,
      porcentaje: tendencias.vehiculos,
    },
    {
      titulo: "Pendientes",
      valor: estadisticas.serviciosPendientes,
      descripcion: "Servicios en espera",
      piePagina: "Requieren atencion inmediata",
      icono: Clock,
      porcentaje: tendencias.pendientes,
    },
    {
      titulo: "Completados",
      valor: estadisticas.serviciosCompletados,
      descripcion: "Servicios finalizados",
      piePagina: "Productividad del taller",
      icono: CheckCircle,
      porcentaje: tendencias.completados,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tarjetas.map((t) => {
        const esPositivo = t.porcentaje >= 0;
        return (
          <Card
            key={t.titulo}
            className="bg-gradient-to-br from-primary/5 to-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium font-[family-name:var(--fuente-cuerpo)]">
                {t.titulo}
              </CardDescription>
              <Badge
                variant="outline"
                className={
                  esPositivo
                    ? "bg-[var(--exito)]/10 text-[var(--exito)] border-[var(--exito)]/30"
                    : "bg-[var(--peligro)]/10 text-[var(--peligro)] border-[var(--peligro)]/30"
                }
              >
                {esPositivo ? (
                  <TrendUp size={12} weight="bold" />
                ) : (
                  <TrendDown size={12} weight="bold" />
                )}
                {esPositivo ? "+" : ""}{t.porcentaje}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-[family-name:var(--fuente-datos)] tabular-nums">
                {t.valor}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t.descripcion}</p>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-sm">
              {esPositivo ? (
                <TrendUp size={16} className="text-[var(--exito)]" />
              ) : (
                <TrendDown size={16} className="text-[var(--peligro)]" />
              )}
              <span className="text-muted-foreground text-xs">{t.piePagina}</span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

/* ── Area Chart Interactivo (ported from shadcn v4 chart-area-interactive.tsx) ── */
function GraficoAreaInteractivo({ servicios }) {
  const [rangoTiempo, setRangoTiempo] = useState("90d");

  const datosGrafico = useMemo(() => {
    if (!servicios || servicios.length === 0) return [];

    const ahora = new Date();
    const dias = rangoTiempo === "7d" ? 7 : rangoTiempo === "30d" ? 30 : 90;
    const desde = new Date(ahora);
    desde.setDate(desde.getDate() - dias);

    const mapa = {};
    for (let d = new Date(desde); d <= ahora; d.setDate(d.getDate() + 1)) {
      const clave = format(new Date(d), "yyyy-MM-dd");
      mapa[clave] = { fecha: clave, servicios: 0, facturado: 0 };
    }

    servicios.forEach((s) => {
      const fecha = s.fecha ?? s.creadoEn;
      if (!fecha) return;
      const clave = format(new Date(fecha), "yyyy-MM-dd");
      if (mapa[clave]) {
        mapa[clave].servicios += 1;
        mapa[clave].facturado += s.costo ?? 0;
      }
    });

    return Object.values(mapa);
  }, [servicios, rangoTiempo]);

  return (
    <Card className="rounded-xl transition-all duration-300 hover:border-primary/30">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="font-[family-name:var(--fuente-encabezado)]">
            Actividad del Taller
          </CardTitle>
          <CardDescription>
            Servicios realizados en el periodo seleccionado
          </CardDescription>
        </div>
        <div className="flex items-center px-6 py-4 sm:border-l">
          {/* Desktop: ToggleGroup */}
          <ToggleGroup
            type="single"
            value={rangoTiempo}
            onValueChange={(v) => v && setRangoTiempo(v)}
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="90d" size="sm">90 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d" size="sm">30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d" size="sm">7 dias</ToggleGroupItem>
          </ToggleGroup>
          {/* Mobile: Select */}
          <Select value={rangoTiempo} onValueChange={setRangoTiempo}>
            <SelectTrigger className="sm:hidden w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {datosGrafico.length > 0 ? (
          <ChartContainer config={configGrafico} className="aspect-auto h-[250px] w-full">
            <AreaChart data={datosGrafico}>
              <defs>
                <linearGradient id="fillServicios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillFacturado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--info, #3b82f6)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--info, #3b82f6)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="fecha"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(v) => format(new Date(v), "dd MMM", { locale: es })}
                className="text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => format(new Date(v), "dd 'de' MMMM yyyy", { locale: es })}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="servicios"
                type="natural"
                fill="url(#fillServicios)"
                stroke="var(--primary)"
                stackId="a"
              />
              <Area
                dataKey="facturado"
                type="natural"
                fill="url(#fillFacturado)"
                stroke="var(--info, #3b82f6)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px] gap-2">
            <Wrench size={40} weight="duotone" className="text-muted-foreground/50" />
            <p className="text-muted-foreground">Sin datos de actividad aun</p>
            <p className="text-muted-foreground/60 text-xs">Los servicios apareceran aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Data Table con Tabs (ported from shadcn v4 data-table.tsx) ── */
function TablaServicios({ servicios, clientes, vehiculos }) {
  return (
    <Card className="rounded-xl transition-all duration-300 hover:border-primary/30">
      <Tabs defaultValue="servicios">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-[family-name:var(--fuente-encabezado)]">
            Vista General
          </CardTitle>
          <TabsList>
            <TabsTrigger value="servicios">
              Servicios
              {servicios.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 min-w-4 px-1 text-[10px]">
                  {servicios.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="clientes">
              Clientes
              {clientes.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 min-w-4 px-1 text-[10px]">
                  {clientes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="vehiculos">
              Vehiculos
              {vehiculos.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 min-w-4 px-1 text-[10px]">
                  {vehiculos.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {/* Tab: Servicios */}
          <TabsContent value="servicios" className="mt-0">
            {servicios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicios.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium font-[family-name:var(--fuente-cuerpo)]">
                        {s.clienteNombre ?? s.clienteId ?? "\u2014"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.tipoServicio ?? "\u2014"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badgeClase(s.estado)}>
                          {estadoLabel(s.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-[family-name:var(--fuente-datos)] text-xs tabular-nums">
                        {s.fecha || s.creadoEn
                          ? format(new Date(s.fecha ?? s.creadoEn), "dd MMM yyyy", { locale: es })
                          : "\u2014"}
                      </TableCell>
                      <TableCell className="text-right font-[family-name:var(--fuente-datos)] tabular-nums">
                        {"\u20AC"}{(s.costo ?? 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Wrench size={40} weight="duotone" className="text-muted-foreground/50" />
                <p className="text-muted-foreground">No hay servicios registrados aun</p>
                <p className="text-muted-foreground/60 text-xs">Crea un nuevo servicio para comenzar</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Clientes */}
          <TabsContent value="clientes" className="mt-0">
            {clientes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium font-[family-name:var(--fuente-cuerpo)]">
                        {c.nombre} {c.apellidos}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.email ?? "\u2014"}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-[family-name:var(--fuente-datos)] tabular-nums">
                        {c.telefono ?? "\u2014"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Users size={40} weight="duotone" className="text-muted-foreground/50" />
                <p className="text-muted-foreground">No hay clientes registrados aun</p>
                <p className="text-muted-foreground/60 text-xs">Registra un cliente para comenzar</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Vehiculos */}
          <TabsContent value="vehiculos" className="mt-0">
            {vehiculos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca / Modelo</TableHead>
                    <TableHead>Matricula</TableHead>
                    <TableHead>Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculos.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium font-[family-name:var(--fuente-cuerpo)]">
                        {v.marca} {v.modelo}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--fuente-datos)] tabular-nums text-muted-foreground">
                        {v.matricula ?? "\u2014"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {v.clienteNombre ?? "\u2014"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Car size={40} weight="duotone" className="text-muted-foreground/50" />
                <p className="text-muted-foreground">No hay vehiculos registrados aun</p>
                <p className="text-muted-foreground/60 text-xs">Registra un vehiculo para comenzar</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

/* ── Componente principal ── */
export default function PaginaPanel() {
  const { user } = useAutenticacion();

  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalVehiculos: 0,
    serviciosPendientes: 0,
    serviciosCompletados: 0,
  });
  const [tendencias, setTendencias] = useState({
    clientes: 0,
    vehiculos: 0,
    pendientes: 0,
    completados: 0,
  });
  const [serviciosRecientes, setServiciosRecientes] = useState([]);
  const [todosServicios, setTodosServicios] = useState([]);
  const [clientesRecientes, setClientesRecientes] = useState([]);
  const [vehiculosRecientes, setVehiculosRecientes] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientes, servicios, vehiculos] = await Promise.all([
          servicioClientes.obtenerTodos(),
          servicioServicios.obtenerTodos(),
          servicioVehiculos.obtenerTodos(),
        ]);

        const pendientes = servicios.filter((s) => s.estado === "pendiente").length;
        const completados = servicios.filter((s) => s.estado === "completado").length;

        setEstadisticas({
          totalClientes: clientes.length,
          totalVehiculos: vehiculos.length,
          serviciosPendientes: pendientes,
          serviciosCompletados: completados,
        });

        /* Calcular tendencias comparando ultimos 30 dias vs 30 dias anteriores */
        const ahora = new Date();
        const hace30 = new Date(ahora);
        hace30.setDate(hace30.getDate() - 30);
        const hace60 = new Date(ahora);
        hace60.setDate(hace60.getDate() - 60);

        const clientesReciente = clientes.filter((c) => new Date(c.creadoEn) >= hace30).length;
        const clientesAnterior = clientes.filter((c) => {
          const fecha = new Date(c.creadoEn);
          return fecha >= hace60 && fecha < hace30;
        }).length;

        const vehiculosReciente = vehiculos.filter((v) => new Date(v.creadoEn) >= hace30).length;
        const vehiculosAnterior = vehiculos.filter((v) => {
          const fecha = new Date(v.creadoEn);
          return fecha >= hace60 && fecha < hace30;
        }).length;

        const serviciosReciente30 = servicios.filter((s) => {
          const fecha = new Date(s.fecha ?? s.creadoEn);
          return fecha >= hace30;
        });
        const serviciosAnterior30 = servicios.filter((s) => {
          const fecha = new Date(s.fecha ?? s.creadoEn);
          return fecha >= hace60 && fecha < hace30;
        });

        const pendientesReciente = serviciosReciente30.filter((s) => s.estado === "pendiente").length;
        const pendientesAnterior = serviciosAnterior30.filter((s) => s.estado === "pendiente").length;
        const completadosReciente = serviciosReciente30.filter((s) => s.estado === "completado").length;
        const completadosAnterior = serviciosAnterior30.filter((s) => s.estado === "completado").length;

        setTendencias({
          clientes: calcularPorcentaje(clientesReciente, clientesAnterior),
          vehiculos: calcularPorcentaje(vehiculosReciente, vehiculosAnterior),
          pendientes: calcularPorcentaje(pendientesReciente, pendientesAnterior),
          completados: calcularPorcentaje(completadosReciente, completadosAnterior),
        });

        setTodosServicios(servicios);

        setServiciosRecientes(
          [...servicios]
            .sort((a, b) => new Date(b.fecha ?? b.creadoEn) - new Date(a.fecha ?? a.creadoEn))
            .slice(0, 8)
        );

        setClientesRecientes(
          [...clientes]
            .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
            .slice(0, 8)
        );

        setVehiculosRecientes(
          [...vehiculos]
            .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
            .slice(0, 8)
        );
      } catch {
        // empty state — backend not connected yet
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--fuente-encabezado)]">
            Bienvenido, {user?.nombre ?? "Admin"}
          </h1>
          <p className="text-muted-foreground mt-1 font-[family-name:var(--fuente-cuerpo)]">
            Panel de control &mdash; {format(new Date(), "dd 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button asChild className="shadow-[0_4px_12px_rgba(220,38,38,0.3)]">
            <Link to="/panel/clientes/nuevo">
              <Plus size={18} weight="bold" className="mr-2" />
              Nuevo Cliente
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/panel/servicios/nuevo">
              <Wrench size={18} weight="bold" className="mr-2" />
              Nuevo Servicio
            </Link>
          </Button>
        </div>
      </div>

      {/* Section Cards */}
      <TarjetasSeccion estadisticas={estadisticas} tendencias={tendencias} />

      {/* Area Chart */}
      <GraficoAreaInteractivo servicios={todosServicios} />

      {/* Data Table with Tabs */}
      <TablaServicios
        servicios={serviciosRecientes}
        clientes={clientesRecientes}
        vehiculos={vehiculosRecientes}
      />
    </div>
  );
}
