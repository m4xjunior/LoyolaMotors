import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { usuarioService } from "../data/database";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const PageWrapper = styled.div`
  padding: 50px 0 100px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    color: var(--heading-color);
    margin: 0;
  }
  p {
    color: var(--body-color);
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 56px;

  & > *:nth-child(1) {
    animation-delay: 0.1s;
  }
  & > *:nth-child(2) {
    animation-delay: 0.2s;
  }
  & > *:nth-child(3) {
    animation-delay: 0.3s;
  }
  & > *:nth-child(4) {
    animation-delay: 0.4s;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.98) 0%,
    rgba(32, 32, 32, 0.95) 100%
  );
  padding: 32px 28px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 61, 36, 0.25);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  animation: statCardEntrance 0.6s ease-out;

  @keyframes statCardEntrance {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 60px rgba(255, 61, 36, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 61, 36, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff3d24, #ff6b4a, #ff3d24);
    background-size: 200% 100%;
    animation: gradientShift 3s ease infinite;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 61, 36, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: rotate(45deg);
  }

  &:hover::after {
    opacity: 1;
  }

  img {
    width: 64px;
    height: 64px;
    margin-bottom: 24px;
    filter: drop-shadow(0 6px 12px rgba(255, 61, 36, 0.4)) brightness(1.1);
    transition: all 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 8px 16px rgba(255, 61, 36, 0.5)) brightness(1.2);
  }

  h4 {
    font-size: 3rem;
    color: var(--heading-color);
    margin: 0 0 12px 0;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #ff6b4a 50%, #ff3d24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  &:hover h4 {
    transform: scale(1.05);
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.3s ease;
  }

  &:hover p {
    transform: translateY(2px);
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const BaseInputStyles = `
  width: 100%;
  padding: 12px 15px;
  background-color: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const FormInput = styled.input`
  ${BaseInputStyles}
`;

const FormSelect = styled.select`
  ${BaseInputStyles}
`;

const FormLabel = styled.label`
  display: block;
  color: #ccc;
  margin-bottom: 8px;
  font-weight: 500;
`;

const FormCard = styled.div`
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #333;
  margin-bottom: 40px;

  h5 {
    font-size: 1.5rem;
    margin-bottom: 25px;
  }
`;

