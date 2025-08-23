import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { mockCustomers } from "../data/mockCustomers";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "../styles/Dashboard.scss";
import SimpleChart from "../components/Dashboard/SimpleChart";
import CircularProgress from "../components/Dashboard/CircularProgress";
import db, {
  getMetricas,
  getChartData,
  getRecentActivities,
} from "../data/database";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalVehiculos: 0,
    serviciosPendientes: 0,
    serviciosCompletados: 0,
    ingresosMes: 0,
  });
  const [recentServices, setRecentServices] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [satisfactionRate, setSatisfactionRate] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 98.5,
    avgRating: 4.8,
    avgRevenuePerCustomer: 12400,
    avgServiceTime: 24,
  });

  useEffect(() => {
    // Carregar dados iniciais
    loadDashboardData();

    // Listener para recarregar todos os dados quando qualquer coisa no DB mudar
    const handleDbUpdate = () => {
      loadDashboardData();
    };

    db.on("*", handleDbUpdate);

    // Atualizar métricas do sistema a cada 30 segundos
    const metricsInterval = setInterval(updateSystemMetrics, 30000);

    // Limpar listeners para evitar memory leaks
    return () => {
      db.off("*", handleDbUpdate);
      clearInterval(metricsInterval);
    };
  }, []);

  const loadDashboardData = () => {
    // Obter métricas reais do banco
    const metrics = getMetricas();
    setStats(metrics);

    // Obter dados do gráfico
    const chartData = getChartData();
    setMonthlyData(chartData.monthlyServices);

    // Calcular taxa de satisfação
    setSatisfactionRate(metrics.satisfacao || 0);

    // Obter atividades recentes
    const activities = getRecentActivities(10);
    setRecentActivities(activities);

    // Simular dados de serviços e clientes recentes
    const allServices = db
      .getAll("servicios")
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 6);
    setRecentServices(allServices);

    const allCustomers = db
      .getAll("clientes")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    setRecentCustomers(allCustomers);
  };

  const updateSystemMetrics = () => {
    // Simular pequenas variações nas métricas do sistema
    setSystemMetrics((prev) => ({
      uptime: Math.min(
        99.9,
        Math.max(95.0, prev.uptime + (Math.random() - 0.5) * 0.1),
      ),
      avgRating: Math.min(
        5.0,
        Math.max(3.0, prev.avgRating + (Math.random() - 0.5) * 0.05),
      ),
      avgRevenuePerCustomer: Math.max(
        8000,
        prev.avgRevenuePerCustomer + (Math.random() - 0.5) * 200,
      ),
      avgServiceTime: Math.max(
        12,
        prev.avgServiceTime + (Math.random() - 0.5) * 1,
      ),
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getCustomerName = (clienteId) => {
    const customer = mockCustomers.find((c) => c.id === clienteId);
    return customer
      ? `${customer.nombre} ${customer.apellidos}`
      : "Cliente no encontrado";
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "completado":
        return "completed";
      case "en_proceso":
        return "in-progress";
      case "pendiente":
        return "pending";
      default:
        return "default";
    }
  };

  // Componente de ícones SVG
  const Icons = {
    users: () => (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    car: () => (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.5v-15m0 0a2.25 2.25 0 012.25-2.25h4.5m0 0v18m0 0H6.75a2.25 2.25 0 01-2.25-2.25"
        />
      </svg>
    ),
    clock: () => (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    check: () => (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    money: () => (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    plus: () => (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    wrench: () => (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    settings: () => (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  };

  const StatCard = ({ title, value, subtitle, icon, trend }) => (
    <div className="dashboard-stat-card">
      <div className="stat-icon">{icon}</div>
      {trend && (
        <div className={`stat-trend ${trend > 0 ? "positive" : "negative"}`}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </div>
      )}

      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.element.isRequired,
    trend: PropTypes.number,
  };

  const QuickActionCard = ({ title, description, to, icon }) => (
    <Link to={to} className="dashboard-quick-action">
      <div className="action-icon">{icon}</div>
      <h4 className="action-title">{title}</h4>
      <p className="action-description">{description}</p>
    </Link>
  );

  QuickActionCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
  };

  const getCustomerInitials = (nome, apellidos) => {
    return `${nome.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  // Funções auxiliares para atividades em tempo real
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      clientes_created: "👤",
      servicios_created: "🔧",
      vehiculos_created: "🚗",
      servicios_completed: "✅",
      payment_received: "💰",
      appointment_created: "📅",
      system_updated: "⚙️",
      default: "📋",
    };
    return icons[type] || icons.default;
  };

  const getActivityColor = (type) => {
    const colors = {
      clientes_created: "#22c55e",
      servicios_created: "#3b82f6",
      vehiculos_created: "#f59e0b",
      servicios_completed: "#10b981",
      payment_received: "#8b5cf6",
      appointment_created: "#06b6d4",
      system_updated: "#6b7280",
      default: "var(--primary-color)",
    };
    return colors[type] || colors.default;
  };

  const getActivityTitle = (type) => {
    const titles = {
      clientes_created: "Novo Cliente",
      servicios_created: "Serviço Agendado",
      vehiculos_created: "Veículo Cadastrado",
      servicios_completed: "Serviço Completado",
      payment_received: "Pagamento Recebido",
      appointment_created: "Agendamento Criado",
      system_updated: "Sistema Atualizado",
      default: "Atividade",
    };
    return titles[type] || titles.default;
  };

  return (
    <>
      <CommonPageHero title="Dashboard - Gestão de Clientes" />

      <div
        className="dashboard-container"
        style={{ backgroundColor: "#101010", color: "#d3d3d3" }}
      >
        <div className="container">
          {/* Header com saudação e ações */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Olá, {user?.nombre}! 👋</h1>
              <p className="dashboard-subtitle">
                Seja bem-vindo ao painel de controle da LoyolaMotors
              </p>
              <div className="dashboard-status">
                <div className="status-indicator"></div>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--body-color)",
                    opacity: 0.8,
                  }}
                >
                  Sistema operacional •{" "}
                  {format(new Date(), "dd/MM/yyyy • HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>

            <div className="dashboard-actions">
              <Link to="/dashboard/clientes" className="primary-action-btn">
                <Icons.users />
                Gestionar Clientes
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Sair do Sistema
              </button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            <StatCard
              title="Total de Clientes"
              value={stats.totalClientes}
              subtitle="Clientes ativos no sistema"
              icon={<Icons.users />}
              trend={8.2}
            />
            <StatCard
              title="Veículos Cadastrados"
              value={stats.totalVehiculos}
              subtitle="Veículos registrados"
              icon={<Icons.car />}
              trend={5.4}
            />
            <StatCard
              title="Serviços Pendentes"
              value={stats.serviciosPendientes}
              subtitle="Aguardando atendimento"
              icon={<Icons.clock />}
              trend={-2.1}
            />
            <StatCard
              title="Serviços Completados"
              value={stats.serviciosCompletados}
              subtitle="Finalizados com sucesso"
              icon={<Icons.check />}
              trend={12.3}
            />
            <StatCard
              title="Receita do Mês"
              value={`€${stats.ingresosMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              subtitle={format(new Date(), "MMMM yyyy", { locale: ptBR })}
              icon={<Icons.money />}
              trend={15.8}
            />
          </div>

          {/* Performance Metrics */}
          <div className="performance-panel">
            <div className="performance-header">
              <h3>Métricas de Performance</h3>
            </div>
            <div className="performance-grid">
              <div>
                <SimpleChart
                  data={monthlyData}
                  title="Serviços por Mês"
                  color="#ff3d24"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  percentage={satisfactionRate}
                  size={140}
                  strokeWidth={10}
                  color="#22c55e"
                  label="Taxa de Satisfação"
                />
              </div>
            </div>
          </div>

          <div className="dashboard-main-grid">
            {/* Serviços Recentes */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Serviços Recentes</h3>
                <Link to="/dashboard/servicios" className="panel-action">
                  Ver todos →
                </Link>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Status</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentServices.map((service) => (
                      <tr key={service.id}>
                        <td className="customer-name">
                          {getCustomerName(service.clienteId)}
                        </td>
                        <td className="service-type">{service.tipoServicio}</td>
                        <td>
                          <span
                            className={`status-badge ${getStatusColor(service.estado)}`}
                          >
                            {service.estado.charAt(0).toUpperCase() +
                              service.estado.slice(1).replace("_", " ")}
                          </span>
                        </td>
                        <td className="service-cost">
                          €{service.costo.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clientes Recentes */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Novos Clientes</h3>
                <Link to="/dashboard/clientes" className="panel-action">
                  Ver todos →
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="customer-card">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {getCustomerInitials(
                          customer.nombre,
                          customer.apellidos,
                        )}
                      </div>
                      <div className="customer-details">
                        <p className="customer-name">
                          {customer.nombre} {customer.apellidos}
                        </p>
                        <p className="customer-email">{customer.email}</p>
                      </div>
                    </div>
                    <div className="customer-date">
                      {format(customer.fechaRegistro, "dd/MM/yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline - Real Time */}
          <div className="activity-timeline">
            <div className="timeline-header">
              <h3>Atividades em Tempo Real</h3>
              <p className="timeline-subtitle">
                Últimas ações no sistema •
                <span style={{ color: "#22c55e", marginLeft: "4px" }}>
                  ● AO VIVO
                </span>
              </p>
            </div>
            <div className="timeline-list">
              {recentActivities.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "var(--body-color)",
                    opacity: 0.6,
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    ⏳
                  </div>
                  <p>Aguardando atividades...</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const timeAgo = getTimeAgo(activity.timestamp);
                  const activityIcon = getActivityIcon(activity.type);

                  return (
                    <div key={activity.id || index} className="timeline-item">
                      <div
                        className="timeline-marker"
                        style={{
                          backgroundColor: getActivityColor(activity.type),
                        }}
                      ></div>
                      <div className="timeline-content">
                        <h4 className="timeline-title">
                          {activityIcon} {getActivityTitle(activity.type)}
                        </h4>
                        <p className="timeline-description">
                          {activity.description}
                        </p>
                        <span className="timeline-time">
                          {timeAgo} • por {activity.usuario}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mini Stats Cards - Real Time */}
          <div className="mini-stat-cards">
            <div className="mini-stat-card">
              <div className="mini-stat-value">
                {systemMetrics.uptime.toFixed(1)}%
              </div>
              <div className="mini-stat-label">Uptime do Sistema</div>
              <div className="mini-stat-change positive">
                {systemMetrics.uptime > 98.5 ? "+" : ""}
                {(systemMetrics.uptime - 98.5).toFixed(1)}%
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">
                {systemMetrics.avgRating.toFixed(1)}/5
              </div>
              <div className="mini-stat-label">Avaliação Média</div>
              <div className="mini-stat-change positive">
                {systemMetrics.avgRating > 4.8 ? "+" : ""}
                {(systemMetrics.avgRating - 4.8).toFixed(1)}
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">
                €{(systemMetrics.avgRevenuePerCustomer / 1000).toFixed(1)}k
              </div>
              <div className="mini-stat-label">Receita Média/Cliente</div>
              <div className="mini-stat-change positive">
                {systemMetrics.avgRevenuePerCustomer > 12400 ? "+" : ""}
                {(
                  ((systemMetrics.avgRevenuePerCustomer - 12400) / 12400) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">
                {Math.round(systemMetrics.avgServiceTime)}h
              </div>
              <div className="mini-stat-label">Tempo Médio de Serviço</div>
              <div
                className={`mini-stat-change ${systemMetrics.avgServiceTime < 24 ? "positive" : "negative"}`}
              >
                {systemMetrics.avgServiceTime < 24 ? "-" : "+"}
                {Math.abs(Math.round(systemMetrics.avgServiceTime - 24))}h
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div>
            <h3 className="section-title">Ações Rápidas</h3>
            <div className="quick-actions-grid">
              <QuickActionCard
                title="Novo Cliente"
                description="Registrar um novo cliente no sistema"
                to="/dashboard/clientes/nuevo"
                icon={<Icons.plus />}
              />

              <QuickActionCard
                title="Novo Serviço"
                description="Cadastrar um novo serviço para cliente"
                to="/dashboard/servicios/nuevo"
                icon={<Icons.wrench />}
              />

              <QuickActionCard
                title="Gestionar Veículos"
                description="Ver e administrar veículos cadastrados"
                to="/dashboard/vehiculos"
                icon={<Icons.car />}
              />

              {user?.rol === "admin" && (
                <QuickActionCard
                  title="Gestionar Usuários"
                  description="Administrar usuários do sistema"
                  to="/dashboard/usuarios"
                  icon={<Icons.settings />}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
