import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  mockCustomers,
  mockVehicles,
  mockServiceHistory,
} from "../data/mockCustomers";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { format } from "date-fns";

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      completado: "bg-success",
      en_proceso: "bg-warning",
      pendiente: "bg-info",
      cancelado: "bg-danger",
    };
    return badges[status] || "bg-secondary";
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
      <div className="service-card-style-2">
        <div className="service-icon">
          <img src="/assets/img/icon/car-repair.svg" alt="Servicio" />
        </div>
        <div className="service-desp">
          <h4 className="title">{service.tipoServicio}</h4>
          <p className="desp mb-2">{service.descripcion}</p>

          <div className="service-details mb-3">
            <div className="row">
              <div className="col-6">
                <small className="text-muted">Fecha:</small>
                <p className="mb-1">
                  <strong>{format(service.fecha, "dd/MM/yyyy")}</strong>
                </p>
              </div>
              <div className="col-6">
                <small className="text-muted">Técnico:</small>
                <p className="mb-1">
                  <strong>{service.tecnico}</strong>
                </p>
              </div>
              <div className="col-6">
                <small className="text-muted">Kilometraje:</small>
                <p className="mb-1">
                  <strong>{service.kilometraje.toLocaleString()} km</strong>
                </p>
              </div>
              <div className="col-6">
                <small className="text-muted">Costo:</small>
                <p className="mb-1">
                  <strong>€{service.costo.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            <div className="mt-2">
              <span className={`badge ${getStatusBadge(service.estado)} me-2`}>
                {getStatusText(service.estado)}
              </span>
              {service.facturaId && (
                <span className="badge bg-primary">{service.facturaId}</span>
              )}
            </div>

            {service.notas && (
              <div className="mt-2">
                <small className="text-muted">Notas:</small>
                <p className="desp mb-0">{service.notas}</p>
              </div>
            )}
          </div>

          <div className="service-actions d-flex gap-2 flex-wrap">
            <button
              onClick={() => onEdit(service)}
              className="more-btn"
              style={{ border: "none", background: "transparent" }}
            >
              EDITAR
            </button>
            {service.facturaId && (
              <Link
                to={`/dashboard/facturas/${service.facturaId}`}
                className="more-btn"
              >
                FACTURA
              </Link>
            )}
            <button
              onClick={() => onDelete(service.id)}
              className="more-btn text-danger"
              style={{ border: "none", background: "transparent" }}
            >
              ELIMINAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleServicesPage = () => {
  const { vehicleId } = useParams();
  console.log("VehicleServicesPage - vehicleId:", vehicleId);
  console.log("mockVehicles:", mockVehicles);
  console.log("mockServiceHistory:", mockServiceHistory);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
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
    console.log("Buscando veículo com ID:", vehicleId);
    console.log(
      "Todos os veículos:",
      mockVehicles.map((v) => ({ id: v.id, marca: v.marca, modelo: v.modelo })),
    );

    // Find vehicle
    const foundVehicle = mockVehicles.find((v) => v.id === vehicleId);
    console.log("Veículo encontrado:", foundVehicle);

    if (!foundVehicle) {
      console.log("Veículo não encontrado, redirecionando...");
      navigate("/dashboard/vehiculos");
      return;
    }
    setVehicle(foundVehicle);

    // Find customer
    const foundCustomer = mockCustomers.find(
      (c) => c.id === foundVehicle.clienteId,
    );
    console.log("Cliente encontrado:", foundCustomer);
    setCustomer(foundCustomer);

    // Filter services for this vehicle
    console.log("Filtrando serviços para vehicleId:", vehicleId);
    console.log(
      "Todos os serviços:",
      mockServiceHistory.map((s) => ({
        id: s.id,
        vehiculoId: s.vehiculoId,
        tipoServicio: s.tipoServicio,
      })),
    );

    const vehicleServices = mockServiceHistory.filter(
      (s) => s.vehiculoId === vehicleId,
    );
    console.log("Serviços encontrados para o veículo:", vehicleServices);
    setServices(vehicleServices);
    setFilteredServices(vehicleServices);
  }, [vehicleId, navigate]);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.tipoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.estado.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({
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
          clienteId: vehicle.clienteId,
          vehiculoId: vehicle.id,
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

  if (!vehicle) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <CommonPageHero
        title={`Servicios - ${vehicle.marca} ${vehicle.modelo}`}
      />

      <div
        className="container"
        style={{ paddingTop: "50px", paddingBottom: "100px" }}
      >
        {/* Vehicle Info Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="service-card-style-2 p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="title mb-2">
                    {vehicle.marca} {vehicle.modelo} ({vehicle.año})
                  </h2>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="desp mb-1">
                        <strong>Propietario:</strong> {customer?.nombre}{" "}
                        {customer?.apellidos}
                      </p>
                      <p className="desp mb-1">
                        <strong>Matrícula:</strong> {vehicle.matricula}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="desp mb-1">
                        <strong>Color:</strong> {vehicle.color}
                      </p>
                      <p className="desp mb-1">
                        <strong>Kilometraje:</strong>{" "}
                        {vehicle.kilometraje.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="service-stats">
                    <span className="badge bg-primary fs-6">
                      {services.length} servicios realizados
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h1 className="page-title mb-2">Historial de Servicios</h1>
                <p className="text-muted">
                  Gestión completa de servicios del vehículo
                </p>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/dashboard/vehiculos" className="common-btn">
                  Volver a Vehículos
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

        {/* Search Section */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="search-box">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar servicios por tipo, descripción, técnico o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="service-card-style-2 p-4">
                <h3 className="title mb-4">
                  {editingService ? "Editar Servicio" : "Crear Nuevo Servicio"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Servicio *</label>
                      <select
                        className="form-control"
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
                        <option value="Revisión Pre-ITV">
                          Revisión Pre-ITV
                        </option>
                        <option value="Restauración">Restauración</option>
                        <option value="Diagnóstico">Diagnóstico</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Técnico *</label>
                      <select
                        className="form-control"
                        value={formData.tecnico}
                        onChange={(e) =>
                          setFormData({ ...formData, tecnico: e.target.value })
                        }
                        required
                      >
                        <option value="">Seleccionar técnico</option>
                        <option value="Miguel Ángel">Miguel Ángel</option>
                        <option value="José Luis">José Luis</option>
                        <option value="Antonio">Antonio</option>
                        <option value="Carlos Méndez">Carlos Méndez</option>
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Descripción *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.descripcion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descripcion: e.target.value,
                          })
                        }
                        required
                        placeholder="Describe detalladamente el servicio realizado..."
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Fecha *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.fecha}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Kilometraje *</label>
                      <input
                        type="number"
                        className="form-control"
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

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Costo (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        min="0"
                        value={formData.costo}
                        onChange={(e) =>
                          setFormData({ ...formData, costo: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado *</label>
                      <select
                        className="form-control"
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

                    <div className="col-12 mb-3">
                      <label className="form-label">Notas</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.notas}
                        onChange={(e) =>
                          setFormData({ ...formData, notas: e.target.value })
                        }
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="common-btn"
                    >
                      {loading
                        ? "Guardando..."
                        : editingService
                          ? "Actualizar"
                          : "Crear Servicio"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="more-btn"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="row">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
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
                  {searchTerm
                    ? "No se encontraron servicios"
                    : "No hay servicios registrados"}
                </h4>
                <p className="desp">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda."
                    : "Comienza registrando el primer servicio de este vehículo."}
                </p>
                {!searchTerm && (
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

// PropTypes for ServiceCard component
ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tipoServicio: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    tecnico: PropTypes.string.isRequired,
    kilometraje: PropTypes.number.isRequired,
    costo: PropTypes.number.isRequired,
    estado: PropTypes.string.isRequired,
    notas: PropTypes.string,
    facturaId: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default VehicleServicesPage;