const Alert = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  color: #fff;
  background-color: ${(props) =>
    props.type === "success" ? "#28a745" : "#dc3545"};
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 32px;
`;

const UserCardStyled = styled.div`
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.95) 0%,
    rgba(32, 32, 32, 0.98) 100%
  );
  border: 1px solid rgba(255, 61, 36, 0.2);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(255, 61, 36, 0.25);
    border-color: rgba(255, 61, 36, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff3d24, #ff6b4a);
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  text-transform: capitalize;
  color: ${(props) => props.color || "#fff"};
  background-color: ${(props) => props.bg || "#555"};
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary-color) 0%, #ff6b4a 100%);
  color: var(--white-color);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b4a 0%, var(--primary-color) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 61, 36, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: var(--body-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const DangerButton = styled(Button)`
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background: #ef4444;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    role: "Técnico",
    especialidad: "",
    fechaContratacion: "",
    activo: true,
    serviciosCompletados: 0,
    calificacion: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = () => {
    try {
      console.log("Loading users from database...");
      const usersData = usuarioService.getAll();
      console.log("Users loaded:", usersData);
      console.log("Number of users:", usersData.length);

      // Verificar estrutura dos usuários
      if (usersData.length > 0) {
        console.log("First user structure:", Object.keys(usersData[0]));
        console.log("First user data:", usersData[0]);
      }

      setUsers(usersData);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários: " + error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.nombre.toLowerCase().includes(searchLower) ||
        user.apellidos.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.especialidad.toLowerCase().includes(searchLower);

      const matchesRole =
        selectedRole === "all" ||
        user.role.toLowerCase().includes(selectedRole.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const stats = useMemo(() => {
    const total = users.length;
    const activos = users.filter((u) => u.activo).length;
    const tecnicos = users.filter((u) =>
      u.role.toLowerCase().includes("técnico"),
    ).length;
    const promedioCalificacion =
      total > 0 ? users.reduce((sum, u) => sum + u.calificacion, 0) / total : 0;
    return { total, activos, tecnicos, promedioCalificacion };
  }, [users]);

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      role: "Técnico",
      especialidad: "",
      fechaContratacion: "",
      activo: true,
      serviciosCompletados: 0,
      calificacion: 0,
    });
    setShowCreateForm(false);
    setEditingUser(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      try {
        if (editingUser) {
          const updatedUser = {
            ...editingUser,
            ...formData,
            fechaContratacion: new Date(formData.fechaContratacion),
          };
          usuarioService.update(editingUser.id, updatedUser);
          loadUsers();
          setSuccess("Usuário atualizado com sucesso");
        } else {
          const newUser = {
            ...formData,
            id: Date.now().toString(),
            fechaContratacion: new Date(formData.fechaContratacion),
          };
          usuarioService.create(newUser);
          loadUsers();
          setSuccess("Usuário criado com sucesso");
        }
        resetForm();
      } catch (err) {
        setError("Erro ao processar a solicitação");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleEdit = (userToEdit) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingUser(userToEdit);
    setFormData({
      ...userToEdit,
      fechaContratacion: format(userToEdit.fechaContratacion, "yyyy-MM-dd"),
    });
    setShowCreateForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        console.log("Deleting user with ID:", userId);
        console.log("Current users before deletion:", users.length);

        // Verificar se o usuário existe antes de deletar
        const userToDelete = users.find((u) => u.id === userId);
        console.log("User to delete:", userToDelete);

        usuarioService.delete(userId);
        // Recarregar usuários do banco de dados após exclusão
        loadUsers();
        setSuccess("Usuário excluído com sucesso");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        setError("Erro ao excluir usuário: " + error.message);
      }
    }
  };

  // UserCard component defined inside UsersManagementPage
  const UserCard = ({ user, onEdit, onDelete }) => {
    // PropTypes for UserCard component
    UserCard.propTypes = {
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellidos: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        especialidad: PropTypes.string.isRequired,
        fechaContratacion: PropTypes.instanceOf(Date).isRequired,
        calificacion: PropTypes.number.isRequired,
        serviciosCompletados: PropTypes.number.isRequired,
      }).isRequired,
      onEdit: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
    };
    const getRoleBadgeProps = (role) => {
      const roles = {
        Administrador: { bg: "#007bff", color: "#fff" },
        "Jefe de Taller": { bg: "#ffc107", color: "#212529" },
        "Técnico Senior": { bg: "#28a745", color: "#fff" },
        "Especialista en Chapa y Pintura": { bg: "#17a2b8", color: "#fff" },
        "Técnico en Restauración": { bg: "#6c757d", color: "#fff" },
        Técnico: { bg: "#f8f9fa", color: "#212529" },
      };
      return roles[role] || { bg: "#6c757d", color: "#fff" };
    };

    const getStarRating = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars.push(<i key={i} className="fas fa-star text-warning"></i>);
        } else if (i - 0.5 <= rating) {
          stars.push(
            <i key={i} className="fas fa-star-half-alt text-warning"></i>,
          );
        } else {
          stars.push(<i key={i} className="far fa-star text-muted"></i>);
        }
      }
      return stars;
    };

    return (
      <UserCardStyled>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4
              className="title mb-2"
              style={{
                fontSize: "1.5rem",
                color: "var(--heading-color)",
                fontWeight: "700",
              }}
            >
              {user.nombre} {user.apellidos}
            </h4>
            <Badge
              {...getRoleBadgeProps(user.role)}
              style={{ fontSize: "11px", padding: "6px 12px" }}
            >
              {user.role}
            </Badge>
          </div>
          <Badge
            bg={user.activo ? "#22c55e" : "#ef4444"}
            color="#fff"
            style={{ fontSize: "11px", padding: "6px 12px" }}
          >
            {user.activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        <div
          style={{
            color: "var(--body-color)",
            fontSize: "14px",
            flexGrow: 1,
            marginBottom: "20px",
          }}
        >
          <p
            className="mb-3"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i
              className="fas fa-envelope"
              style={{ color: "#ff3d24", width: "16px" }}
            ></i>
            <span>{user.email}</span>
          </p>
          <p
            className="mb-3"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i
              className="fas fa-phone"
              style={{ color: "#ff3d24", width: "16px" }}
            ></i>
            <span>{user.telefono}</span>
          </p>
          <p
            className="mb-3"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i
              className="fas fa-tools"
              style={{ color: "#ff3d24", width: "16px" }}
            ></i>
            <span>{user.especialidad}</span>
          </p>
          <p
            className="mb-4"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i
              className="fas fa-calendar"
              style={{ color: "#ff3d24", width: "16px" }}
            ></i>
            <span>
              Desde {format(user.fechaContratacion, "MMM yyyy", { locale: es })}
            </span>
          </p>

          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              padding: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStarRating(user.calificacion)}
              <small
                className="ms-1"
                style={{ color: "var(--heading-color)", fontWeight: "600" }}
              >
                ({user.calificacion.toFixed(1)})
              </small>
            </div>
            <small style={{ color: "var(--body-color)", fontWeight: "500" }}>
              {user.serviciosCompletados} servicios
            </small>
          </div>
        </div>

        <div className="d-flex gap-3 mt-auto">
          <PrimaryButton onClick={() => onEdit(user)} style={{ flex: 1 }}>
            <i className="fas fa-edit"></i>Editar
          </PrimaryButton>
          <DangerButton onClick={() => onDelete(user.id)} style={{ flex: 1 }}>
            <i className="fas fa-trash"></i>Eliminar
          </DangerButton>
        </div>
      </UserCardStyled>
    );
  };

  return (
    <>
      <GlobalStyle />
      <CommonPageHero title="Gestão de Usuários" />
      <PageWrapper className="container">
        <Header>
          <div>
            <h1>Gestão de Usuários</h1>
            <p>Administre técnicos e pessoal da oficina</p>
          </div>
          <PrimaryButton
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingUser(null);
            }}
          >
            <i className={`fas ${showCreateForm ? "fa-times" : "fa-plus"}`}></i>
            {showCreateForm ? "Fechar Formulário" : "Novo Usuário"}
          </PrimaryButton>
        </Header>

        <StatsGrid>
          <StatCard>
            <img src="/assets/img/icon/team.svg" alt="Total de Usuários" />
            <h4>{stats.total}</h4>
            <p>Total de Usuários</p>
          </StatCard>
          <StatCard>
            <img src="/assets/img/icon/user-check.svg" alt="Usuários Ativos" />
            <h4>{stats.activos}</h4>
            <p>Usuários Ativos</p>
          </StatCard>
          <StatCard>
            <img src="/assets/img/icon/tools.svg" alt="Técnicos" />
            <h4>{stats.tecnicos}</h4>
            <p>Técnicos</p>
          </StatCard>
          <StatCard>
            <img src="/assets/img/icon/star.svg" alt="Avaliação Média" />
            <h4>{stats.promedioCalificacion.toFixed(1)}</h4>
            <p>Avaliação Média</p>
          </StatCard>
        </StatsGrid>

        {error && <Alert type="danger">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {showCreateForm && (
          <FormCard>
            <h5>{editingUser ? "Editar Usuário" : "Criar Novo Usuário"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormLabel>Nome *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Sobrenome *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) =>
                      setFormData({ ...formData, apellidos: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Email *</FormLabel>
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Telefone</FormLabel>
                  <FormInput
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Função *</FormLabel>
                  <FormSelect
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option>Técnico</option>
                    <option>Técnico Senior</option>
                    <option>Especialista em Chapa y Pintura</option>
                    <option>Técnico en Restauración</option>
                    <option>Jefe de Taller</option>
                    <option>Administrador</option>
                  </FormSelect>
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Especialidade</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.especialidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        especialidad: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Data de Contratação</FormLabel>
                  <FormInput
                    type="date"
                    value={formData.fechaContratacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaContratacion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormLabel>Avaliação</FormLabel>
                  <FormSelect
                    value={formData.calificacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calificacion: parseFloat(e.target.value),
                      })
                    }
                  >
                    {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 4.7, 4.8, 4.9, 5].map(
                      (v) => (
                        <option key={v} value={v}>
                          {v.toFixed(1)}
                        </option>
                      ),
                    )}
                  </FormSelect>
                </div>
              </div>
              <div className="d-flex gap-3 mt-3">
                <PrimaryButton type="submit" disabled={loading}>
                  {loading
                    ? "Salvando..."
                    : editingUser
                      ? "Atualizar"
                      : "Criar"}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={resetForm}>
                  Cancelar
                </SecondaryButton>
              </div>
            </form>
          </FormCard>
        )}

        <FilterWrapper>
          <div style={{ flex: 2, minWidth: "250px" }}>
            <FormInput
              type="text"
              placeholder="Buscar por nome, email ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <FormSelect
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Todas as Funções</option>
              <option value="técnico">Técnicos</option>
              <option value="jefe">Chefe de Oficina</option>
              <option value="admin">Administrador</option>
            </FormSelect>
          </div>
        </FilterWrapper>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="/assets/img/icon/team.svg"
              alt="Sem usuários"
              style={{
                width: "80px",
                height: "80px",
                opacity: "0.3",
                marginBottom: "20px",
              }}
            />
            <h5 style={{ color: "#777" }}>Nenhum usuário encontrado</h5>
            <p style={{ color: "#555" }}>Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <UserGrid>
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </UserGrid>
        )}
      </PageWrapper>
    </>
  );
};

export default UsersManagementPage;
