import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import { vehiculoService, clienteService } from "../data/database";
import "../styles/Dashboard.scss";

const NovoVehiculoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("clienteId");

  const [formData, setFormData] = useState({
    clienteId: clienteId || "",
    marca: "",
    modelo: "",
    matricula: "",
    año: "",
    color: "",
    kilometraje: "",
    combustible: "gasolina",
    potencia: "",
    vin: "",
    ultimaItv: "",
    proximaItv: "",
    notas: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadClientes();
  }, [user, navigate]);

  const loadClientes = () => {
    try {
      const clientesData = clienteService.getAll();
      setClientes(clientesData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteId) {
      newErrors.clienteId = "Selecione um cliente";
    }

    if (!formData.marca.trim()) {
      newErrors.marca = "Marca é obrigatória";
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = "Modelo é obrigatório";
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = "Matrícula é obrigatória";
    }

    if (
      !formData.año ||
      formData.año < 1900 ||
      formData.año > new Date().getFullYear() + 1
    ) {
      newErrors.año = "Ano inválido";
    }

    if (!formData.kilometraje || formData.kilometraje < 0) {
      newErrors.kilometraje = "Quilometragem inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const vehiculoData = {
        ...formData,
        clienteId: formData.clienteId,
        año: parseInt(formData.año),
        kilometraje: parseInt(formData.kilometraje),
        potencia: formData.potencia ? parseInt(formData.potencia) : null,
      };

      vehiculoService.create(vehiculoData);

      setSuccess(true);
      setTimeout(() => {
        if (clienteId) {
          navigate(`/dashboard/clientes/${clienteId}`);
        } else {
          navigate("/dashboard/vehiculos");
        }
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
      setErrors({ submit: "Erro ao criar veículo. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const combustiveis = [
    { value: "gasolina", label: "Gasolina" },
    { value: "diesel", label: "Diesel" },
    { value: "hibrido", label: "Híbrido" },
    { value: "eletrico", label: "Elétrico" },
    { value: "gnv", label: "GNV" },
    { value: "flex", label: "Flex" },
  ];

  return (
    <>
      <CommonPageHero
        title={clienteId ? "Adicionar Veículo" : "Novo Veículo"}
      />

      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                {clienteId ? "Adicionar Veículo" : "Novo Veículo"}
              </h1>
              <p className="dashboard-subtitle">
                {clienteId
                  ? "Adicione um novo veículo para este cliente"
                  : "Cadastre um novo veículo no sistema"}
              </p>
            </div>
            <div className="dashboard-actions">
              <Link
                to={
                  clienteId
                    ? `/dashboard/clientes/${clienteId}`
                    : "/dashboard/vehiculos"
                }
                className="logout-btn"
              >
                ← Voltar
              </Link>
            </div>
          </div>

          <div className="dashboard-panel">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Cliente (se não veio por parâmetro) */}
                {!clienteId && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cliente *</label>
                    <select
                      name="clienteId"
                      value={formData.clienteId}
                      onChange={handleChange}
                      className={`form-control ${errors.clienteId ? "error" : ""}`}
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellidos}
                        </option>
                      ))}
                    </select>
                    {errors.clienteId && (
                      <div className="error-text">{errors.clienteId}</div>
                    )}
                  </div>
                )}

                {/* Marca e Modelo */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className={`form-control ${errors.marca ? "error" : ""}`}
                    placeholder="Ex: Toyota, Volkswagen, Ford..."
                  />
                  {errors.marca && (
                    <div className="error-text">{errors.marca}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Modelo *</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className={`form-control ${errors.modelo ? "error" : ""}`}
                    placeholder="Ex: Corolla, Golf, Fiesta..."
                  />
                  {errors.modelo && (
                    <div className="error-text">{errors.modelo}</div>
                  )}
                </div>

                {/* Matrícula e Ano */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Matrícula *</label>
                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    className={`form-control ${errors.matricula ? "error" : ""}`}
                    placeholder="Ex: AB-12-CD"
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.matricula && (
                    <div className="error-text">{errors.matricula}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Ano *</label>
                  <input
                    type="number"
                    name="año"
                    value={formData.año}
                    onChange={handleChange}
                    className={`form-control ${errors.año ? "error" : ""}`}
                    placeholder="Ex: 2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.año && <div className="error-text">{errors.año}</div>}
                </div>

                {/* Cor e Combustível */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cor</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ex: Preto, Branco, Azul..."
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Combustível</label>
                  <select
                    name="combustible"
                    value={formData.combustible}
                    onChange={handleChange}
                    className="form-control"
                  >
                    {combustiveis.map((comb) => (
                      <option key={comb.value} value={comb.value}>
                        {comb.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quilometragem e Potência */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Quilometragem *</label>
                  <input
                    type="number"
                    name="kilometraje"
                    value={formData.kilometraje}
                    onChange={handleChange}
                    className={`form-control ${errors.kilometraje ? "error" : ""}`}
                    placeholder="Ex: 50000"
                    min="0"
                  />
                  {errors.kilometraje && (
                    <div className="error-text">{errors.kilometraje}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Potência (CV)</label>
                  <input
                    type="number"
                    name="potencia"
                    value={formData.potencia}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ex: 150"
                    min="0"
                  />
                </div>

                {/* VIN e ITV */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Número de Chassi (VIN)</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ex: 1HGCM82633A123456"
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Última ITV</label>
                  <input
                    type="date"
                    name="ultimaItv"
                    value={formData.ultimaItv}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Próxima ITV</label>
                  <input
                    type="date"
                    name="proximaItv"
                    value={formData.proximaItv}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Notas */}
                <div className="col-12 mb-3">
                  <label className="form-label">Observações</label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Informações adicionais sobre o veículo..."
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="error-message" style={{ marginBottom: "20px" }}>
                  {errors.submit}
                </div>
              )}

              {success && (
                <div
                  className="success-message"
                  style={{ marginBottom: "20px" }}
                >
                  ✅ Veículo criado com sucesso! Redirecionando...
                </div>
              )}

              <div className="d-flex gap-3 mt-4">
                <button
                  type="submit"
                  className="primary-action-btn"
                  disabled={loading}
                >
                  {loading ? "⏳ Criando..." : "✅ Criar Veículo"}
                </button>
                <Link
                  to={
                    clienteId
                      ? `/dashboard/clientes/${clienteId}`
                      : "/dashboard/vehiculos"
                  }
                  className="logout-btn"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NovoVehiculoPage;
