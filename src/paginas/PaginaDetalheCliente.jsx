import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import {
  clienteService,
  vehiculoService,
  servicioService,
} from "../data/database";
import "../styles/Dashboard.scss";

const ClienteDetailPage = () => {
  const { clienteId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ClienteDetailPage mounted with clienteId:", clienteId);
    if (!user) {
      navigate("/login");
      return;
    }
    loadData();
  }, [clienteId, user, navigate]);

  const loadData = () => {
    console.log("Loading data for clienteId:", clienteId);
    setLoading(true);
    setError(null);
    try {
      const clienteData = clienteService.read(clienteId);
      console.log("Cliente data found:", clienteData);

      if (!clienteData) {
        console.log("Cliente not found for id:", clienteId);
        setError("Cliente não encontrado.");
        setLoading(false);
        return;
      }

      setCliente(clienteData);
      setVehiculos(vehiculoService.getByCliente(clienteId));
      setServicios(servicioService.getByCliente(clienteId));
    } catch (e) {
      setError("Erro ao carregar os dados do cliente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ title, value, icon }) => {
    if (!title || value === undefined) return null;

    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "var(--body-color)",
            opacity: 0.8,
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          {icon} {title}
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--heading-color)",
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    );
  };

  InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.string.isRequired,
  };

  if (loading) {
    return (
      <>
        <CommonPageHero title="Detalhes do Cliente" />
        <div className="dashboard-container">
          <div
            className="container"
            style={{ textAlign: "center", padding: "80px 0" }}
          >
            <div
              className="loading-skeleton"
              style={{ width: "200px", height: "20px", margin: "0 auto" }}
            />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CommonPageHero title="Erro" />
        <div className="dashboard-container">
          <div
            className="container"
            style={{ textAlign: "center", padding: "80px 0" }}
          >
            <h2 style={{ color: "var(--primary-color)", marginBottom: "24px" }}>
              {error}
            </h2>
            <Link to="/dashboard/clientes" className="primary-action-btn">
              ← Voltar para a Lista de Clientes
            </Link>
          </div>
        </div>
      </>
    );
  }

  const tipoConfig = {
    VIP: { color: "#f59e0b" },
    Regular: { color: "#10b981" },
    Empresarial: { color: "#3b82f6" },
    Especial: { color: "#8b5cf6" },
  };

  return (
    <>
      <CommonPageHero title="Detalhes do Cliente" />

      <div
        className="dashboard-container"
        style={{ backgroundColor: "#101010", color: "#d3d3d3" }}
      >
        <div className="container">
          {/* Header do Perfil */}
          <div className="dashboard-header">
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${tipoConfig[cliente.tipo]?.color || "#6b7280"}, ${tipoConfig[cliente.tipo]?.color || "#6b7280"}dd)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "700",
                }}
              >
                {cliente.nombre.charAt(0)}
                {cliente.apellidos.charAt(0)}
              </div>
              <div>
                <h1
                  className="dashboard-title"
                  style={{ fontSize: "32px", marginBottom: "4px" }}
                >
                  {cliente.nombre} {cliente.apellidos}
                </h1>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      background: tipoConfig[cliente.tipo]?.color || "#6b7280",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {cliente.tipo}
                  </span>
                  <span
                    style={{
                      background: cliente.activo ? "#22c55e" : "#ef4444",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {cliente.activo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
            <div className="dashboard-actions">
              <Link
                to={`/dashboard/clientes/editar/${cliente.id}`}
                className="logout-btn"
              >
                ✏️ Editar Cliente
              </Link>
              <Link
                to="/dashboard/clientes"
                className="primary-action-btn"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 61, 36, 0.3)",
                }}
              >
                ← Voltar
              </Link>
            </div>
          </div>

          {/* Painel de Informações */}
          <div className="dashboard-panel" style={{ marginBottom: "32px" }}>
            <div className="panel-header">
              <h3>Informações de Contato e Endereço</h3>
            </div>
            <div
              className="quick-actions-grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              }}
            >
              <InfoCard icon="📧" title="Email" value={cliente.email} />
              <InfoCard icon="📱" title="Telefone" value={cliente.telefono} />
              <InfoCard icon="📍" title="Endereço" value={cliente.direccion} />
              <InfoCard icon="🏙️" title="Cidade" value={cliente.ciudad} />
              <InfoCard
                icon="📫"
                title="Código Postal"
                value={cliente.codigoPostal}
              />
              <InfoCard
                icon="📅"
                title="Cliente desde"
                value={new Date(cliente.fechaRegistro).toLocaleDateString(
                  "pt-BR",
                )}
              />
            </div>
            {cliente.notas && (
              <div style={{ marginTop: "20px" }}>
                <InfoCard icon="📝" title="Observações" value={cliente.notas} />
              </div>
            )}
          </div>

          {/* Seção de Veículos */}
          <div className="dashboard-panel" style={{ marginBottom: "32px" }}>
            <div className="panel-header">
              <h3>Veículos do Cliente ({vehiculos.length})</h3>
              <Link
                to={`/dashboard/vehiculos/novo?clienteId=${cliente.id}`}
                className="panel-action"
              >
                + Adicionar Veículo
              </Link>
            </div>
            {vehiculos.length > 0 ? (
              <div className="quick-actions-grid">
                {vehiculos.map((v) => (
                  <div
                    key={v.id}
                    className="dashboard-quick-action"
                    style={{
                      height: "auto",
                      minHeight: "150px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      console.log(
                        "Navigating to vehicle services for vehicle ID:",
                        v.id,
                      );
                      navigate(`/dashboard/vehiculos/${v.id}/servicios`);
                    }}
                  >
                    <div className="action-icon">🚗</div>
                    <h4 className="action-title" style={{ fontSize: "18px" }}>
                      {v.marca} {v.modelo}
                    </h4>
                    <p className="action-description">
                      <strong>Matrícula:</strong> {v.matricula} <br />
                      <strong>Ano:</strong> {v.año} • <strong>Km:</strong>{" "}
                      {v.kilometraje?.toLocaleString() || 0}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
                Este cliente ainda não possui veículos cadastrados.
              </p>
            )}
          </div>

          {/* Seção de Histórico de Serviços */}
          <div className="dashboard-panel">
            <div className="panel-header" style={{ marginBottom: "24px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  ⚙️
                </div>
                <h3 style={{ margin: 0 }}>
                  Histórico de Serviços ({servicios.length})
                </h3>
              </div>
              <Link
                to={`/dashboard/servicios/nuevo?clienteId=${cliente.id}`}
                className="panel-action"
                style={{
                  background: "linear-gradient(135deg, #ff3d24, #ff6b4a)",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255, 61, 36, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(255, 61, 36, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(255, 61, 36, 0.3)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(1px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(255, 61, 36, 0.2)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(255, 61, 36, 0.4)";
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                  }}
                >
                  +
                </span>
                Novo Serviço
                <span
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background:
                      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                    transform: "rotate(45deg)",
                    transition: "all 0.5s ease",
                    opacity: "0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.left = "100%";
                  }}
                ></span>
              </Link>
            </div>
            {servicios.length > 0 ? (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div className="services-grid">
                  <div>Data</div>
                  <div>Veículo</div>
                  <div>Serviço</div>
                  <div>Status</div>
                  <div style={{ textAlign: "right" }}>Valor</div>
                </div>
                {servicios.map((s) => {
                  const vehiculo = vehiculos.find((v) => v.id === s.vehiculoId);
                  const statusConfig = {
                    completado: {
                      color: "#22c55e",
                      bg: "rgba(34, 197, 94, 0.15)",
                      label: "Completado",
                    },
                    en_proceso: {
                      color: "#f59e0b",
                      bg: "rgba(245, 158, 11, 0.15)",
                      label: "Em Processo",
                    },
                    pendiente: {
                      color: "#ef4444",
                      bg: "rgba(239, 68, 68, 0.15)",
                      label: "Pendente",
                    },
                  };
                  const status =
                    statusConfig[s.estado] || statusConfig.pendente;

                  return (
                    <div key={s.id} className="services-grid-item">
                      <div
                        style={{
                          color: "var(--heading-color)",
                          fontWeight: "500",
                          fontSize: "14px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <div className="services-grid-mobile-label">Data</div>
                        {new Date(s.fecha).toLocaleDateString("pt-BR")}
                      </div>
                      <div
                        style={{
                          color: "var(--body-color)",
                          fontSize: "14px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <div className="services-grid-mobile-label">
                          Veículo
                        </div>
                        {vehiculo
                          ? `${vehiculo.marca} ${vehiculo.modelo}`
                          : "N/A"}
                      </div>
                      <div
                        style={{
                          color: "var(--heading-color)",
                          fontWeight: "500",
                          fontSize: "14px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <div className="services-grid-mobile-label">
                          Serviço
                        </div>
                        {s.tipo}
                      </div>
                      <div>
                        <div className="services-grid-mobile-label">Status</div>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: status.bg,
                            color: status.color,
                            display: "inline-block",
                            minWidth: "80px",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                            transform: "scale(1)",
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          color: "var(--heading-color)",
                          fontWeight: "600",
                          fontSize: "14px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <div className="services-grid-mobile-label">Valor</div>€
                        {s.costo?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "var(--body-color)",
                  opacity: 0.7,
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
                <h4
                  style={{ marginBottom: "8px", color: "var(--heading-color)" }}
                >
                  Nenhum serviço registrado
                </h4>
                <p style={{ margin: 0 }}>
                  Este cliente ainda não possui serviços cadastrados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClienteDetailPage;
