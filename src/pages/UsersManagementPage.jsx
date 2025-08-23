import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockUsers } from '../data/mockCustomers';

const UsersManagementPage = () => {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    role: 'Técnico',
    especialidad: '',
    fechaContratacion: '',
    activo: true,
    serviciosCompletados: 0,
    calificacion: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role.toLowerCase().includes(selectedRole.toLowerCase());
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const getUserStats = () => {
    const total = users.length;
    const activos = users.filter(u => u.activo).length;
    const tecnicos = users.filter(u => u.role.toLowerCase().includes('técnico')).length;
    const totalServicios = users.reduce((sum, u) => sum + u.serviciosCompletados, 0);
    const promedioCalificacion = users.reduce((sum, u) => sum + u.calificacion, 0) / users.length;

    return { total, activos, tecnicos, totalServicios, promedioCalificacion };
  };

  const stats = getUserStats();

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      role: 'Técnico',
      especialidad: '',
      fechaContratacion: '',
      activo: true,
      serviciosCompletados: 0,
      calificacion: 0
    });
    setShowCreateForm(false);
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      try {
        if (editingUser) {
          setSuccess('Usuario actualizado correctamente');
        } else {
          setSuccess('Usuario creado correctamente');
        }
        resetForm();
      } catch (err) {
        setError('Error al procesar la solicitud');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      nombre: userToEdit.nombre,
      apellidos: userToEdit.apellidos,
      email: userToEdit.email,
      telefono: userToEdit.telefono,
      role: userToEdit.role,
      especialidad: userToEdit.especialidad,
      fechaContratacion: format(userToEdit.fechaContratacion, 'yyyy-MM-dd'),
      activo: userToEdit.activo,
      serviciosCompletados: userToEdit.serviciosCompletados,
      calificacion: userToEdit.calificacion
    });
    setShowCreateForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setLoading(true);
      setTimeout(() => {
        setSuccess('Usuario eliminado correctamente');
        setLoading(false);
      }, 1000);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'Administrador': 'bg-primary',
      'Jefe de Taller': 'bg-warning text-dark',
      'Técnico Senior': 'bg-success',
      'Especialista en Chapa y Pintura': 'bg-info',
      'Técnico en Restauración': 'bg-secondary',
      'Técnico': 'bg-light text-dark'
    };
    return badges[role] || 'bg-secondary';
  };

  const getStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
    }

    return stars;
  };

  const UserCard = ({ user, onEdit, onDelete }) => (
    <div className="service-card-style-2 h-100">
      <div className="service-icon">
        <img src="/assets/img/icon/user.svg" alt="Usuario" />
      </div>
      <div className="service-desp">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="title">{user.nombre} {user.apellidos}</h4>
          <span className={`badge ${getRoleBadge(user.role)}`} style={{ fontSize: '10px' }}>
            {user.role}
          </span>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-envelope me-1"></i>{user.email}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-phone me-1"></i>{user.telefono}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-tools me-1"></i>{user.especialidad}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-calendar me-1"></i>
            Desde {format(user.fechaContratacion, 'MMM yyyy', { locale: es })}
          </small>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="mb-1">
              {getStarRating(user.calificacion)}
              <small className="text-muted ms-1">({user.calificacion})</small>
            </div>
            <small className="text-muted">{user.serviciosCompletados} servicios</small>
          </div>
          <div className="text-end">
            {user.activo ? (
              <span className="badge bg-success">Activo</span>
            ) : (
              <span className="badge bg-danger">Inactivo</span>
            )}
          </div>
        </div>
        
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className="more-btn"
            onClick={() => onEdit(user)}
          >
            <i className="fas fa-edit me-1"></i>Editar
          </button>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(user.id)}
          >
            <i className="fas fa-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CommonPageHero title="Gestión de Usuarios" />
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
        
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h1 className="page-title mb-2">Gestión de Usuarios</h1>
                <p className="text-muted">Administra técnicos y personal del taller</p>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <button 
                  className="common-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nuevo Usuario
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="service-card-style-2 text-center">
              <div className="service-icon">
                <img src="/assets/img/icon/team.svg" alt="Total Usuarios" />
              </div>
              <div className="service-desp">
                <h4 className="title">{stats.total}</h4>
                <p className="desp mb-0">Total Usuarios</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="service-card-style-2 text-center">
              <div className="service-icon">
                <img src="/assets/img/icon/user-check.svg" alt="Usuarios Activos" />
              </div>
              <div className="service-desp">
                <h4 className="title">{stats.activos}</h4>
                <p className="desp mb-0">Usuarios Activos</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="service-card-style-2 text-center">
              <div className="service-icon">
                <img src="/assets/img/icon/tools.svg" alt="Técnicos" />
              </div>
              <div className="service-desp">
                <h4 className="title">{stats.tecnicos}</h4>
                <p className="desp mb-0">Técnicos</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="service-card-style-2 text-center">
              <div className="service-icon">
                <img src="/assets/img/icon/star.svg" alt="Calificación Promedio" />
              </div>
              <div className="service-desp">
                <h4 className="title">{stats.promedioCalificacion.toFixed(1)}</h4>
                <p className="desp mb-0">Calificación Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-lg-6 col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, email o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-lg-3 col-md-4">
            <select 
              className="form-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="técnico">Técnicos</option>
              <option value="jefe">Jefe de Taller</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {/* Formulario */}
        {showCreateForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellidos *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rol *</label>
                    <select
                      className="form-control"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Técnico">Técnico</option>
                      <option value="Técnico Senior">Técnico Senior</option>
                      <option value="Especialista en Chapa y Pintura">Especialista en Chapa y Pintura</option>
                      <option value="Técnico en Restauración">Técnico en Restauración</option>
                      <option value="Jefe de Taller">Jefe de Taller</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Especialidad</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.especialidad}
                      onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                      placeholder="Motor y Transmisión, Carrocería..."
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Contratación</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.fechaContratacion}
                      onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Calificación</label>
                    <select
                      className="form-control"
                      value={formData.calificacion}
                      onChange={(e) => setFormData({ ...formData, calificacion: parseFloat(e.target.value) })}
                    >
                      <option value="0">Sin calificar</option>
                      <option value="4.0">4.0 - Bueno</option>
                      <option value="4.5">4.5 - Muy Bueno</option>
                      <option value="4.7">4.7 - Excelente</option>
                      <option value="4.8">4.8 - Excepcional</option>
                      <option value="4.9">4.9 - Sobresaliente</option>
                      <option value="5.0">5.0 - Perfecto</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="common-btn"
                  >
                    {loading ? 'Guardando...' : (editingUser ? 'Actualizar Usuario' : 'Crear Usuario')}
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
        )}

        {/* Lista de Usuarios */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <img src="/assets/img/icon/team.svg" alt="Sin usuarios" style={{ width: '64px', height: '64px', opacity: '0.5', marginBottom: '16px' }} />
            <h5 className="text-muted mb-0">No se encontraron usuarios</h5>
            <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="row">
            {filteredUsers.map((userItem) => (
              <div className="col-lg-4 col-md-6 mb-4" key={userItem.id} data-aos="fade-up">
                <UserCard 
                  user={userItem} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UsersManagementPage;

