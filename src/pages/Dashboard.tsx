import { Card } from '@/components/ui/card';
import { AreaChart, BarChart, LineChart } from '@/components/charts';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, TrendingUp, Users, FileText, Target } from 'lucide-react';

export function Dashboard() {
  const revenueData = [
    { name: 'Jan', total: 4000 },
    { name: 'Fev', total: 3000 },
    { name: 'Mar', total: 2000 },
    { name: 'Abr', total: 2780 },
    { name: 'Mai', total: 1890 },
    { name: 'Jun', total: 2390 },
    { name: 'Jul', total: 3490 },
  ];

  const servicesData = [
    { name: 'Revisão', count: 120 },
    { name: 'Troca de Óleo', count: 90 },
    { name: 'Pneus', count: 75 },
    { name: 'Freios', count: 60 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header com Ações Rápidas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido de vuelta, aquí está tu resumen de hoy
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Último mes
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* KPI Cards com Animações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ingresos del Mes"
          value="€12,450"
          change="+12.5%"
          trend="up"
          icon={<TrendingUp />}
          gradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Clientes Activos"
          value="248"
          change="+5"
          trend="up"
          icon={<Users />}
          gradient="from-green-500 to-green-600"
        />
        <StatsCard
          title="Facturas Pendientes"
          value="13"
          change="-2"
          trend="down"
          icon={<FileText />}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatsCard
          title="Tasa de Conversión"
          value="68%"
          change="+3.2%"
          trend="up"
          icon={<Target />}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Gráficos Interativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Evolución de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={revenueData}
              height={300}
              gradient
              interactive
            />
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Servicios Más Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={servicesData}
              height={300}
              colors={['#3b82f6', '#10b981', '#f59e0b']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}