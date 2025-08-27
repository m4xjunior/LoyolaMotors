import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ServicesPage.css";
import { useNavigate, Link } from "react-router-dom";
import {
  mockCustomers,
  mockVehicles,
  mockServiceHistory,
  mockUsers,
} from "../data/mockCustomers";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { format } from "date-fns";

const ServiceCard = ({ service, customer, vehicle, onEdit, onDelete }) => {
  ServiceCard.propTypes = {
    service: PropTypes.shape({
      id: PropTypes.string.isRequired,
      tipoServicio: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      fecha: PropTypes.instanceOf(Date).isRequired,
      tecnico: PropTypes.string.isRequired,
      kilometraje: PropTypes.number.isRequired,
      costo: PropTypes.number.isRequired,
      estado: PropTypes.string.isRequired,
      facturaId: PropTypes.string,
      notas: PropTypes.string,
      vehiculoId: PropTypes.string.isRequired,
      clienteId: PropTypes.string.isRequired,
    }).isRequired,
    customer: PropTypes.shape({
      nombre: PropTypes.string,
      apellidos: PropTypes.string,
    }),
    vehicle: PropTypes.shape({
      marca: PropTypes.string,
      modelo: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };
  const getStatusText = (status) => {
    const texts = {
      completado: "Completado",
      en_proceso: "En Proceso",
      pendiente: "Pendiente",
      cancelado: "Cancelado",
    };
    return texts[status] || status;
  };

  return (
    <div className="col-lg-6 col-md-12 mb-4" data-aos="fade-up">
      <div className="service-card-redefined">
        {/* Card Header */}
        <div className="card-header-flex">
          <div className="card-title-group">
            <div className="card-icon">
              <img src="/assets/img/icon/car-repair.svg" alt="Service Icon" />
            </div>
            <h4 className="card-title">{service.tipoServicio}</h4>
          </div>
          <span
            className={`card-status-badge status-${service.estado.replace(
              "_",
              "-",
            )}`}
          >
            {getStatusText(service.estado)}
          </span>
        </div>

        {/* Card Description */}
        <div className="card-description">
          <p>{service.descripcion}</p>
        </div>

        {/* Card Info Grid */}
        <div className="card-content-grid">
          <div className="info-item">
            <span className="info-item-label">Cliente</span>
            <span className="info-item-value">
              👤 {customer?.nombre} {customer?.apellidos}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Vehículo</span>
            <span className="info-item-value">
              🚗 {vehicle?.marca} {vehicle?.modelo}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Fecha</span>
            <span className="info-item-value">
              📅 {format(service.fecha, "dd/MM/yyyy")}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Técnico</span>
            <span className="info-item-value">🔧 {service.tecnico}</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Kilometraje</span>
            <span className="info-item-value">
              🛣️ {service.kilometraje.toLocaleString()} km
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Costo</span>
            <span className="info-item-value">
              💰 €{service.costo.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-footer-actions">
          <button
            onClick={() => onEdit(service)}
            className="action-btn-modern edit"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="action-btn-modern delete"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    vehiculoId: "",
    tipoServicio: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
    kilometraje: 0,
    costo: 0,
    estado: "pendiente",
    tecnico: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setServices(mockServiceHistory);
    setFilteredServices(mockServiceHistory);
  }, []);

  useEffect(() => {
    let filtered = services.filter((service) => {
      const customer = mockCustomers.find((c) => c.id === service.clienteId);
      const vehicle = mockVehicles.find((v) => v.id === service.vehiculoId);

      const searchMatch =
        service.tipoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle?.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle?.modelo.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === "" || service.estado === statusFilter;
      const technicianMatch =
        technicianFilter === "" || service.tecnico === technicianFilter;

      return searchMatch && statusMatch && technicianMatch;
    });

    setFilteredServices(filtered);
  }, [searchTerm, statusFilter, technicianFilter, services]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getServiceStats = () => {
    const total = services.length;
    const completados = services.filter(
      (s) => s.estado === "completado",
    ).length;
    const enProceso = services.filter((s) => s.estado === "en_proceso").length;
    const pendientes = services.filter((s) => s.estado === "pendiente").length;
    const ingresos = services
      .filter((s) => s.estado === "completado")
      .reduce((sum, s) => sum + s.costo, 0);

    return { total, completados, enProceso, pendientes, ingresos };
  };

  const getCustomerById = (id) => mockCustomers.find((c) => c.id === id);
  const getVehicleById = (id) => mockVehicles.find((v) => v.id === id);

  const resetForm = () => {
    setFormData({
      clienteId: "",
      vehiculoId: "",
      tipoServicio: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0],
      kilometraje: 0,
      costo: 0,
      estado: "pendiente",
      tecnico: "",
      notas: "",
    });
    setShowCreateForm(false);
    setEditingService(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingService) {
        const updatedServices = services.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                ...formData,
                fecha: new Date(formData.fecha),
                kilometraje: parseInt(formData.kilometraje),
                costo: parseFloat(formData.costo),
              }
            : service,
        );
        setServices(updatedServices);
        setSuccess("Servicio actualizado correctamente");
      } else {
        const newService = {
          id: Date.now().toString(),
          ...formData,
          fecha: new Date(formData.fecha),
          kilometraje: parseInt(formData.kilometraje),
          costo: parseFloat(formData.costo),
          facturaId:
            formData.estado === "completado" ? `FAC-${Date.now()}` : null,
        };
        setServices([...services, newService]);
        setSuccess("Servicio creado correctamente");
      }
      resetForm();
    } catch (err) {
      setError("Error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      clienteId: service.clienteId,
      vehiculoId: service.vehiculoId,
      tipoServicio: service.tipoServicio,
      descripcion: service.descripcion,
      fecha: service.fecha.toISOString().split("T")[0],
      kilometraje: service.kilometraje,
      costo: service.costo,
      estado: service.estado,
      tecnico: service.tecnico,
      notas: service.notas,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este servicio?")
    ) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedServices = services.filter(
          (service) => service.id !== serviceId,
        );
        setServices(updatedServices);
        setSuccess("Servicio eliminado correctamente");
      } catch (err) {
        setError("Error al eliminar el servicio");
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = getServiceStats();

  return (
    <>
      <CommonPageHero title="Gestión de Servicios" />

      <div
        className="container"
        style={{ paddingTop: "50px", paddingBottom: "100px" }}
      >
        {/* Statistics Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div
              className="service-card-style-2 p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(18, 18, 18, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
              }}
            >
              <h3
                className="title mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #ff6b4a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                📊 Estadísticas de Servicios
              </h3>
              <div className="row text-center">
                <div className="col-md-2 col-6 mb-4">
                  <div
                    className="stat-item"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)",
                      padding: "20px 15px",
                      borderRadius: "16px",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(59, 130, 246, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {stats.total}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Total Servicios
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-6 mb-4">
                  <div
                    className="stat-item"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)",
                      padding: "20px 15px",
                      borderRadius: "16px",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(34, 197, 94, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {stats.completados}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Completados
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-6 mb-4">
                  <div
                    className="stat-item"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.1) 100%)",
                      padding: "20px 15px",
                      borderRadius: "16px",
                      border: "1px solid rgba(234, 179, 8, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(234, 179, 8, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {stats.enProceso}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      En Proceso
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-6 mb-4">
                  <div
                    className="stat-item"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.1) 100%)",
                      padding: "20px 15px",
                      borderRadius: "16px",
                      border: "1px solid rgba(6, 182, 212, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(6, 182, 212, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {stats.pendientes}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Pendientes
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-12 mb-4">
                  <div
                    className="stat-item"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)",
                      padding: "25px 20px",
                      borderRadius: "16px",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(34, 197, 94, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "2.8rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        margin: "0 0 8px 0",
                      }}
                    >
                      €{stats.ingresos.toFixed(2)}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Ingresos Totales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h1 className="page-title mb-2">Gestión de Servicios</h1>
                <p className="text-muted">
                  Vista general de todos los servicios del taller
                </p>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/dashboard" className="common-btn">
                  Volver al Dashboard
                </Link>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="common-btn"
                >
                  Nuevo Servicio
                </button>
                <button
                  onClick={handleLogout}
                  className="common-btn bg-danger"
                  style={{ backgroundColor: "#dc3545" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger alert-dismissible">
                {error}
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-success alert-dismissible">
                {success}
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Buscar servicios por tipo, cliente, vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            <select
              className="form-control form-control-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <select
              className="form-control form-control-lg"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
            >
              <option value="">Todos los técnicos</option>
              {mockUsers
                .filter((u) => u.role !== "Administrador")
                .map((user) => (
                  <option key={user.id} value={user.nombre}>
                    {user.nombre}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setTechnicianFilter("");
              }}
              className="common-btn w-100"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {/* Formulario de Creación/Edición de Servicios */}
        {showCreateForm && (
          <div className="service-form-modern">
            <h3 className="form-title">
              {editingService ? "Editar Servicio" : "Crear Nuevo Servicio"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="service-form-grid">
                {/* Cliente */}
                <div className="form-field">
                  <label className="form-label-modern">Cliente *</label>
                  <select
                    className="form-select-modern"
                    value={formData.clienteId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        clienteId: e.target.value,
                        vehiculoId: "",
                      });
                    }}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {mockCustomers
                      .filter((c) => c.activo)
                      .map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.nombre} {customer.apellidos}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Vehículo */}
                <div className="form-field">
                  <label className="form-label-modern">Vehículo *</label>
                  <select
                    className="form-select-modern"
                    value={formData.vehiculoId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehiculoId: e.target.value,
                      })
                    }
                    required
                    disabled={!formData.clienteId}
                  >
                    <option value="">Seleccionar vehículo</option>
                    {formData.clienteId &&
                      mockVehicles
                        .filter(
                          (v) => v.clienteId === formData.clienteId && v.activo,
                        )
                        .map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.marca} {vehicle.modelo} -{" "}
                            {vehicle.matricula}
                          </option>
                        ))}
                  </select>
                </div>

                {/* Tipo de Servicio */}
                <div className="form-field">
                  <label className="form-label-modern">
                    Tipo de Servicio *
                  </label>
                  <select
                    className="form-select-modern"
                    value={formData.tipoServicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoServicio: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Chapa y Pintura">Chapa y Pintura</option>
                    <option value="Revisión Pre-ITV">Revisión Pre-ITV</option>
                    <option value="Restauración">Restauración</option>
                    <option value="Diagnóstico">Diagnóstico</option>
                  </select>
                </div>

                {/* Técnico */}
                <div className="form-field">
                  <label className="form-label-modern">Técnico *</label>
                  <select
                    className="form-select-modern"
                    value={formData.tecnico}
                    onChange={(e) =>
                      setFormData({ ...formData, tecnico: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar técnico</option>
                    {mockUsers
                      .filter((u) => u.role !== "Administrador")
                      .map((user) => (
                        <option key={user.id} value={user.nombre}>
                          {user.nombre} - {user.role}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Descripción */}
                <div className="form-field full-width">
                  <label className="form-label-modern">Descripción *</label>
                  <textarea
                    className="form-textarea-modern"
                    rows="3"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descripcion: e.target.value,
                      })
                    }
                    required
                    placeholder="Describe detalladamente el servicio..."
                  />
                </div>

                {/* Fecha */}
                <div className="form-field">
                  <label className="form-label-modern">Fecha *</label>
                  <input
                    type="date"
                    className="form-input-modern"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Kilometraje */}
                <div className="form-field">
                  <label className="form-label-modern">Kilometraje *</label>
                  <input
                    type="number"
                    className="form-input-modern"
                    min="0"
                    value={formData.kilometraje}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kilometraje: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Costo */}
                <div className="form-field">
                  <label className="form-label-modern">Costo (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input-modern"
                    min="0"
                    value={formData.costo}
                    onChange={(e) =>
                      setFormData({ ...formData, costo: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Estado */}
                <div className="form-field">
                  <label className="form-label-modern">Estado *</label>
                  <select
                    className="form-select-modern"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Notas */}
                <div className="form-field full-width">
                  <label className="form-label-modern">Notas</label>
                  <textarea
                    className="form-textarea-modern"
                    rows="2"
                    value={formData.notas}
                    onChange={(e) =>
                      setFormData({ ...formData, notas: e.target.value })
                    }
                    placeholder="Observaciones adicionales..."
                  />
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="form-btn cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="form-btn submit"
                  >
                    {loading
                      ? "Guardando..."
                      : editingService
                        ? "Actualizar"
                        : "Crear Servicio"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Services Grid */}
        <div className="row">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              customer={getCustomerById(service.clienteId)}
              vehicle={getVehicleById(service.vehiculoId)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="service-card-style-2 p-5">
                <h4 className="title">
                  {searchTerm || statusFilter || technicianFilter
                    ? "No se encontraron servicios"
                    : "No hay servicios registrados"}
                </h4>
                <p className="desp">
                  {searchTerm || statusFilter || technicianFilter
                    ? "Intenta con otros filtros de búsqueda."
                    : "Comienza registrando el primer servicio."}
                </p>
                {!searchTerm && !statusFilter && !technicianFilter && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="common-btn mt-3"
                  >
                    Registrar Primer Servicio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
