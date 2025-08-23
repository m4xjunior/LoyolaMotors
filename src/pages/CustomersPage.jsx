import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { clienteService, vehiculoService } from "../data/database";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { format } from "date-fns";

const CustomerCard = ({
  customer,
  vehicleCount,
  onEdit,
  onDelete,
  onViewVehicles,
}) => {
  const getTypeBadge = (type) => {
    const badges = {
      VIP: "bg-warning",
      Empresarial: "bg-primary",
      Regular: "bg-success",
      Especial: "bg-info",
    };
    return badges[type] || "bg-secondary";
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
      <div className="service-card-style-2">
        <div className="service-icon">
          <img src="/assets/img/icon/heroaddress.svg" alt="Cliente" />
        </div>
        <div className="service-desp">
          <h4 className="title">
            {customer.nombre} {customer.apellidos}
          </h4>

          <div className="customer-details mb-3">
            <div className="mb-2">
              <span className={`badge ${getTypeBadge(customer.tipo)} me-2`}>
                {customer.tipo}
              </span>
              {customer.descuento > 0 && (
                <span className="badge bg-danger">
                  -{customer.descuento}% DESC
                </span>
              )}
            </div>

            <p className="desp mb-2">
              <strong>Email:</strong> {customer.email}
            </p>
            <p className="desp mb-2">
              <strong>Teléfono:</strong> {customer.telefono}
            </p>
            <p className="desp mb-2">
              <strong>Ciudad:</strong> {customer.ciudad} (
              {customer.codigoPostal})
            </p>

            <div className="vehicle-stats mb-2">
              <span className="badge bg-primary fs-6">
                {vehicleCount} vehículo{vehicleCount !== 1 ? "s" : ""}
              </span>
            </div>

            {customer.notas && (
              <div className="mt-2">
                <small className="text-muted">Notas:</small>
                <p className="desp mb-0">{customer.notas}</p>
              </div>
            )}
          </div>

          <div className="customer-actions d-flex gap-2 flex-wrap">
            <button
              onClick={() => onEdit(customer)}
              className="more-btn"
              style={{ border: "none", background: "transparent" }}
            >
              EDITAR
            </button>
            <button
              onClick={() => onViewVehicles(customer)}
              className="more-btn"
              style={{ border: "none", background: "transparent" }}
            >
              VEHÍCULOS ({vehicleCount})
            </button>
            <button
              onClick={() => onDelete(customer.id)}
              className="more-btn text-danger"
              style={{ border: "none", background: "transparent" }}
            >
              ELIMINAR
            </button>
          </div>

          <div className="registration-date mt-2">
            <small className="text-muted">
              Cliente desde: {format(customer.fechaRegistro, "dd/MM/yyyy")}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.object.isRequired,
  vehicleCount: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewVehicles: PropTypes.func.isRequired,
};

const CustomersPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "Valencia",
    codigoPostal: "",
    tipo: "Regular",
    descuento: 0,
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showVehicles, setShowVehicles] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const customersData = clienteService.getAll();
    setCustomers(customersData);
    setFilteredCustomers(customersData);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.telefono.includes(searchTerm) ||
        customer.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.notas.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const getVehicleCount = (customerId) => {
    return vehiculoService
      .getAll()
      .filter((v) => v.clienteId === customerId && v.activo).length;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "Valencia",
      codigoPostal: "",
      tipo: "Regular",
      descuento: 0,
      notas: "",
    });
    setShowCreateForm(false);
    setEditingCustomer(null);
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

      if (editingCustomer) {
        const updatedCustomers = customers.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
                descuento: parseInt(formData.descuento),
              }
            : customer,
        );
        setCustomers(updatedCustomers);
        setSuccess("Cliente actualizado correctamente");
      } else {
        const newCustomer = {
          id: Date.now().toString(),
          ...formData,
          descuento: parseInt(formData.descuento),
          fechaRegistro: new Date(),
          activo: true,
          vehiculosCount: 0,
        };
        setCustomers([...customers, newCustomer]);
        setSuccess("Cliente creado correctamente");
      }
      resetForm();
    } catch (err) {
      setError("Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      nombre: customer.nombre,
      apellidos: customer.apellidos,
      email: customer.email,
      telefono: customer.telefono,
      direccion: customer.direccion,
      ciudad: customer.ciudad,
      codigoPostal: customer.codigoPostal,
      tipo: customer.tipo,
      descuento: customer.descuento,
      notas: customer.notas,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (customerId) => {
    const vehicleCount = getVehicleCount(customerId);
    if (vehicleCount > 0) {
      setError(
        `No se puede eliminar el cliente porque tiene ${vehicleCount} vehículo(s) registrado(s)`,
      );
      return;
    }

    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedCustomers = customers.filter(
          (customer) => customer.id !== customerId,
        );
        setCustomers(updatedCustomers);
        setSuccess("Cliente eliminado correctamente");
      } catch (err) {
        setError("Error al eliminar el cliente");
      } finally {
        setLoading(false);
      }
    }
  };

  const getCustomerStats = () => {
    const total = customers.length;
    const vip = customers.filter((c) => c.tipo === "VIP").length;
    const empresarial = customers.filter(
      (c) => c.tipo === "Empresarial",
    ).length;
    const totalVehicles = customers.reduce(
      (sum, c) => sum + getVehicleCount(c.id),
      0,
    );

    return { total, vip, empresarial, totalVehicles };
  };

  const stats = getCustomerStats();

  const handleViewVehicles = (customer) => {
    setSelectedCustomer(customer);
    setShowVehicles(true);
  };

  const handleViewMap = (customer) => {
    setSelectedCustomer(customer);
    setShowMap(true);
  };

  const getCustomerVehicles = (customerId) => {
    return vehiculoService
      .getAll()
      .filter((v) => v.clienteId === customerId && v.activo);
  };

  return (
    <>
      <CommonPageHero title="Gestión de Clientes" />

      <div
        className="container"
        style={{ paddingTop: "50px", paddingBottom: "100px" }}
      >
        {/* Statistics Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="service-card-style-2 p-4">
              <h3 className="title mb-3">Estadísticas de Clientes</h3>
              <div className="row text-center">
                <div className="col-3">
                  <div className="stat-item">
                    <h4 className="text-primary">{stats.total}</h4>
                    <p className="desp mb-0">Total Clientes</p>
                  </div>
                </div>
                <div className="col-3">
                  <div className="stat-item">
                    <h4 className="text-warning">{stats.vip}</h4>
                    <p className="desp mb-0">Clientes VIP</p>
                  </div>
                </div>
                <div className="col-3">
                  <div className="stat-item">
                    <h4 className="text-info">{stats.empresarial}</h4>
                    <p className="desp mb-0">Empresariales</p>
                  </div>
                </div>
                <div className="col-3">
                  <div className="stat-item">
                    <h4 className="text-success">{stats.totalVehicles}</h4>
                    <p className="desp mb-0">Total Vehículos</p>
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
                <h1 className="page-title mb-2">Gestión de Clientes</h1>
                <p className="text-muted">
                  Administra la base de datos de clientes
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
                  Nuevo Cliente
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
                placeholder="Buscar clientes por nombre, email, teléfono, ciudad o tipo..."
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
                  {editingCustomer ? "Editar Cliente" : "Crear Nuevo Cliente"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.apellidos}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apellidos: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                        required
                        placeholder="+34 XXX XXX XXX"
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            direccion: e.target.value,
                          })
                        }
                        placeholder="Calle, número, piso..."
                      />
                    </div>

                    <div className="col-md-8 mb-3">
                      <label className="form-label">Ciudad *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.ciudad}
                        onChange={(e) =>
                          setFormData({ ...formData, ciudad: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Código Postal *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.codigoPostal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            codigoPostal: e.target.value,
                          })
                        }
                        required
                        placeholder="46XXX"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Cliente *</label>
                      <select
                        className="form-control"
                        value={formData.tipo}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                        required
                      >
                        <option value="Regular">Regular</option>
                        <option value="VIP">VIP</option>
                        <option value="Empresarial">Empresarial</option>
                        <option value="Especial">Especial</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Descuento (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="50"
                        value={formData.descuento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descuento: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Notas</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.notas}
                        onChange={(e) =>
                          setFormData({ ...formData, notas: e.target.value })
                        }
                        placeholder="Información adicional sobre el cliente..."
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
                        : editingCustomer
                          ? "Actualizar"
                          : "Crear Cliente"}
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

        {/* Customers Grid */}
        <div className="row">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              vehicleCount={getVehicleCount(customer.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewVehicles={handleViewVehicles}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="service-card-style-2 p-5">
                <h4 className="title">
                  {searchTerm
                    ? "No se encontraron clientes"
                    : "No hay clientes registrados"}
                </h4>
                <p className="desp">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda."
                    : "Comienza registrando tu primer cliente."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="common-btn mt-3"
                  >
                    Registrar Primer Cliente
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Vehículos */}
        {showVehicles && selectedCustomer && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            data-aos="fade-in"
          >
            <div
              className="modal-dialog modal-lg"
              data-aos="zoom-in"
              data-aos-duration="400"
            >
              <div
                className="modal-content"
                style={{
                  backgroundImage: "url(/assets/img/bg/car_video_bg.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  border: "none",
                }}
              >
                {/* Overlay para legibilidade */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "inherit",
                  }}
                ></div>

                {/* Conteúdo com z-index maior */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Vehículos de {selectedCustomer.nombre}{" "}
                      {selectedCustomer.apellidos}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowVehicles(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* Info del cliente usando service-card-style-2 */}
                    <div className="service-card-style-2 mb-4">
                      <div className="service-icon">
                        <img
                          src="/assets/img/icon/heroaddress.svg"
                          alt="Cliente Info"
                        />
                      </div>
                      <div className="service-desp">
                        <h5 className="title">Información del Cliente</h5>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="desp mb-1">
                              <strong>Email:</strong> {selectedCustomer.email}
                            </p>
                            <p className="desp mb-1">
                              <strong>Teléfono:</strong>{" "}
                              {selectedCustomer.telefono}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="desp mb-1">
                              <strong>Ciudad:</strong> {selectedCustomer.ciudad}
                            </p>
                            <button
                              className="more-btn mt-2"
                              onClick={() => handleViewMap(selectedCustomer)}
                            >
                              VER EN MAPA
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de vehículos */}
                    {getCustomerVehicles(selectedCustomer.id).length === 0 ? (
                      <div className="text-center py-4">
                        <img
                          src="/assets/img/icon/car.svg"
                          alt="Sin vehículos"
                          style={{
                            width: "48px",
                            opacity: "0.5",
                            marginBottom: "16px",
                          }}
                        />
                        <h6 className="text-muted">
                          Este cliente no tiene vehículos registrados
                        </h6>
                      </div>
                    ) : (
                      <div className="row">
                        {getCustomerVehicles(selectedCustomer.id).map(
                          (vehicle, index) => (
                            <div className="col-md-6 mb-3" key={vehicle.id}>
                              {/* Usando service-card-style-2 para cada vehículo */}
                              <div
                                className="service-card-style-2"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                              >
                                <div className="service-icon">
                                  <img
                                    src="/assets/img/icon/car.svg"
                                    alt="Vehículo"
                                  />
                                </div>
                                <div className="service-desp">
                                  <h5 className="title">
                                    {vehicle.marca} {vehicle.modelo}
                                  </h5>
                                  <p className="desp mb-2">
                                    <strong>Año:</strong> {vehicle.año} |{" "}
                                    <strong>Color:</strong> {vehicle.color}
                                    <br />
                                    <strong>Matrícula:</strong>{" "}
                                    {vehicle.matricula}
                                    <br />
                                    <strong>Kilometraje:</strong>{" "}
                                    {vehicle.kilometraje.toLocaleString()} km
                                  </p>
                                  <Link
                                    to={`/dashboard/vehiculos/${vehicle.id}/servicios`}
                                    className="more-btn"
                                  >
                                    VER SERVICIOS
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="common-btn"
                      onClick={() => setShowVehicles(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Mapa */}
        {showMap && selectedCustomer && selectedCustomer.coordenadas && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            data-aos="fade-in"
          >
            <div
              className="modal-dialog modal-lg"
              data-aos="zoom-in"
              data-aos-duration="400"
            >
              <div
                className="modal-content"
                style={{
                  backgroundImage: "url(/assets/img/bg/commpagesbg.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  border: "none",
                }}
              >
                {/* Overlay para legibilidade */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "inherit",
                  }}
                ></div>

                {/* Conteúdo com z-index maior */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Ubicación de {selectedCustomer.nombre}{" "}
                      {selectedCustomer.apellidos}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowMap(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* Info dirección usando service-card-style-2 */}
                    <div className="service-card-style-2 mb-4">
                      <div className="service-icon">
                        <img
                          src="/assets/img/icon/heroaddress.svg"
                          alt="Dirección"
                        />
                      </div>
                      <div className="service-desp">
                        <h5 className="title">Dirección Completa</h5>
                        <p className="desp mb-1">
                          <strong>Dirección:</strong>{" "}
                          {selectedCustomer.direccion}
                        </p>
                        <p className="desp mb-0">
                          <strong>Ciudad:</strong> {selectedCustomer.ciudad} (
                          {selectedCustomer.codigoPostal})
                        </p>
                      </div>
                    </div>

                    {/* Mapa */}
                    <div
                      className="mb-4"
                      style={{ borderRadius: "8px", overflow: "hidden" }}
                    >
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOMMA0A35CStD4&q=${selectedCustomer.coordenadas.lat},${selectedCustomer.coordenadas.lng}&zoom=15`}
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Ubicación de ${selectedCustomer.nombre} ${selectedCustomer.apellidos}`}
                      />
                    </div>

                    {/* Botones de navegación */}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <a
                          href={`https://www.google.com/maps?q=${selectedCustomer.coordenadas.lat},${selectedCustomer.coordenadas.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="common-btn w-100 text-center"
                          style={{ textDecoration: "none" }}
                        >
                          Abrir en Google Maps
                        </a>
                      </div>
                      <div className="col-md-6">
                        <a
                          href={`https://waze.com/ul?ll=${selectedCustomer.coordenadas.lat}%2C${selectedCustomer.coordenadas.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="more-btn w-100 text-center"
                          style={{ textDecoration: "none" }}
                        >
                          Navegar con Waze
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="common-btn"
                      onClick={() => setShowMap(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomersPage;
