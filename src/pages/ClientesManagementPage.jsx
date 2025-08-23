import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { clienteService } from "../data/database";
import {
  CUSTOMER_TYPES,
  SORT_OPTIONS_CLIENTS,
} from "../constants/vehicleConstants";
import "../styles/Dashboard.scss";

const ClientesManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedCity, setSelectedCity] = useState("todas");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [viewMode, setViewMode] = useState("cards");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    vip: 0,
    empresarial: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadClientes();

    if (location.state?.message) {
      showSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [user, navigate, location.state]);

  const calculateStats = useCallback(() => {
    setStats({
      total: filteredClientes.length,
      activos: filteredClientes.filter((c) => c.activo).length,
      vip: filteredClientes.filter((c) => c.tipo === "VIP").length,
      empresarial: filteredClientes.filter((c) => c.tipo === "Empresarial")
        .length,
    });
  }, [filteredClientes]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const clientesData = clienteService.getAll();
      setClientes(clientesData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClientes = useCallback(() => {
    let filtered = [...clientes];

    if (searchTerm) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefone.includes(searchTerm) ||
          cliente.ciudad.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedFilter !== "todos") {
      filtered = filtered.filter((cliente) => cliente.tipo === selectedFilter);
    }

    if (selectedCity !== "todas") {
      filtered = filtered.filter((cliente) => cliente.ciudad === selectedCity);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredClientes(filtered);
    setCurrentPage(1);
  }, [clientes, searchTerm, selectedFilter, selectedCity, sortBy, sortOrder]);

  useEffect(() => {
    filterAndSortClientes();
  }, [filterAndSortClientes]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const showSuccessMessage = (message) => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleDeleteCliente = async (clienteId) => {
    try {
      clienteService.delete(clienteId);
      setClientes((prev) => prev.filter((c) => c.id !== clienteId));
      showSuccessMessage("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const confirmDelete = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedClientes.length === 0) return;

    if (
      window.confirm(
        `Tem certeza que deseja excluir ${selectedClientes.length} cliente(s)?`,
      )
    ) {
      selectedClientes.forEach((id) => {
        clienteService.delete(id);
      });
      setClientes((prev) =>
        prev.filter((c) => !selectedClientes.includes(c.id)),
      );
      setSelectedClientes([]);
      showSuccessMessage(
        `${selectedClientes.length} cliente(s) excluído(s) com sucesso!`,
      );
    }
  };

  const toggleClienteSelection = (clienteId) => {
    setSelectedClientes((prev) =>
      prev.includes(clienteId)
        ? prev.filter((id) => id !== clienteId)
        : [...prev, clienteId],
    );
  };

  const toggleAllSelection = () => {
    if (
      selectedClientes.length === currentClientes.length &&
      currentClientes.length > 0
    ) {
      setSelectedClientes([]);
    } else {
      setSelectedClientes(currentClientes.map((c) => c.id));
    }
  };

  const cities = [...new Set(clientes.map((c) => c.ciudad))].sort();

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  if (loading) {
    return (
      <>
        <CommonPageHero title="Gestão de Clientes" />
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

  return (
    <>
      <CommonPageHero title="Gestão de Clientes" />

      <div className="dashboard-container">
        <div className="container">
          {/* Header da Página */}
          <div
            className="dashboard-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h1 className="dashboard-title">Gestão de Clientes</h1>
              <p className="dashboard-subtitle">
                Gerir todos os clientes da LoyolaMotors
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/dashboard/clientes/novo"
                className="primary-action-btn"
              >
                + Novo Cliente
              </Link>
              <Link to="/dashboard" className="logout-btn">
                ← Dashboard
              </Link>
              {selectedClientes.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Excluir ({selectedClientes.length})
                </button>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                label: "Total de Clientes",
                value: stats.total,
                color: "#ff3d24",
              },
              {
                label: "Clientes Ativos",
                value: stats.activos,
                color: "#22c55e",
              },
              { label: "Clientes VIP", value: stats.vip, color: "#f59e0b" },
              {
                label: "Empresariais",
                value: stats.empresarial,
                color: "#3b82f6",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "var(--body-color)", opacity: 0.8 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filtros e Busca */}
          <div className="dashboard-panel" style={{ marginBottom: "32px" }}>
            <div className="panel-header">
              <h3>Filtros e Busca</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setViewMode("cards")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background:
                      viewMode === "cards" ? "#ff3d24" : "transparent",
                    color: viewMode === "cards" ? "white" : "var(--body-color)",
                    cursor: "pointer",
                  }}
                >
                  📋 Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background:
                      viewMode === "table" ? "#ff3d24" : "transparent",
                    color: viewMode === "table" ? "white" : "var(--body-color)",
                    cursor: "pointer",
                  }}
                >
                  📊 Tabela
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    color: "var(--body-color)",
                  }}
                >
                  Buscar:
                </label>
                <input
                  type="text"
                  placeholder="Nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--heading-color)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    color: "var(--body-color)",
                  }}
                >
                  Tipo:
                </label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--heading-color)",
                  }}
                >
                  {CUSTOMER_TYPES.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    color: "var(--body-color)",
                  }}
                >
                  Cidade:
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--heading-color)",
                  }}
                >
                  <option value="todas">Todas as Cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    color: "var(--body-color)",
                  }}
                >
                  Ordenar por:
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--heading-color)",
                    }}
                  >
                    {SORT_OPTIONS_CLIENTS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    title={`Ordenação ${sortOrder === "asc" ? "Crescente" : "Decrescente"}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--heading-color)",
                      cursor: "pointer",
                    }}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Clientes - Cards View */}
          {viewMode === "cards" && (
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Clientes ({filteredClientes.length})</h3>
                {currentClientes.length > 0 && (
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        selectedClientes.length === currentClientes.length &&
                        currentClientes.length > 0
                      }
                      onChange={toggleAllSelection}
                    />
                    <span style={{ marginLeft: "8px" }}>Selecionar Todos</span>
                  </label>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {currentClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      padding: "20px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClientes.includes(cliente.id)}
                        onChange={() => toggleClienteSelection(cliente.id)}
                      />
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "16px",
                          background: `linear-gradient(135deg, ${CUSTOMER_TYPES.find((t) => t.value === cliente.tipo)?.color || "#6b7280"}, ${CUSTOMER_TYPES.find((t) => t.value === cliente.tipo)?.color || "#6b7280"}dd)`,
                        }}
                      >
                        {cliente.nombre.charAt(0)}
                        {cliente.apellidos.charAt(0)}
                      </div>
                      <span
                        style={{
                          background: cliente.activo ? "#22c55e" : "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {cliente.activo ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <h4
                      style={{
                        marginBottom: "12px",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      <Link
                        to={`/dashboard/clientes/${cliente.id}`}
                        style={{
                          color: "var(--heading-color)",
                          textDecoration: "none",
                        }}
                      >
                        {cliente.nombre} {cliente.apellidos}
                      </Link>
                    </h4>

                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span>📧</span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.email}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span>📱</span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.telefone}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span>🏙️</span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.ciudad}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span>📅</span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {new Date(cliente.fechaRegistro).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <span
                        style={{
                          background:
                            CUSTOMER_TYPES.find((t) => t.value === cliente.tipo)
                              ?.color || "#6b7280",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {cliente.tipo}
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      <Link
                        to={`/dashboard/clientes/${cliente.id}`}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#ff3d24",
                          color: "white",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Ver Detalhes
                      </Link>
                      <Link
                        to={`/dashboard/clientes/editar/${cliente.id}`}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "var(--body-color)",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => confirmDelete(cliente)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid #ef4444",
                          color: "#ef4444",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Clientes - Table View */}
          {viewMode === "table" && (
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Clientes ({filteredClientes.length})</h3>
                {currentClientes.length > 0 && (
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        selectedClientes.length === currentClientes.length &&
                        currentClientes.length > 0
                      }
                      onChange={toggleAllSelection}
                    />
                    <span style={{ marginLeft: "8px" }}>Selecionar Todos</span>
                  </label>
                )}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        <input
                          type="checkbox"
                          checked={
                            selectedClientes.length ===
                              currentClientes.length &&
                            currentClientes.length > 0
                          }
                          onChange={toggleAllSelection}
                        />
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Cliente
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Email
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Telefone
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Tipo
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Cidade
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Status
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Registro
                      </th>
                      <th style={{ padding: "12px 8px", textAlign: "left" }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClientes.map((cliente) => (
                      <tr
                        key={cliente.id}
                        style={{
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <td style={{ padding: "12px 8px" }}>
                          <input
                            type="checkbox"
                            checked={selectedClientes.includes(cliente.id)}
                            onChange={() => toggleClienteSelection(cliente.id)}
                          />
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "600",
                                fontSize: "12px",
                                background: `linear-gradient(135deg, ${CUSTOMER_TYPES.find((t) => t.value === cliente.tipo)?.color || "#6b7280"}, ${CUSTOMER_TYPES.find((t) => t.value === cliente.tipo)?.color || "#6b7280"}dd)`,
                              }}
                            >
                              {cliente.nombre.charAt(0)}
                              {cliente.apellidos.charAt(0)}
                            </div>
                            <div>
                              <Link
                                to={`/dashboard/clientes/${cliente.id}`}
                                style={{
                                  color: "var(--heading-color)",
                                  textDecoration: "none",
                                  fontWeight: "500",
                                }}
                              >
                                {cliente.nombre} {cliente.apellidos}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.email}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.telefone}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span
                            style={{
                              background:
                                CUSTOMER_TYPES.find(
                                  (t) => t.value === cliente.tipo,
                                )?.color || "#6b7280",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {cliente.tipo}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {cliente.ciudad}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span
                            style={{
                              background: cliente.activo
                                ? "#22c55e"
                                : "#ef4444",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {cliente.activo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            fontSize: "14px",
                            color: "var(--body-color)",
                          }}
                        >
                          {new Date(cliente.fechaRegistro).toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Link
                              to={`/dashboard/clientes/${cliente.id}`}
                              style={{
                                padding: "4px 8px",
                                background: "#ff3d24",
                                color: "white",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "11px",
                              }}
                              title="Ver Detalhes"
                            >
                              👁️
                            </Link>
                            <Link
                              to={`/dashboard/clientes/editar/${cliente.id}`}
                              style={{
                                padding: "4px 8px",
                                background: "rgba(34, 197, 94, 0.2)",
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                color: "#22c55e",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "11px",
                              }}
                              title="Editar"
                            >
                              ✏️
                            </Link>
                            <button
                              onClick={() => confirmDelete(cliente)}
                              style={{
                                padding: "4px 8px",
                                background: "rgba(239, 68, 68, 0.2)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#ef4444",
                                borderRadius: "4px",
                                fontSize: "11px",
                                cursor: "pointer",
                              }}
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "32px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ fontSize: "14px", color: "var(--body-color)" }}>
                Mostrando {indexOfFirstItem + 1} a{" "}
                {Math.min(indexOfLastItem, filteredClientes.length)} de{" "}
                {filteredClientes.length} clientes
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background:
                      currentPage === 1
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 61, 36, 0.1)",
                    color:
                      currentPage === 1
                        ? "rgba(255, 255, 255, 0.3)"
                        : "var(--primary-color)",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  ← Anterior
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 &&
                      pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255, 61, 36, 0.3)",
                          background:
                            currentPage === pageNumber
                              ? "#ff3d24"
                              : "transparent",
                          color:
                            currentPage === pageNumber
                              ? "white"
                              : "var(--primary-color)",
                          cursor: "pointer",
                          fontSize: "14px",
                          minWidth: "40px",
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 3 ||
                    pageNumber === currentPage + 3
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        style={{
                          color: "var(--body-color)",
                          padding: "8px 4px",
                        }}
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background:
                      currentPage === totalPages
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 61, 36, 0.1)",
                    color:
                      currentPage === totalPages
                        ? "rgba(255, 255, 255, 0.3)"
                        : "var(--primary-color)",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Próxima →
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredClientes.length === 0 && (
            <div className="dashboard-panel">
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "24px",
                    opacity: 0.3,
                  }}
                >
                  👥
                </div>
                <h3
                  style={{
                    color: "var(--heading-color)",
                    marginBottom: "12px",
                  }}
                >
                  Nenhum cliente encontrado
                </h3>
                <p
                  style={{
                    color: "var(--body-color)",
                    marginBottom: "24px",
                    opacity: 0.8,
                  }}
                >
                  {searchTerm ||
                  selectedFilter !== "todos" ||
                  selectedCity !== "todas"
                    ? "Tente ajustar os filtros de busca."
                    : "Comece adicionando seu primeiro cliente."}
                </p>
                {!searchTerm &&
                  selectedFilter === "todos" &&
                  selectedCity === "todas" && (
                    <Link
                      to="/dashboard/clientes/novo"
                      className="primary-action-btn"
                    >
                      + Adicionar Primeiro Cliente
                    </Link>
                  )}
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Exclusão */}
          {showDeleteModal && clienteToDelete && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                padding: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(26, 26, 26, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "32px",
                  maxWidth: "400px",
                  width: "100%",
                }}
              >
                <h3
                  style={{
                    color: "var(--heading-color)",
                    marginBottom: "16px",
                    fontSize: "20px",
                  }}
                >
                  Confirmar Exclusão
                </h3>
                <p
                  style={{
                    color: "var(--body-color)",
                    marginBottom: "12px",
                    lineHeight: "1.6",
                  }}
                >
                  Tem certeza que deseja excluir o cliente{" "}
                  <strong style={{ color: "var(--heading-color)" }}>
                    {clienteToDelete.nombre} {clienteToDelete.apellidos}
                  </strong>
                  ?
                </p>
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ⚠️ Esta ação não pode ser desfeita e também excluirá todos os
                  dados relacionados a este cliente.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setClienteToDelete(null);
                    }}
                    style={{
                      padding: "12px 20px",
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "6px",
                      color: "var(--body-color)",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteCliente(clienteToDelete.id);
                      setShowDeleteModal(false);
                      setClienteToDelete(null);
                    }}
                    style={{
                      padding: "12px 20px",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Sim, Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientesManagementPage;
