import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { clienteService } from "../data/database";
import "../styles/Dashboard.scss";

const NovoClientePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    tipo: "Regular",
    descuento: 0,
    activo: true,
    notas: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const tiposCliente = [
    { value: "Regular", label: "Cliente Regular", descuento: 5, color: "#10b981" },
    { value: "VIP", label: "Cliente VIP", descuento: 15, color: "#f59e0b" },
    { value: "Empresarial", label: "Cliente Empresarial", descuento: 20, color: "#3b82f6" },
    { value: "Especial", label: "Cliente Especial", descuento: 10, color: "#8b5cf6" }
  ];

  const ciudades = [
    "Lisboa", "Porto", "Coimbra", "Braga", "Aveiro", "Faro",
    "Setúbal", "Évora", "Leiria", "Viseu", "Santarém", "Outra"
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Nome é obrigatório";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Sobrenome é obrigatório";
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = "Sobrenome deve ter pelo menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    } else {
      // Verificar se email já existe
      const existingClient = clienteService.getByEmail(formData.email);
      if (existingClient.length > 0) {
        newErrors.email = "Este email já está cadastrado";
      }
    }

    // Validar telefone
    const phoneRegex = /^\+351\s\d{3}\s\d{3}\s\d{3}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Telefone é obrigatório";
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = "Formato: +351 912 345 678";
    }

    // Validar endereço
    if (!formData.direccion.trim()) {
      newErrors.direccion = "Endereço é obrigatório";
    }

    // Validar cidade
    if (!formData.ciudad) {
      newErrors.ciudad = "Cidade é obrigatória";
    }

    // Validar código postal português
    const postalCodeRegex = /^\d{4}-\d{3}$/;
    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = "Código postal é obrigatório";
    } else if (!postalCodeRegex.test(formData.codigoPostal)) {
      newErrors.codigoPostal = "Formato: 1000-001";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    // Aplicar máscaras
    if (name === "telefono") {
      newValue = formatPhone(value);
    } else if (name === "codigoPostal") {
      newValue = formatPostalCode(value);
    } else if (name === "tipo") {
      const tipoSelected = tiposCliente.find(t => t.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        descuento: tipoSelected ? tipoSelected.descuento : 0
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const formatPhone = (value) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Se começar com 351, adiciona +
    if (numbers.startsWith("351")) {
      const remaining = numbers.substring(3);
      if (remaining.length <= 9) {
        return `+351 ${remaining.substring(0, 3)} ${remaining.substring(3, 6)} ${remaining.substring(6, 9)}`.trim();
      }
    }

    // Se não começar com +351, assume que é um número português
    if (!numbers.startsWith("351") && numbers.length <= 9) {
      return `+351 ${numbers.substring(0, 3)} ${numbers.substring(3, 6)} ${numbers.substring(6, 9)}`.trim();
    }

    return value;
  };

  const formatPostalCode = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 7) {
      return numbers.replace(/(\d{4})(\d{0,3})/, "$1-$2").replace(/-$/, "");
    }
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar cliente
      const novoCliente = clienteService.create({
        ...formData,
        fechaRegistro: new Date().toISOString()
      });

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/dashboard/clientes", {
          state: {
            message: `Cliente ${novoCliente.nombre} ${novoCliente.apellidos} criado com sucesso!`,
            clienteId: novoCliente.id
          }
        });
      }, 2000);

    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      setErrors({ submit: "Erro ao criar cliente. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      tipo: "Regular",
      descuento: 0,
      activo: true,
      notas: ""
    });
    setErrors({});
    setSuccess(false);
  };

  const selectedTipo = tiposCliente.find(t => t.value === formData.tipo);

  if (success) {
    return (
      <>
        <CommonPageHero title="Novo Cliente" />
        <div className="dashboard-container">
          <div className="container">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              textAlign: 'center'
            }}>
              <div className="dashboard-panel" style={{ maxWidth: '500px' }}>
                <div style={{
                  color: '#22c55e',
                  fontSize: '48px',
                  marginBottom: '20px'
                }}>
                  ✓
                </div>
                <h2 style={{
                  color: 'var(--heading-color)',
                  marginBottom: '16px',
                  fontFamily: 'var(--heading-font-family)'
                }}>
                  Cliente Criado com Sucesso!
                </h2>
                <p style={{
                  color: 'var(--body-color)',
                  marginBottom: '24px',
                  opacity: 0.8
                }}>
                  O cliente {formData.nombre} {formData.apellidos} foi cadastrado no sistema.
                  Redirecionando para a lista de clientes...
                </p>
                <div className="loading-skeleton" style={{
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#22c55e'
                }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CommonPageHero title="Cadastrar Novo Cliente" />

      <div className="dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Novo Cliente</h1>
              <p className="dashboard-subtitle">
                Cadastrar um novo cliente no sistema LoyolaMotors
              </p>
            </div>
            <div className="dashboard-actions">
              <Link to="/dashboard/clientes" className="logout-btn">
                ← Voltar à Lista
              </Link>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="dashboard-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="panel-header">
              <h3>Informações do Cliente</h3>
              <button
                type="button"
                onClick={resetForm}
                className="panel-action"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer'
                }}
              >
                Limpar Formulário
              </button>
            </div>

            {errors.submit && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {errors.submit}
              </div>
            )}

            {/* Dados Pessoais */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--heading-color)',
                marginBottom: '20px',
                fontFamily: 'var(--heading-font-family)'
              }}>
                Dados Pessoais
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.nombre ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Digite o nome"
                  />
                  {errors.nombre && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.nombre}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.apellidos ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Digite o sobrenome"
                  />
                  {errors.apellidos && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.apellidos}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contato */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--heading-color)',
                marginBottom: '20px',
                fontFamily: 'var(--heading-font-family)'
              }}>
                Informações de Contato
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="exemplo@email.com"
                  />
                  {errors.email && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.telefono ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="+351 912 345 678"
                  />
                  {errors.telefono && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.telefono}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--heading-color)',
                marginBottom: '20px',
                fontFamily: 'var(--heading-font-family)'
              }}>
                Endereço
              </h4>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: 'var(--body-color)',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${errors.direccion ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '8px',
                    color: 'var(--heading-color)',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease'
                  }}
                  placeholder="Rua, número, complemento"
                />
                {errors.direccion && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {errors.direccion}
                  </span>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Cidade *
                  </label>
                  <select
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.ciudad ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <option value="">Selecione uma cidade</option>
                    {ciudades.map(cidade => (
                      <option key={cidade} value={cidade} style={{ backgroundColor: '#1a1a1a' }}>
                        {cidade}
                      </option>
                    ))}
                  </select>
                  {errors.ciudad && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.ciudad}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--body-color)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${errors.codigoPostal ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: 'var(--heading-color)',
                      fontSize: '14px',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="1000-001"
                  />
                  {errors.codigoPostal && (
                    <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                      {errors.codigoPostal}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tipo de Cliente */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '16px',
                color: 'var(--heading-color)',
                marginBottom: '20px',
                fontFamily: 'var(--heading-font-family)'
              }}>
                Categoria e Benefícios
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {tiposCliente.map(tipo => (
                  <label key={tipo.value} style={{
                    display: 'block',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={formData.tipo === tipo.value}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      padding: '16px',
                      border: `2px solid ${formData.tipo === tipo.value ? tipo.color : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      backgroundColor: formData.tipo === tipo.value ? `${tipo.color}20` : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.tipo === tipo.value ? tipo.color : 'var(--heading-color)',
                        marginBottom: '4px'
                      }}>
                        {tipo.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--body-color)',
                        opacity: 0.8
                      }}>
                        {tipo.descuento}% desconto
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedTipo && (
                <div style={{
                  background: `${selectedTipo.color}20`,
                  border: `1px solid ${selectedTipo.color}40`,
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  color: 'var(--body-color)'
                }}>
                  <strong style={{ color: selectedTipo.color }}>
                    {selectedTipo.label}
                  </strong>
                  : Cliente receberá {selectedTipo.descuento}% de desconto em todos os serviços.
                </div>
              )}
            </div>

            {/* Observações */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: 'var(--body-color)',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Observações (Opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'var(--heading-color)',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Informações adicionais sobre o cliente..."
              />
            </div>

            {/* Status */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'var(--body-color)'
              }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--primary-color)'
                  }}
                />
                Cliente ativo (pode receber serviços)
              </label>
            </div>

            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Link
                to="/dashboard/clientes"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--body-color)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 32px',
                  background: loading
                    ? 'rgba(255, 61, 36, 0.5)'
                    : 'linear-gradient(135deg, var(--primary-color) 0%, #d63519 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <div className="loading-skeleton" style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }} />
                    Criando Cliente...
                  </>
                ) : (
                  <>
                    ✓ Criar Cliente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NovoClientePage;
