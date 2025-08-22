
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import { Card } from '../components/ui/card';
import { AreaChart } from '../components/charts/AreaChart';
import { BarChart } from '../components/charts/BarChart';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <Card>
        <p>Conteúdo do Dashboard</p>
      </Card>
      <StatsCard title="Vendas" value="R$ 10.000" />
      <RecentActivity />
      <div style={{ height: '300px' }}>
        <AreaChart />
      </div>
      <div style={{ height: '300px' }}>
        <BarChart />
      </div>
    </div>
  );
};

export default Dashboard;