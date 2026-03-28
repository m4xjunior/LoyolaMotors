import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import {
  servicioService,
  clienteService,
  vehiculoService,
} from "../data/database";
import "../styles/Dashboard.scss";

const NovoServicoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clienteId: "",
    vehiculoId: "",
    tipo: "",
    descripcion: "",
    fecha: "",
    fechaPrevista: "",
    costo: "",
    estado: "pendiente",
    prioridad: "normal",
    notas: "",
    tempoEstimado: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);

  const tiposServicio = [
    {
      value: "Chapa y Pintura Completa",
      label: "Chapa y Pintura Completa",
      icon: "🎨",
      color: "#ff3d24",
    },
    {
      value: "Reparación de Abolladuras",
      label: "Reparación de Abolladuras",
      icon: "🔧",
      color: "#10b981",
    },
    {
      value: "Pintura de Vehículo",
      label: "Pintura de Vehículo",
      icon: "🖌️",
      color: "#3b82f6",
    },
    {
      value: "Sustitución de Parachoques",
      label: "Sustitución de Parachoques",
      icon: "🛡️",
      color: "#f59e0b",
    },
    {
      value: "Reparación de Puertas",
      label: "Reparación de Puertas",
      icon: "🚪",
      color: "#ef4444",
    },
    {
      value: "Alineación de Carrocería",
      label: "Alineación de Carrocería",
      icon: "📏",
      color: "#8b5cf6",
    },
    {
      value: "Pulido y Acabados",
      label: "Pulido y Acabados",
      icon: "✨",
      color: "#06b6d4",
    },
    {
      value: "Tratamiento Anticorrosión",
      label: "Tratamiento Anticorrosión",
      icon: "🛡️",
      color: "#059669",
    },
    {
      value: "Sustitución de Cristales",
      label: "Sustitución de Cristales",
      icon: "🔍",
      color: "#7c3aed",
    },
    {
      value: "Revisión General",
      label: "Revisión General",
      icon: "📋",
      color: "#d97706",
    },
    {
      value: "Mecánica General",
      label: "Mecánica General",
      icon: "⚙️",
      color: "#6b7280",
    },
    {
      value: "Otro Servicio",
      label: "Otro Servicio",
      icon: "🔨",
      color: "#9ca3af",
    },
  ];

  const estadosServicio = [
    { value: "pendiente", label: "Pendente", color: "#f59e0b" },
    { value: "en_proceso", label: "Em Processo", color: "#3b82f6" },
    { value: "completado", label: "Completado", color: "#10b981" },
    { value: "cancelado", label: "Cancelado", color: "#ef4444" },
  ];

  const prioridadOptions = [
    { value: "baja", label: "Baixa", color: "#10b981" },
    { value: "normal", label: "Normal", color: "#6b7280" },
    { value: "alta", label: "Alta", color: "#f59e0b" },
    { value: "urgente", label: "Urgente", color: "#ef4444" },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadClientes();
    loadVehiculos();
    setDefaultDate();
  }, [user, navigate]);

  useEffect(() => {
    // Filtrar veículos quando cliente é selecionado
    if (formData.clienteId) {
      const clienteVehiculos = vehiculos.filter(
        (v) => v.clienteId === formData.clienteId && v.activo,
      );
      setFilteredVehiculos(clienteVehiculos);

      // Reset do veículo se cliente mudou
      if (
        formData.vehiculoId &&
        !clienteVehiculos.find((v) => v.id === formData.vehiculoId)
      ) {
        setFormData((prev) => ({ ...prev, vehiculoId: "" }));
      }
    } else {
      setFilteredVehiculos([]);
      setFormData((prev) => ({ ...prev, vehiculoId: "" }));
    }
  }, [formData.clienteId, formData.vehiculoId, vehiculos]);

  const loadClientes = () => {
    const clientesData = clienteService.getActive();
    setClientes(clientesData);
  };

  const loadVehiculos = () => {
    const vehiculosData = vehiculoService.getActive();
    setVehiculos(vehiculosData);
  };

  const setDefaultDate = () => {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      fecha: today,
      fechaPrevista: nextWeekStr,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar cliente
    if (!formData.clienteId) {
      newErrors.clienteId = "Cliente é obrigatório";
    }

    // Validar veículo
    if (!formData.vehiculoId) {
      newErrors.vehiculoId = "Veículo é obrigatório";
    }

    // Validar tipo de serviço
    if (!formData.tipo) {
      newErrors.tipo = "Tipo de serviço é obrigatório";
    }

    // Validar descrição
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "Descrição é obrigatória";
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = "Descrição deve ter pelo menos 10 caracteres";
    }

    // Validar data
    if (!formData.fecha) {
      newErrors.fecha = "Data do serviço é obrigatória";
    }

    // Validar data prevista
    if (!formData.fechaPrevista) {
      newErrors.fechaPrevista = "Data prevista é obrigatória";
    } else if (new Date(formData.fechaPrevista) < new Date(formData.fecha)) {
      newErrors.fechaPrevista =
        "Data prevista não pode ser anterior à data do serviço";
    }

    // Validar custo
    if (!formData.costo) {
      newErrors.costo = "Valor estimado é obrigatório";
    } else if (parseFloat(formData.costo) <= 0) {
      newErrors.costo = "Valor deve ser maior que zero";
    }

    // Validar tempo estimado
    if (!formData.tempoEstimado) {
      newErrors.tempoEstimado = "Tempo estimado é obrigatório";
    } else if (parseInt(formData.tempoEstimado) <= 0) {
      newErrors.tempoEstimado = "Tempo deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Formatação para campos específicos
    if (name === "costo") {
      // Permitir apenas números e ponto decimal
      newValue = value.replace(/[^0-9.]/g, "");
      // Garantir apenas um ponto decimal
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    if (name === "tempoEstimado") {
      // Permitir apenas números inteiros
      newValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Criar serviço
      const novoServico = servicioService.create({
        ...formData,
        costo: parseFloat(formData.costo),
        tempoServico: parseInt(formData.tempoEstimado),
        fecha: new Date(formData.fecha).toISOString(),
        fechaPrevista: new Date(formData.fechaPrevista).toISOString(),
      });

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/dashboard/servicios", {
          state: {
            message: `Serviço ${novoServico.tipo} criado com sucesso!`,
            servicioId: novoServico.id,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      setErrors({ submit: "Erro ao criar serviço. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clienteId: "",
      vehiculoId: "",
      tipo: "",
      descripcion: "",
      fecha: "",
      fechaPrevista: "",
      costo: "",
      estado: "pendiente",
      prioridad: "normal",
      notas: "",
      tempoEstimado: "",
    });
    setErrors({});
    setSuccess(false);
    setDefaultDate();
  };

  const getClienteInfo = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : "";
  };

  const getVehicleInfo = (vehiculoId) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    return vehiculo
      ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.matricula})`
      : "";
  };

  const selectedTipoServicio = tiposServicio.find(
    (t) => t.value === formData.tipo,
  );
  const selectedEstado = estadosServicio.find(
    (e) => e.value === formData.estado,
  );
  const selectedPrioridad = prioridadOptions.find(
    (p) => p.value === formData.prioridad,
  );

  if (success) {
    return (
      <>
        <CommonPageHero title="Novo Serviço" />
        <div className="dashboard-container">
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                textAlign: "center",
              }}
            >
              <div className="dashboard-panel" style={{ maxWidth: "500px" }}>
                <div
                  style={{
                    color: "#22c55e",
                    fontSize: "48px",
                    marginBottom: "20px",
                  }}
                >
                  ✓
                </div>
                <h2
                  style={{
                    color: "var(--heading-color)",
                    marginBottom: "16px",
                    fontFamily: "var(--heading-font-family)",
                  }}
                >
                  Serviço Criado com Sucesso!
                </h2>
                <p
                  style={{
                    color: "var(--body-color)",
                    marginBottom: "24px",
                    opacity: 0.8,
                  }}
                >
                  O serviço {formData.tipo} foi cadastrado no sistema.
                  Redirecionando para a lista de serviços...
                </p>
                <div
                  className="loading-skeleton"
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "#22c55e",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CommonPageHero title="Cadastrar Novo Serviço" />

      <div className="dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Novo Serviço</h1>
              <p className="dashboard-subtitle">
                Cadastrar um novo serviço no sistema LoyolaMotors
              </p>
            </div>
            <div className="dashboard-actions">
              <Link to="/dashboard/servicios" className="logout-btn">
                ← Voltar à Lista
              </Link>
            </div>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="dashboard-panel"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <div className="panel-header">
              <h3>Informações do Serviço</h3>
              <button
                type="button"
                onClick={resetForm}
                className="panel-action"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--primary-color)",
                  cursor: "pointer",
                }}
              >
                Limpar Formulário
              </button>
            </div>

            {errors.submit && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "24px",
                  color: "#ef4444",
                  fontSize: "14px",
                }}
              >
                {errors.submit}
              </div>
            )}

            {/* Cliente e Veículo */}
            <div style={{ marginBottom: "32px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  color: "var(--heading-color)",
                  marginBottom: "20px",
                  fontFamily: "var(--heading-font-family)",
                }}
              >
                Cliente e Veículo
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Cliente *
                  </label>
                  <select
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.clienteId ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                        style={{ backgroundColor: "#1a1a1a" }}
                      >
                        {cliente.nombre} {cliente.apellidos} - {cliente.email}
                      </option>
                    ))}
                  </select>
                  {errors.clienteId && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.clienteId}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Veículo *
                  </label>
                  <select
                    name="vehiculoId"
                    value={formData.vehiculoId}
                    onChange={handleInputChange}
                    disabled={!formData.clienteId}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.vehiculoId ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                      opacity: !formData.clienteId ? 0.5 : 1,
                    }}
                  >
                    <option value="">
                      {!formData.clienteId
                        ? "Primeiro selecione um cliente"
                        : "Selecione um veículo"}
                    </option>
                    {filteredVehiculos.map((vehiculo) => (
                      <option
                        key={vehiculo.id}
                        value={vehiculo.id}
                        style={{ backgroundColor: "#1a1a1a" }}
                      >
                        {vehiculo.marca} {vehiculo.modelo} ({vehiculo.matricula}
                        ) - {vehiculo.año}
                      </option>
                    ))}
                  </select>
                  {errors.vehiculoId && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.vehiculoId}
                    </span>
                  )}
                </div>
              </div>

              {/* Resumo do cliente/veículo selecionado */}
              {formData.clienteId && formData.vehiculoId && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "rgba(255, 61, 36, 0.1)",
                    border: "1px solid rgba(255, 61, 36, 0.2)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--heading-color)",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    📋 Resumo Selecionado:
                  </div>
                  <div style={{ color: "var(--body-color)" }}>
                    <strong>Cliente:</strong>{" "}
                    {getClienteInfo(formData.clienteId)}
                  </div>
                  <div style={{ color: "var(--body-color)" }}>
                    <strong>Veículo:</strong>{" "}
                    {getVehicleInfo(formData.vehiculoId)}
                  </div>
                </div>
              )}
            </div>

            {/* Tipo de Serviço */}
            <div style={{ marginBottom: "32px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  color: "var(--heading-color)",
                  marginBottom: "20px",
                  fontFamily: "var(--heading-font-family)",
                }}
              >
                Tipo de Serviço *
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                {tiposServicio.map((tipo) => (
                  <label
                    key={tipo.value}
                    style={{
                      display: "block",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={formData.tipo === tipo.value}
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                    />
                    <div
                      style={{
                        padding: "12px",
                        border: `2px solid ${formData.tipo === tipo.value ? tipo.color : "rgba(255, 255, 255, 0.1)"}`,
                        borderRadius: "8px",
                        backgroundColor:
                          formData.tipo === tipo.value
                            ? `${tipo.color}20`
                            : "rgba(255, 255, 255, 0.02)",
                        transition: "all 0.2s ease",
                        textAlign: "center",
                        minHeight: "60px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <div style={{ fontSize: "20px" }}>{tipo.icon}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color:
                            formData.tipo === tipo.value
                              ? tipo.color
                              : "var(--heading-color)",
                          lineHeight: "1.2",
                        }}
                      >
                        {tipo.label}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {errors.tipo && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    display: "block",
                  }}
                >
                  {errors.tipo}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "var(--body-color)",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Descrição Detalhada *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${errors.descripcion ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                  borderRadius: "8px",
                  color: "var(--heading-color)",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder="Descreva detalhadamente o serviço a ser realizado..."
              />
              {errors.descripcion && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.descripcion}
                </span>
              )}
            </div>

            {/* Datas e Valores */}
            <div style={{ marginBottom: "32px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  color: "var(--heading-color)",
                  marginBottom: "20px",
                  fontFamily: "var(--heading-font-family)",
                }}
              >
                Agendamento e Valores
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Data do Serviço *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.fecha ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                  {errors.fecha && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.fecha}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Data Prevista Conclusão *
                  </label>
                  <input
                    type="date"
                    name="fechaPrevista"
                    value={formData.fechaPrevista}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.fechaPrevista ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                  {errors.fechaPrevista && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.fechaPrevista}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Valor Estimado (€) *
                  </label>
                  <input
                    type="text"
                    name="costo"
                    value={formData.costo}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.costo ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    placeholder="150.00"
                  />
                  {errors.costo && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.costo}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Tempo Estimado (horas) *
                  </label>
                  <input
                    type="text"
                    name="tempoEstimado"
                    value={formData.tempoEstimado}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${errors.tempoEstimado ? "#ef4444" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: "var(--heading-color)",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    placeholder="2"
                  />
                  {errors.tempoEstimado && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.tempoEstimado}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Estado e Prioridade */}
            <div style={{ marginBottom: "32px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  color: "var(--heading-color)",
                  marginBottom: "20px",
                  fontFamily: "var(--heading-font-family)",
                }}
              >
                Status e Prioridade
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "24px",
                }}
              >
                {/* Estado */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Estado do Serviço
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {estadosServicio.map((estado) => (
                      <label
                        key={estado.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "6px",
                          backgroundColor:
                            formData.estado === estado.value
                              ? `${estado.color}20`
                              : "transparent",
                          border: `1px solid ${formData.estado === estado.value ? estado.color : "rgba(255, 255, 255, 0.1)"}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="estado"
                          value={estado.value}
                          checked={formData.estado === estado.value}
                          onChange={handleInputChange}
                          style={{
                            accentColor: estado.color,
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color:
                              formData.estado === estado.value
                                ? estado.color
                                : "var(--body-color)",
                            fontWeight:
                              formData.estado === estado.value ? "600" : "400",
                          }}
                        >
                          {estado.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Prioridade */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: "var(--body-color)",
                      marginBottom: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Prioridade
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {prioridadOptions.map((prioridad) => (
                      <label
                        key={prioridad.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "6px",
                          backgroundColor:
                            formData.prioridad === prioridad.value
                              ? `${prioridad.color}20`
                              : "transparent",
                          border: `1px solid ${formData.prioridad === prioridad.value ? prioridad.color : "rgba(255, 255, 255, 0.1)"}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="prioridad"
                          value={prioridad.value}
                          checked={formData.prioridad === prioridad.value}
                          onChange={handleInputChange}
                          style={{
                            accentColor: prioridad.color,
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color:
                              formData.prioridad === prioridad.value
                                ? prioridad.color
                                : "var(--body-color)",
                            fontWeight:
                              formData.prioridad === prioridad.value
                                ? "600"
                                : "400",
                          }}
                        >
                          {prioridad.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "var(--body-color)",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Observações Adicionais (Opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "var(--heading-color)",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder="Observações, peças necessárias, instruções especiais..."
              />
            </div>

            {/* Resumo do Orçamento */}
            {formData.costo &&
              formData.tempoEstimado &&
              selectedTipoServicio && (
                <div
                  style={{
                    marginBottom: "32px",
                    padding: "20px",
                    background:
                      "linear-gradient(135deg, rgba(16, 16, 16, 0.95) 0%, rgba(24, 24, 24, 0.98) 100%)",
                    border: "1px solid rgba(255, 61, 36, 0.3)",
                    borderRadius: "12px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "16px",
                      color: "var(--heading-color)",
                      marginBottom: "16px",
                      fontFamily: "var(--heading-font-family)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {selectedTipoServicio.icon} Resumo do Orçamento
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "var(--primary-color)",
                          marginBottom: "4px",
                        }}
                      >
                        €{parseFloat(formData.costo || 0).toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--body-color)",
                          opacity: 0.8,
                        }}
                      >
                        Valor Total
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#3b82f6",
                          marginBottom: "4px",
                        }}
                      >
                        {formData.tempoEstimado}h
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--body-color)",
                          opacity: 0.8,
                        }}
                      >
                        Duração Estimada
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: selectedPrioridad?.color,
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedPrioridad?.label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--body-color)",
                          opacity: 0.8,
                        }}
                      >
                        Prioridade
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: selectedEstado?.color,
                          marginBottom: "4px",
                        }}
                      >
                        {selectedEstado?.label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--body-color)",
                          opacity: 0.8,
                        }}
                      >
                        Status
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Botões */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "flex-end",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Link
                to="/dashboard/servicios"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "var(--body-color)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 32px",
                  background: loading
                    ? "rgba(255, 61, 36, 0.5)"
                    : "linear-gradient(135deg, var(--primary-color) 0%, #d63519 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="loading-skeleton"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                    />
                    Criando Serviço...
                  </>
                ) : (
                  <>{selectedTipoServicio?.icon || "🔧"} Criar Serviço</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NovoServicoPage;
