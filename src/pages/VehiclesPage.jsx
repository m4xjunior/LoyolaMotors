import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { mockServiceHistory } from "../data/mockCustomers";
import { vehiculoService, clienteService } from "../data/database";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";

const VehicleCard = ({
  vehicle,
  onEdit,
  onDelete,
  getCustomerName,
  getVehicleServiceCount,
}) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          🚗
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: vehicle.activo ? "#22c55e" : "#ef4444",
              color: "white",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {vehicle.activo ? "Ativo" : "Inativo"}
          </span>
          <span
            style={{
              background: "rgba(59, 130, 246, 0.2)",
              color: "#3b82f6",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {getVehicleServiceCount(vehicle.id)} serviços
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            color: "var(--heading-color)",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          {vehicle.marca} {vehicle.modelo}
        </h4>

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span>👤</span>
            <span style={{ fontSize: "14px", color: "var(--body-color)" }}>
              {getCustomerName(vehicle.clienteId)}
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
            <span>🔢</span>
            <span style={{ fontSize: "14px", color: "var(--body-color)" }}>
              {vehicle.matricula}
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
            <span style={{ fontSize: "14px", color: "var(--body-color)" }}>
              {vehicle.año} • {vehicle.color || "N/A"}
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
            <span>🛣️</span>
            <span style={{ fontSize: "14px", color: "var(--body-color)" }}>
              {vehicle.kilometraje?.toLocaleString() || 0} km
            </span>
          </div>
          {vehicle.vin && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span>🏷️</span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--body-color)",
                  fontFamily: "monospace",
                }}
              >
                {vehicle.vin}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginTop: "auto",
        }}
      >
        <button
          onClick={() => onEdit(vehicle)}
          style={{
            flex: "1",
            padding: "10px 16px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "8px",
            color: "#22c55e",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          ✏️ Editar
        </button>
        <Link
          to={`/dashboard/vehiculos/${vehicle.id}/servicios`}
          style={{
            flex: "1",
            padding: "10px 16px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            color: "#3b82f6",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          🔧 Serviços
        </Link>
        <button
          onClick={() => onDelete(vehicle.id)}
          style={{
            padding: "10px 12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

VehicleCard.propTypes = {
  vehicle: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getCustomerName: PropTypes.func.isRequired,
  getVehicleServiceCount: PropTypes.func.isRequired,
};

const VehiclesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("todas");
  const [selectedClient, setSelectedClient] = useState("todos");
  const [sortBy, setSortBy] = useState("marca");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState("cards");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    matricula: "",
    vin: "",
    color: "",
    kilometraje: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    servicios: 0,
  });

  const calculateStats = useCallback((vehiclesData) => {
    setStats({
      total: vehiclesData.length,
      activos: vehiclesData.filter((v) => v.activo).length,
      servicios: vehiclesData.reduce((count, v) => {
        const services = mockServiceHistory.filter((s) => s.vehicleId === v.id);
        return count + services.length;
      }, 0),
    });
  }, []);

  const getCustomerName = useCallback(
    (clienteId) => {
      const customer = clientes.find((c) => c.id === clienteId);
      return customer
        ? `${customer.nombre} ${customer.apellidos}`
        : "Cliente não encontrado";
    },
    [clientes],
  );

  const filterAndSortVehicles = useCallback(() => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.marca.toLowerCase().includes(term) ||
          vehicle.modelo.toLowerCase().includes(term) ||
          vehicle.matricula.toLowerCase().includes(term) ||
          vehicle.vin?.toLowerCase().includes(term) ||
          getCustomerName(vehicle.clienteId).toLowerCase().includes(term),
      );
    }

    // Brand filter
    if (selectedBrand !== "todas") {
      filtered = filtered.filter((vehicle) => vehicle.marca === selectedBrand);
    }

    // Client filter
    if (selectedClient !== "todos") {
      filtered = filtered.filter(
        (vehicle) => vehicle.clienteId === selectedClient,
      );
    }

    // Sort vehicles
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "cliente") {
        aValue = getCustomerName(a.clienteId);
        bValue = getCustomerName(b.clienteId);
      }

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

    setFilteredVehicles(filtered);
    setCurrentPage(1);
    calculateStats(filtered);
  }, [
    vehicles,
    searchTerm,
    selectedBrand,
    selectedClient,
    sortBy,
    sortOrder,
    getCustomerName,
    calculateStats,
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const vehiclesData = vehiculoService.getAll();
        const clientesData = clienteService.getAll();
        setVehicles(vehiclesData);
        setClientes(clientesData);
        setFilteredVehicles(vehiclesData);
        calculateStats(vehiclesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, calculateStats]);

  useEffect(() => {
    filterAndSortVehicles();
  }, [filterAndSortVehicles]);

  const getVehicleServiceCount = (vehicleId) => {
    return mockServiceHistory.filter((s) => s.vehiculoId === vehicleId).length;
  };

  const resetForm = () => {
    setFormData({
      clienteId: "",
      marca: "",
      modelo: "",
      año: new Date().getFullYear(),
      matricula: "",
      vin: "",
      color: "",
      kilometraje: 0,
    });
    setShowCreateForm(false);
    setEditingVehicle(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingVehicle) {
        // Update vehicle
        const updatedVehicles = vehicles.map((vehicle) =>
          vehicle.id === editingVehicle.id
            ? {
                ...vehicle,
                ...formData,
                año: parseInt(formData.año),
                kilometraje: parseInt(formData.kilometraje),
              }
            : vehicle,
        );
        setVehicles(updatedVehicles);
        setSuccess("Vehículo actualizado correctamente");
      } else {
        // Create new vehicle
        const newVehicle = {
          id: Date.now().toString(),
          ...formData,
          año: parseInt(formData.año),
          kilometraje: parseInt(formData.kilometraje),
          fechaRegistro: new Date(),
          activo: true,
        };
        setVehicles([...vehicles, newVehicle]);
        setSuccess("Vehículo creado correctamente");
      }
      resetForm();
    } catch (err) {
      setError("Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      clienteId: vehicle.clienteId,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      año: vehicle.año,
      matricula: vehicle.matricula,
      vin: vehicle.vin,
      color: vehicle.color,
      kilometraje: vehicle.kilometraje,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (vehicleId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")
    ) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedVehicles = vehicles.filter(
          (vehicle) => vehicle.id !== vehicleId,
        );
        setVehicles(updatedVehicles);
        setSuccess("Vehículo eliminado correctamente");
      } catch (err) {
        setError("Error al eliminar el vehículo");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <CommonPageHero title="Gestão de Veículos" />

      <div className="dashboard-container">
        <div className="container">
          {/* Header Section */}
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
              <h1 className="dashboard-title">Gestão de Veículos</h1>
              <p className="dashboard-subtitle">
                Administrar todos os veículos da LoyolaMotors
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowCreateForm(true)}
                className="primary-action-btn"
              >
                + Novo Veículo
              </button>
              <Link to="/dashboard" className="logout-btn">
                ← Dashboard
              </Link>
            </div>
          </div>

          {/* Statistics */}
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
                label: "Total de Veículos",
                value: stats.total,
                color: "#ff3d24",
              },
              {
                label: "Veículos Ativos",
                value: stats.activos,
                color: "#22c55e",
              },
              {
                label: "Total de Serviços",
                value: stats.servicios,
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

          {/* Filters and Search */}
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
                  placeholder="Marca, modelo, matrícula..."
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
                  Marca:
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--heading-color)",
                  }}
                >
                  <option value="todas">Todas as Marcas</option>
                  {[...new Set(vehicles.map((v) => v.marca))]
                    .sort()
                    .map((marca) => (
                      <option key={marca} value={marca}>
                        {marca}
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
                  Cliente:
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--heading-color)",
                  }}
                >
                  <option value="todos">Todos os Clientes</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellidos}
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
                    <option value="marca">Marca</option>
                    <option value="modelo">Modelo</option>
                    <option value="año">Ano</option>
                    <option value="cliente">Cliente</option>
                    <option value="matricula">Matrícula</option>
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

          {/* Alerts */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#22c55e",
              }}
            >
              {success}
            </div>
          )}

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="dashboard-panel" style={{ marginBottom: "32px" }}>
              <div className="panel-header">
                <h3>{editingVehicle ? "Editar Veículo" : "Novo Veículo"}</h3>
              </div>

              <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Cliente *
                    </label>
                    <select
                      value={formData.clienteId}
                      onChange={(e) =>
                        setFormData({ ...formData, clienteId: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "var(--heading-color)",
                      }}
                    >
                      <option value="">Selecionar cliente</option>
                      {clientes
                        .filter((c) => c.activo)
                        .map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.nombre} {customer.apellidos}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={formData.marca}
                      onChange={(e) =>
                        setFormData({ ...formData, marca: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Modelo *
                    </label>
                    <input
                      type="text"
                      value={formData.modelo}
                      onChange={(e) =>
                        setFormData({ ...formData, modelo: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Ano *
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.año}
                      onChange={(e) =>
                        setFormData({ ...formData, año: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Matrícula *
                    </label>
                    <input
                      type="text"
                      value={formData.matricula}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          matricula: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      VIN
                    </label>
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vin: e.target.value.toUpperCase(),
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Cor
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
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
                        marginBottom: "8px",
                        color: "var(--body-color)",
                      }}
                    >
                      Quilometragem
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kilometraje}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kilometraje: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "var(--heading-color)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-action-btn"
                  >
                    {loading
                      ? "Guardando..."
                      : editingVehicle
                        ? "Atualizar"
                        : "Criar Veículo"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="logout-btn"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vehicles Grid/List */}
          {loading ? (
            <div className="dashboard-panel">
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "20px", color: "var(--body-color)" }}>
                  Carregando veículos...
                </div>
              </div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="dashboard-panel">
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "24px",
                    opacity: 0.3,
                  }}
                >
                  🚗
                </div>
                <h3
                  style={{
                    color: "var(--heading-color)",
                    marginBottom: "12px",
                  }}
                >
                  {searchTerm ||
                  selectedBrand !== "todas" ||
                  selectedClient !== "todos"
                    ? "Nenhum veículo encontrado"
                    : "Nenhum veículo cadastrado"}
                </h3>
                <p
                  style={{
                    color: "var(--body-color)",
                    marginBottom: "24px",
                    opacity: 0.8,
                  }}
                >
                  {searchTerm ||
                  selectedBrand !== "todas" ||
                  selectedClient !== "todos"
                    ? "Tente ajustar os filtros de busca."
                    : "Comece adicionando o primeiro veículo."}
                </p>
                {!searchTerm &&
                  selectedBrand === "todas" &&
                  selectedClient === "todos" && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="primary-action-btn"
                    >
                      + Adicionar Primeiro Veículo
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <>
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Veículos ({filteredVehicles.length})</h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "24px",
                    marginTop: "24px",
                  }}
                >
                  {filteredVehicles
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        getCustomerName={getCustomerName}
                        getVehicleServiceCount={getVehicleServiceCount}
                      />
                    ))}
                </div>
              </div>

              {/* Pagination */}
              {Math.ceil(filteredVehicles.length / itemsPerPage) > 1 && (
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
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredVehicles.length,
                    )}{" "}
                    de {filteredVehicles.length} veículos
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

                    {[
                      ...Array(
                        Math.ceil(filteredVehicles.length / itemsPerPage),
                      ),
                    ].map((_, index) => {
                      const pageNumber = index + 1;
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
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(filteredVehicles.length / itemsPerPage),
                          ),
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredVehicles.length / itemsPerPage)
                      }
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background:
                          currentPage ===
                          Math.ceil(filteredVehicles.length / itemsPerPage)
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 61, 36, 0.1)",
                        color:
                          currentPage ===
                          Math.ceil(filteredVehicles.length / itemsPerPage)
                            ? "rgba(255, 255, 255, 0.3)"
                            : "var(--primary-color)",
                        cursor:
                          currentPage ===
                          Math.ceil(filteredVehicles.length / itemsPerPage)
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Próxima →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VehiclesPage;
