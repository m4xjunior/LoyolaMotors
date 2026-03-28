// Vehicle and Client Constants - LoyolaMotors

export const CUSTOMER_TYPES = [
  { value: "todos", label: "Todos os Tipos" },
  { value: "Regular", label: "Regular", color: "#6b7280" },
  { value: "VIP", label: "VIP", color: "#f59e0b" },
  { value: "Empresarial", label: "Empresarial", color: "#3b82f6" },
  { value: "Premium", label: "Premium", color: "#8b5cf6" },
];

export const VEHICLE_BRANDS = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Toyota",
  "Honda",
  "Ford",
  "Renault",
  "Peugeot",
  "Citroën",
  "Opel",
  "Seat",
  "Skoda",
  "Hyundai",
  "Kia",
  "Nissan",
  "Mazda",
  "Volvo",
  "Fiat",
  "Alfa Romeo",
  "Chevrolet",
  "Dacia",
  "Lexus",
  "Infiniti",
  "Mitsubishi",
  "Subaru",
  "Suzuki",
  "Land Rover",
  "Jaguar",
  "Mini",
  "Smart",
  "Tesla",
];

export const FUEL_TYPES = [
  { value: "Gasolina", label: "Gasolina", icon: "⛽", color: "#ef4444" },
  { value: "Diesel", label: "Diesel", icon: "🛢️", color: "#f59e0b" },
  { value: "Híbrido", label: "Híbrido", icon: "⚡", color: "#3b82f6" },
  { value: "Elétrico", label: "Elétrico", icon: "🔋", color: "#22c55e" },
  { value: "GLP", label: "GLP", icon: "💨", color: "#8b5cf6" },
  { value: "GNC", label: "GNC", icon: "💨", color: "#6b7280" },
];

export const VEHICLE_STATUS = [
  { value: "todos", label: "Todos os Status" },
  { value: "activo", label: "Ativos" },
  { value: "inactivo", label: "Inativos" },
  { value: "mantenimiento", label: "Em Manutenção" },
];

export const SERVICE_STATUS = [
  { value: "pendiente", label: "Pendente", color: "#f59e0b" },
  { value: "en_proceso", label: "Em Processo", color: "#3b82f6" },
  { value: "completado", label: "Completado", color: "#22c55e" },
  { value: "cancelado", label: "Cancelado", color: "#ef4444" },
];

export const SORT_OPTIONS_VEHICLES = [
  { value: "marca", label: "Marca" },
  { value: "modelo", label: "Modelo" },
  { value: "año", label: "Ano" },
  { value: "matricula", label: "Matrícula" },
  { value: "kilometraje", label: "Quilometragem" },
  { value: "cliente", label: "Cliente" },
];

export const SORT_OPTIONS_CLIENTS = [
  { value: "nombre", label: "Nome" },
  { value: "apellidos", label: "Sobrenome" },
  { value: "email", label: "Email" },
  { value: "telefone", label: "Telefone" },
  { value: "ciudad", label: "Cidade" },
  { value: "tipo", label: "Tipo" },
  { value: "fechaRegistro", label: "Data de Registro" },
];

export const VEHICLE_COLORS = [
  "Branco",
  "Preto",
  "Cinza",
  "Prata",
  "Azul",
  "Vermelho",
  "Verde",
  "Amarelo",
  "Laranja",
  "Roxo",
  "Rosa",
  "Marrom",
  "Bege",
  "Dourado",
  "Bronze",
];

export const PAGINATION_OPTIONS = [
  { value: 6, label: "6 por página" },
  { value: 12, label: "12 por página" },
  { value: 24, label: "24 por página" },
  { value: 48, label: "48 por página" },
];

export const VIEW_MODES = [
  { value: "cards", label: "Cards", icon: "📋" },
  { value: "table", label: "Tabela", icon: "📊" },
  { value: "list", label: "Lista", icon: "📄" },
];

// Helper functions for constants
export const getCombustibleColor = (combustible) => {
  const fuelType = FUEL_TYPES.find(type => type.value === combustible);
  return fuelType ? fuelType.color : "#6b7280";
};

export const getCombustibleIcon = (combustible) => {
  const fuelType = FUEL_TYPES.find(type => type.value === combustible);
  return fuelType ? fuelType.icon : "⛽";
};

export const getCustomerTypeColor = (type) => {
  const customerType = CUSTOMER_TYPES.find(t => t.value === type);
  return customerType ? customerType.color : "#6b7280";
};

export const getServiceStatusColor = (status) => {
  const serviceStatus = SERVICE_STATUS.find(s => s.value === status);
  return serviceStatus ? serviceStatus.color : "#6b7280";
};
