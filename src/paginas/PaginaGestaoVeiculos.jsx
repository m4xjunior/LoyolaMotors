import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  vehiculoService,
  clienteService,
  servicioService,
} from "../data/database";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import {
  VEHICLE_STATUS,
  SORT_OPTIONS_VEHICLES,
  getCombustibleColor,
  getCombustibleIcon,
} from "../constants/vehicleConstants";
import "../styles/Dashboard.scss";

const VehiclesManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedMarca, setSelectedMarca] = useState("todas");
  const [selectedClient, setSelectedClient] = useState("todos");
  const [sortBy, setSortBy] = useState("marca");
  const [sortOrder, setSortOrder] = useState("asc");

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados de modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Estados de estatísticas
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    enMantenimiento: 0,
    kmPromedio: 0,
  });

  const calculateStats = useCallback((vehiculosData) => {
    const total = vehiculosData.length;
    const activos = vehiculosData.filter((v) => v.activo).length;

    const vehiculosEnMantenimiento = vehiculosData.filter((v) => {
      const servicios = servicioService
        .getAll()
        .filter((s) => s.vehiculoId === v.id);
      return servicios.some(
        (s) => s.estado === "pendiente" || s.estado === "en_proceso",
      );
    }).length;

    const totalKm = vehiculosData.reduce(
      (sum, v) => sum + (v.kilometraje || 0),
      0,
    );
    const kmPromedio = total > 0 ? totalKm / total : 0;

    setStats({
      total,
      activos,
      enMantenimiento: vehiculosEnMantenimiento,
      kmPromedio,
    });
  }, []);

  const getCustomerName = useCallback(
    (clienteId) => {
      const cliente = clientes.find((c) => c.id === clienteId);
      return cliente
        ? `${cliente.nombre} ${cliente.apellidos}`
        : "Cliente não encontrado";
    },
    [clientes],
  );

  // Carregar dados
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const vehiculosData = vehiculoService.getAll();
        const clientesData = clienteService.getAll();
        setVehiculos(vehiculosData);
        setClientes(clientesData);
        setFilteredVehiculos(vehiculosData);
        calculateStats(vehiculosData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, calculateStats]);

  const filterAndSortVehiculos = useCallback(() => {
    let filtered = [...vehiculos];

    // Filtro por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehiculo) =>
          vehiculo.marca.toLowerCase().includes(term) ||
          vehiculo.modelo.toLowerCase().includes(term) ||
          vehiculo.matricula.toLowerCase().includes(term) ||
          vehiculo.vin?.toLowerCase().includes(term),
      );
    }

    // Filtro por status
    if (selectedStatus !== "todos") {
      if (selectedStatus === "activo") {
        filtered = filtered.filter((v) => v.activo);
      } else if (selectedStatus === "inactivo") {
        filtered = filtered.filter((v) => !v.activo);
      } else if (selectedStatus === "mantenimiento") {
        filtered = filtered.filter((v) => {
          const servicios = servicioService
            .getAll()
            .filter((s) => s.vehiculoId === v.id);
          return servicios.some(
            (s) => s.estado === "pendiente" || s.estado === "en_proceso",
          );
        });
      }
    }

    // Filtro por marca
    if (selectedMarca !== "todas") {
      filtered = filtered.filter(
        (vehiculo) => vehiculo.marca === selectedMarca,
      );
    }

    // Filtro por cliente
    if (selectedClient !== "todos") {
      filtered = filtered.filter(
        (vehiculo) => vehiculo.clienteId === selectedClient,
      );
    }

    // Ordenação
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

    setFilteredVehiculos(filtered);
    setCurrentPage(1);
    calculateStats(filtered);
  }, [
    vehiculos,
    searchTerm,
    selectedStatus,
    selectedMarca,
    selectedClient,
    sortBy,
    sortOrder,
    calculateStats,
    getCustomerName,
  ]);

  // Filtrar e ordenar veículos
  useEffect(() => {
    filterAndSortVehiculos();
  }, [
    vehiculos,
    searchTerm,
    selectedStatus,
    selectedMarca,
    selectedClient,
    sortBy,
    sortOrder,
    filterAndSortVehiculos,
  ]);

  const handleDelete = (vehiculo) => {
    setVehicleToDelete(vehiculo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      vehiculoService.delete(vehicleToDelete.id);
      setVehiculos((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      setSuccess("Veículo excluído com sucesso!");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Erro ao excluir veículo");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehiculos.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

  // Obter marcas únicas para o filtro
  const marcasUnicas = [...new Set(vehiculos.map((v) => v.marca))].sort();

  if (loading) {
    return (
      <>
        <CommonPageHero title="Gestão de Veículos" />
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
      <CommonPageHero title="Gestão de Veículos" />

      <div className="dashboard-container">
        <div className="container">
          {/* Mensagens */}
          {success && (
            <div
              className="alert alert-success"
              style={{ marginBottom: "20px" }}
            >
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Gestão de Veículos</h1>
              <p className="dashboard-subtitle">
                Gerir todos os veículos registrados na LoyolaMotors
              </p>
            </div>
            <div className="dashboard-actions">
              <Link
                to="/dashboard/vehiculos/novo"
                className="primary-action-btn"
              >
                🚗 Novo Veículo
              </Link>
              <Link to="/dashboard" className="logout-btn">
                ← Voltar ao Dashboard
              </Link>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="mini-stat-cards">
            <div className="mini-stat-card">
              <div className="mini-stat-value">{stats.total}</div>
              <div className="mini-stat-label">Total de Veículos</div>
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">{stats.activos}</div>
              <div className="mini-stat-label">Veículos Ativos</div>
              <div className="mini-stat-change positive">
                {stats.total > 0
                  ? `${((stats.activos / stats.total) * 100).toFixed(0)}%`
                  : "0%"}
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">{stats.enMantenimiento}</div>
              <div className="mini-stat-label">Em Manutenção</div>
              {stats.enMantenimiento > 0 && (
                <div className="mini-stat-change negative">
                  {((stats.enMantenimiento / stats.total) * 100).toFixed(0)}%
                </div>
              )}
            </div>
            <div className="mini-stat-card">
              <div className="mini-stat-value">
                {Math.round(stats.kmPromedio / 1000)}k
              </div>
              <div className="mini-stat-label">Km Médio</div>
            </div>
          </div>

          {/* Filtros e busca */}
          <div className="dashboard-panel" style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              {/* Busca */}
              <div>
                <input
                  type="text"
                  placeholder="🔍 Buscar veículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dashboard-input"
                />
              </div>

              {/* Filtro por Status */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="dashboard-select"
                >
                  {VEHICLE_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Marca */}
              <div>
                <select
                  value={selectedMarca}
                  onChange={(e) => setSelectedMarca(e.target.value)}
                  className="dashboard-select"
                >
                  <option value="todas">Todas as Marcas</option>
                  {marcasUnicas.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Cliente */}
              <div>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="dashboard-select"
                >
                  <option value="todos">Todos os Clientes</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="dashboard-select"
                >
                  {SORT_OPTIONS_VEHICLES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordem */}
              <div>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="dashboard-select"
                  style={{ cursor: "pointer" }}
                >
                  {sortOrder === "asc" ? "↑ Crescente" : "↓ Decrescente"}
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Veículos */}
          <div className="dashboard-panel">
            {filteredVehiculos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🚗</div>
                <h3>Nenhum veículo encontrado</h3>
                <p>
                  {searchTerm ||
                  selectedStatus !== "todos" ||
                  selectedMarca !== "todas" ||
                  selectedClient !== "todos"
                    ? "Não há veículos que correspondam aos critérios de pesquisa."
                    : "Não há veículos cadastrados ainda."}
                </p>
                {!searchTerm &&
                  selectedStatus === "todos" &&
                  selectedMarca === "todas" &&
                  selectedClient === "todos" && (
                    <Link
                      to="/dashboard/vehiculos/novo"
                      className="primary-action-btn"
                    >
                      + Adicionar Primeiro Veículo
                    </Link>
                  )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {currentVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    customerName={getCustomerName(vehicle.clienteId)}
                    onEdit={() =>
                      navigate(`/dashboard/vehiculos/editar/${vehicle.id}`)
                    }
                    onDelete={() => handleDelete(vehicle)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>

              <span className="pagination-info">
                Página {currentPage} de {totalPages} ({filteredVehiculos.length}{" "}
                veículos)
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showDeleteModal && vehicleToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o veículo{" "}
              <strong>
                {vehicleToDelete.marca} {vehicleToDelete.modelo} -{" "}
                {vehicleToDelete.matricula}
              </strong>
              ?
            </p>
            <p className="warning-text">⚠️ Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button onClick={closeDeleteModal} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn-confirm">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Componente VehicleCard
const VehicleCard = ({ vehicle, customerName, onEdit, onDelete }) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div
          className="vehicle-avatar"
          style={{
            background: `linear-gradient(135deg, ${getCombustibleColor(vehicle.combustible)}, ${getCombustibleColor(vehicle.combustible)}dd)`,
          }}
        >
          {vehicle.marca.charAt(0)}
        </div>
        <div className="vehicle-status">
          <span
            className={`status-badge ${vehicle.activo ? "active" : "inactive"}`}
          >
            {vehicle.activo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="vehicle-info">
        <h3>
          {vehicle.marca} {vehicle.modelo}
        </h3>
        <p className="vehicle-plate">{vehicle.matricula}</p>

        <div className="vehicle-details">
          <div className="detail-item">
            <span className="detail-label">Ano:</span>
            <span className="detail-value">{vehicle.año}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Cor:</span>
            <span className="detail-value">{vehicle.color}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">KM:</span>
            <span className="detail-value">
              {vehicle.kilometraje?.toLocaleString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Combustível:</span>
            <span className="detail-value">
              {getCombustibleIcon(vehicle.combustible)} {vehicle.combustible}
            </span>
          </div>
        </div>

        <div className="vehicle-client">
          <strong>Cliente:</strong> {customerName}
        </div>
      </div>

      <div className="vehicle-actions">
        <button onClick={onEdit} className="btn-edit" title="Editar">
          ✏️
        </button>
        <button onClick={onDelete} className="btn-delete" title="Excluir">
          🗑️
        </button>
      </div>
    </div>
  );
};

VehicleCard.propTypes = {
  vehicle: PropTypes.object.isRequired,
  customerName: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default VehiclesManagementPage;
