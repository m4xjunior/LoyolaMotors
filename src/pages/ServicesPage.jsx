import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { mockCustomers, mockVehicles, mockServiceHistory, mockUsers } from '../data/mockCustomers';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';
import { format } from 'date-fns';

const ServiceCard = ({ service, customer, vehicle, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'completado': 'bg-success',
      'en_proceso': 'bg-warning',
      'pendiente': 'bg-info',
      'cancelado': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      'completado': 'Completado',
      'en_proceso': 'En Proceso',
      'pendiente': 'Pendiente',
      'cancelado': 'Cancelado'
    };
    return texts[status] || status;
  };

  return (
    <div className="col-lg-6 col-md-12 mb-4" data-aos="fade-up">
      <div className="service-card-style-2">
        <div className="service-icon">
          <img src="/assets/img/icon/service-icon-1.svg" alt="Servicio" />
        </div>
        <div className="service-desp">
          <h4 className="title">{service.tipoServicio}</h4>
          <p className="desp mb-2">{service.descripcion}</p>
          
          <div className="service-details mb-3">
            <div className="row">
              <div className="col-6">
                <small className="text-muted">Cliente:</small>
                <p className="mb-1"><strong>{customer?.nombre} {customer?.apellidos}</strong></p>
              </div>
              <div className="col-6">
                <small className="text-muted">Vehículo:</small>
                <p className="mb-1"><strong>{vehicle?.marca} {vehicle?.modelo}</strong></p>
              </div>
              <div className="col-6">
                <small className="text-muted">Fecha:</small>
                <p className="mb-1"><strong>{format(service.fecha, 'dd/MM/yyyy')}</strong></p>
              </div>
              <div className="col-6">
                <small className="text-muted">Técnico:</small>
                <p className="mb-1"><strong>{service.tecnico}</strong></p>
              </div>
              <div className="col-6">
                <small className="text-muted">Kilometraje:</small>
                <p className="mb-1"><strong>{service.kilometraje.toLocaleString()} km</strong></p>
              </div>
              <div className="col-6">
                <small className="text-muted">Costo:</small>
                <p className="mb-1"><strong>€{service.costo.toFixed(2)}</strong></p>
              </div>
            </div>
            
            <div className="mt-2">
              <span className={`badge ${getStatusBadge(service.estado)} me-2`}>
                {getStatusText(service.estado)}
              </span>
              {service.facturaId && (
                <span className="badge bg-primary">
                  {service.facturaId}
                </span>
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
              style={{ border: 'none', background: 'transparent' }}
            >
              EDITAR
            </button>
            <Link
              to={`/dashboard/vehiculos/${service.vehiculoId}/servicios`}
              className="more-btn"
            >
              VER VEHÍCULO
            </Link>
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
              style={{ border: 'none', background: 'transparent' }}
            >
              ELIMINAR
            </button>
          </div>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    vehiculoId: '',
    tipoServicio: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    kilometraje: 0,
    costo: 0,
    estado: 'pendiente',
    tecnico: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setServices(mockServiceHistory);
    setFilteredServices(mockServiceHistory);
  }, []);

  useEffect(() => {
    let filtered = services.filter(service => {
      const customer = mockCustomers.find(c => c.id === service.clienteId);
      const vehicle = mockVehicles.find(v => v.id === service.vehiculoId);
      
      const searchMatch = 
        service.tipoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle?.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle?.modelo.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === '' || service.estado === statusFilter;
      const technicianMatch = technicianFilter === '' || service.tecnico === technicianFilter;

      return searchMatch && statusMatch && technicianMatch;
    });

    setFilteredServices(filtered);
  }, [searchTerm, statusFilter, technicianFilter, services]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getServiceStats = () => {
    const total = services.length;
    const completados = services.filter(s => s.estado === 'completado').length;
    const enProceso = services.filter(s => s.estado === 'en_proceso').length;
    const pendientes = services.filter(s => s.estado === 'pendiente').length;
    const ingresos = services
      .filter(s => s.estado === 'completado')
      .reduce((sum, s) => sum + s.costo, 0);
    
    return { total, completados, enProceso, pendientes, ingresos };
  };

  const getCustomerById = (id) => mockCustomers.find(c => c.id === id);
  const getVehicleById = (id) => mockVehicles.find(v => v.id === id);

  const resetForm = () => {
    setFormData({
      clienteId: '',
      vehiculoId: '',
      tipoServicio: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      kilometraje: 0,
      costo: 0,
      estado: 'pendiente',
      tecnico: '',
      notas: ''
    });
    setShowCreateForm(false);
    setEditingService(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingService) {
        const updatedServices = services.map(service =>
          service.id === editingService.id
            ? { ...service, ...formData, fecha: new Date(formData.fecha), kilometraje: parseInt(formData.kilometraje), costo: parseFloat(formData.costo) }
            : service
        );
        setServices(updatedServices);
        setSuccess('Servicio actualizado correctamente');
      } else {
        const newService = {
          id: Date.now().toString(),
          ...formData,
          fecha: new Date(formData.fecha),
          kilometraje: parseInt(formData.kilometraje),
          costo: parseFloat(formData.costo),
          facturaId: formData.estado === 'completado' ? `FAC-${Date.now()}` : null
        };
        setServices([...services, newService]);
        setSuccess('Servicio creado correctamente');
      }
      resetForm();
    } catch (err) {
      setError('Error al guardar el servicio');
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
      fecha: service.fecha.toISOString().split('T')[0],
      kilometraje: service.kilometraje,
      costo: service.costo,
      estado: service.estado,
      tecnico: service.tecnico,
      notas: service.notas
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedServices = services.filter(service => service.id !== serviceId);
        setServices(updatedServices);
        setSuccess('Servicio eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el servicio');
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = getServiceStats();

  return (
    <>
      <CommonPageHero title="Gestión de Servicios" />
      
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
        {/* Statistics Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="service-card-style-2 p-4">
              <h3 className="title mb-3">Estadísticas de Servicios</h3>
              <div className="row text-center">
                <div className="col-md-2 col-6">
                  <div className="stat-item">
                    <h4 className="text-primary">{stats.total}</h4>
                    <p className="desp mb-0">Total Servicios</p>
                  </div>
                </div>
                <div className="col-md-2 col-6">
                  <div className="stat-item">
                    <h4 className="text-success">{stats.completados}</h4>
                    <p className="desp mb-0">Completados</p>
                  </div>
                </div>
                <div className="col-md-2 col-6">
                  <div className="stat-item">
                    <h4 className="text-warning">{stats.enProceso}</h4>
                    <p className="desp mb-0">En Proceso</p>
                  </div>
                </div>
                <div className="col-md-2 col-6">
                  <div className="stat-item">
                    <h4 className="text-info">{stats.pendientes}</h4>
                    <p className="desp mb-0">Pendientes</p>
                  </div>
                </div>
                <div className="col-md-4 col-12 mt-3 mt-md-0">
                  <div className="stat-item">
                    <h4 className="text-success">€{stats.ingresos.toFixed(2)}</h4>
                    <p className="desp mb-0">Ingresos Totales</p>
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
                <p className="text-muted">Vista general de todos los servicios del taller</p>
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
                  style={{ backgroundColor: '#dc3545' }}
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
              {mockUsers.filter(u => u.role !== 'Administrador').map(user => (
                <option key={user.id} value={user.nombre}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTechnicianFilter('');
              }}
              className="common-btn w-100"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="service-card-style-2 p-4">
                <h3 className="title mb-4">
                  {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cliente *</label>
                      <select
                        className="form-control"
                        value={formData.clienteId}
                        onChange={(e) => {
                          setFormData({ ...formData, clienteId: e.target.value, vehiculoId: '' });
                        }}
                        required
                      >
                        <option value="">Seleccionar cliente</option>
                        {mockCustomers.filter(c => c.activo).map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.nombre} {customer.apellidos}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Vehículo *</label>
                      <select
                        className="form-control"
                        value={formData.vehiculoId}
                        onChange={(e) => setFormData({ ...formData, vehiculoId: e.target.value })}
                        required
                        disabled={!formData.clienteId}
                      >
                        <option value="">Seleccionar vehículo</option>
                        {formData.clienteId && mockVehicles
                          .filter(v => v.clienteId === formData.clienteId && v.activo)
                          .map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.marca} {vehicle.modelo} - {vehicle.matricula}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Servicio *</label>
                      <select
                        className="form-control"
                        value={formData.tipoServicio}
                        onChange={(e) => setFormData({ ...formData, tipoServicio: e.target.value })}
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
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Técnico *</label>
                      <select
                        className="form-control"
                        value={formData.tecnico}
                        onChange={(e) => setFormData({ ...formData, tecnico: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar técnico</option>
                        {mockUsers.filter(u => u.role !== 'Administrador').map(user => (
                          <option key={user.id} value={user.nombre}>
                            {user.nombre} - {user.role}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label className="form-label">Descripción *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        required
                        placeholder="Describe detalladamente el servicio..."
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Fecha *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado *</label>
                      <select
                        className="form-control"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
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
                      {loading ? 'Guardando...' : (editingService ? 'Actualizar' : 'Crear Servicio')}
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
                  {searchTerm || statusFilter || technicianFilter ? 'No se encontraron servicios' : 'No hay servicios registrados'}
                </h4>
                <p className="desp">
                  {searchTerm || statusFilter || technicianFilter
                    ? 'Intenta con otros filtros de búsqueda.' 
                    : 'Comienza registrando el primer servicio.'
                  }
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