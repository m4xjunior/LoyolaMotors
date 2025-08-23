// Sistema de Banco de Dados Simulado - LoyolaMotors
// Simula um banco de dados real com funcionalidades CRUD e eventos em tempo real

class LoyolaMotorsDatabase {
  constructor() {
    this.tables = {
      clientes: "loyola_clientes",
      vehiculos: "loyola_vehiculos",
      servicios: "loyola_servicios",
      usuarios: "loyola_usuarios",
      actividades: "loyola_actividades",
      configuraciones: "loyola_configuraciones",
      metricas: "loyola_metricas",
    };

    this.eventListeners = new Map();
    this.init();
  }

  // Inicializar base de datos
  init() {
    this.createTablesIfNotExist();
    this.seedInitialData();
    this.startRealTimeUpdates();
  }

  // Crear tablas si no existen
  createTablesIfNotExist() {
    Object.values(this.tables).forEach((table) => {
      if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify([]));
      }
    });

    // Inicializar configuraciones del sistema
    if (!localStorage.getItem(this.tables.configuraciones)) {
      const defaultConfig = {
        sistema: {
          version: "1.0.0",
          uptime: 98.5,
          ultimaActualizacion: new Date().toISOString(),
        },
        notificaciones: {
          activadas: true,
          tiempo_real: true,
        },
        metricas: {
          actualizacion_intervalo: 30000, // 30 segundos
        },
      };
      localStorage.setItem(
        this.tables.configuraciones,
        JSON.stringify(defaultConfig),
      );
    }
  }

  // Poblar datos iniciales
  seedInitialData() {
    // Verificar si ya hay datos
    const clientes = this.getAll("clientes");
    if (clientes.length === 0) {
      this.seedClientes();
      this.seedVehiculos();
      this.seedServicios();
      this.seedUsuarios();
      this.seedActividades();
      this.seedMetricas();
    }
  }

  // CRUD Operations
  create(table, data) {
    const tableData = this.getAll(table);
    const newRecord = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tableData.push(newRecord);
    localStorage.setItem(this.tables[table], JSON.stringify(tableData));

    // Emitir evento
    this.emitEvent(`${table}_created`, newRecord);
    this.addActivity(
      `${table}_created`,
      `Nuevo ${table} creado: ${newRecord.nombre || newRecord.tipo || newRecord.id}`,
    );

    return newRecord;
  }

  read(table, id) {
    const tableData = this.getAll(table);
    return tableData.find((record) => record.id === id);
  }

  update(table, id, updates) {
    const tableData = this.getAll(table);
    const index = tableData.findIndex((record) => record.id === id);

    if (index !== -1) {
      tableData[index] = {
        ...tableData[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.tables[table], JSON.stringify(tableData));
      this.emitEvent(`${table}_updated`, tableData[index]);
      this.addActivity(
        `${table}_updated`,
        `${table} actualizado: ${tableData[index].nombre || tableData[index].tipo || id}`,
      );

      return tableData[index];
    }
    return null;
  }

  delete(table, id) {
    const tableData = this.getAll(table);
    const index = tableData.findIndex((record) => record.id === id);

    if (index !== -1) {
      const deletedRecord = tableData[index];
      tableData.splice(index, 1);
      localStorage.setItem(this.tables[table], JSON.stringify(tableData));

      this.emitEvent(`${table}_deleted`, deletedRecord);
      this.addActivity(
        `${table}_deleted`,
        `${table} eliminado: ${deletedRecord.nombre || deletedRecord.tipo || id}`,
      );

      return deletedRecord;
    }
    return null;
  }

  getAll(table) {
    const data = localStorage.getItem(this.tables[table]);
    return data ? JSON.parse(data) : [];
  }

  // Consultas avanzadas
  query(table, conditions = {}) {
    const data = this.getAll(table);
    return data.filter((record) => {
      return Object.entries(conditions).every(([key, value]) => {
        if (typeof value === "function") {
          return value(record[key]);
        }
        return record[key] === value;
      });
    });
  }

  // Sistema de eventos en tiempo real
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emitEvent(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((callback) => {
        callback(data);
      });
    }

    // Emitir evento global
    if (this.eventListeners.has("*")) {
      this.eventListeners.get("*").forEach((callback) => {
        callback({ event, data });
      });
    }
  }

  // Sistema de actividades en tiempo real
  addActivity(type, description, metadata = {}) {
    const activity = {
      id: this.generateId(),
      type,
      description,
      metadata,
      timestamp: new Date().toISOString(),
      usuario: this.getCurrentUser()?.nombre || "Sistema",
    };

    const activities = this.getAll("actividades");
    activities.unshift(activity); // Agregar al inicio

    // Mantener solo las últimas 100 actividades
    if (activities.length > 100) {
      activities.splice(100);
    }

    localStorage.setItem(this.tables.actividades, JSON.stringify(activities));
    this.emitEvent("activity_added", activity);

    return activity;
  }

  getRecentActivities(limit = 10) {
    return this.getAll("actividades").slice(0, limit);
  }

  // Métricas y estadísticas
  getMetricas() {
    const clientes = this.getAll("clientes");
    const vehiculos = this.getAll("vehiculos");
    const servicios = this.getAll("servicios");

    const clientesActivos = clientes.filter((c) => c.activo).length;
    const vehiculosActivos = vehiculos.filter((v) => v.activo).length;
    const serviciosPendientes = servicios.filter(
      (s) => s.estado === "pendiente" || s.estado === "en_proceso",
    ).length;
    const serviciosCompletados = servicios.filter(
      (s) => s.estado === "completado",
    ).length;

    // Calcular ingresos del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const ingresosMes = servicios
      .filter((s) => {
        const serviceDate = new Date(s.fecha);
        return (
          s.estado === "completado" &&
          serviceDate.getMonth() === currentMonth &&
          serviceDate.getFullYear() === currentYear
        );
      })
      .reduce((total, s) => total + (s.costo || 0), 0);

    // Calcular métricas avanzadas
    const totalClientes = clientes.length;
    const receitaTotal = servicios
      .filter((s) => s.estado === "completado")
      .reduce((total, s) => total + (s.costo || 0), 0);

    const receitaMediaPorCliente =
      totalClientes > 0 ? receitaTotal / totalClientes : 0;

    // Calcular satisfação (simulada baseada em serviços completados)
    const satisfacao =
      servicios.length > 0
        ? (serviciosCompletados / servicios.length) * 100
        : 0;

    // Calcular tempo médio de serviço
    const servicosComTempo = servicios.filter((s) => s.tempoServico);
    const tempoMedio =
      servicosComTempo.length > 0
        ? servicosComTempo.reduce((acc, s) => acc + s.tempoServico, 0) /
          servicosComTempo.length
        : 24;

    return {
      totalClientes: clientesActivos,
      totalVehiculos: vehiculosActivos,
      serviciosPendientes,
      serviciosCompletados,
      ingresosMes,
      receitaMediaPorCliente,
      satisfacao,
      tempoMedioServico: tempoMedio,
      uptimeSystem: 98.5,
      avaliacaoMedia: 4.8,
    };
  }

  // Datos para gráficos
  getChartData() {
    const servicios = this.getAll("servicios");
    const currentYear = new Date().getFullYear();

    // Servicios por mes (últimos 6 meses)
    const mesesData = [];
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date().getMonth() - i;
      const mes = targetMonth >= 0 ? targetMonth : 12 + targetMonth;
      const ano = targetMonth >= 0 ? currentYear : currentYear - 1;

      const servicosDoMes = servicios.filter((s) => {
        const serviceDate = new Date(s.fecha);
        return (
          serviceDate.getMonth() === mes && serviceDate.getFullYear() === ano
        );
      }).length;

      mesesData.push({
        label: meses[mes],
        value: servicosDoMes,
      });
    }

    return { monthlyServices: mesesData };
  }

  // Utilidades
  generateId() {
    return "id_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  }

  getCurrentUser() {
    const currentUserStr = localStorage.getItem("loyola_current_user");
    return currentUserStr ? JSON.parse(currentUserStr) : null;
  }

  // Actualizaciones en tiempo real
  startRealTimeUpdates() {
    setInterval(() => {
      this.updateSystemMetrics();
    }, 30000); // Actualizar cada 30 segundos
  }

  updateSystemMetrics() {
    const metricas = this.getMetricas();

    // Simular pequeñas variaciones en las métricas
    const configStr = localStorage.getItem(this.tables.configuraciones);
    if (configStr) {
      const config = JSON.parse(configStr);
      if (config && config.sistema) {
        config.sistema.uptime = Math.min(
          99.9,
          Math.max(95.0, config.sistema.uptime + (Math.random() - 0.5) * 0.1),
        );
        config.sistema.ultimaActualizacion = new Date().toISOString();
        localStorage.setItem(
          this.tables.configuraciones,
          JSON.stringify(config),
        );
      }
    }

    // Emitir evento de actualización de métricas
    this.emitEvent("metrics_updated", metricas);
  }

  // Poblar datos iniciales
  seedClientes() {
    const clientes = [
      {
        nombre: "João",
        apellidos: "Silva Santos",
        email: "joao.silva@email.com",
        telefono: "+351 912 345 678",
        direccion: "Rua das Flores, 123",
        ciudad: "Lisboa",
        codigoPostal: "1000-001",
        tipo: "VIP",
        descuento: 15,
        activo: true,
        fechaRegistro: new Date("2024-01-15").toISOString(),
      },
      {
        nombre: "Maria",
        apellidos: "Costa Ferreira",
        email: "maria.costa@email.com",
        telefono: "+351 923 456 789",
        direccion: "Avenida da República, 456",
        ciudad: "Porto",
        codigoPostal: "4000-001",
        tipo: "Regular",
        descuento: 5,
        activo: true,
        fechaRegistro: new Date("2024-01-20").toISOString(),
      },
      {
        nombre: "António",
        apellidos: "Oliveira Lima",
        email: "antonio.oliveira@email.com",
        telefono: "+351 934 567 890",
        direccion: "Praça do Comércio, 789",
        ciudad: "Coimbra",
        codigoPostal: "3000-001",
        tipo: "Empresarial",
        descuento: 20,
        activo: true,
        fechaRegistro: new Date("2024-01-25").toISOString(),
      },
      {
        nombre: "Ana",
        apellidos: "Rodrigues Pereira",
        email: "ana.rodrigues@email.com",
        telefono: "+351 945 678 901",
        direccion: "Rua Augusta, 321",
        ciudad: "Lisboa",
        codigoPostal: "1100-001",
        tipo: "VIP",
        descuento: 15,
        activo: true,
        fechaRegistro: new Date("2024-02-01").toISOString(),
      },
    ];

    clientes.forEach((cliente) => {
      this.create("clientes", cliente);
    });
  }

  seedVehiculos() {
    const vehiculos = [
      {
        clienteId: null, // Se asignará después
        marca: "BMW",
        modelo: "X3",
        año: 2022,
        matricula: "12-AB-34",
        combustible: "Gasolina",
        kilometraje: 25000,
        color: "Preto",
        activo: true,
      },
      {
        clienteId: null,
        marca: "Mercedes-Benz",
        modelo: "C200",
        año: 2021,
        matricula: "56-CD-78",
        combustible: "Diesel",
        kilometraje: 35000,
        color: "Prata",
        activo: true,
      },
      {
        clienteId: null,
        marca: "Audi",
        modelo: "A4",
        año: 2023,
        matricula: "90-EF-12",
        combustible: "Híbrido",
        kilometraje: 15000,
        color: "Branco",
        activo: true,
      },
    ];

    const clientes = this.getAll("clientes");
    vehiculos.forEach((vehiculo, index) => {
      if (clientes[index]) {
        vehiculo.clienteId = clientes[index].id;
      }
      this.create("vehiculos", vehiculo);
    });
  }

  seedServicios() {
    const servicios = [
      {
        clienteId: null,
        vehiculoId: null,
        tipo: "Manutenção Preventiva",
        descripcion: "Troca de óleo e filtros",
        estado: "completado",
        fecha: new Date("2024-01-10").toISOString(),
        costo: 150.0,
        tempoServico: 2,
      },
      {
        clienteId: null,
        vehiculoId: null,
        tipo: "Reparación de Frenos",
        descripcion: "Substituição de pastilhas de freio",
        estado: "en_proceso",
        fecha: new Date("2024-01-15").toISOString(),
        costo: 280.0,
        tempoServico: 4,
      },
      {
        clienteId: null,
        vehiculoId: null,
        tipo: "Revisión General",
        descripcion: "Inspeção completa do veículo",
        estado: "pendiente",
        fecha: new Date("2024-01-20").toISOString(),
        costo: 120.0,
        tempoServico: 3,
      },
    ];

    const clientes = this.getAll("clientes");
    const vehiculos = this.getAll("vehiculos");

    servicios.forEach((servicio, index) => {
      if (clientes[index]) servicio.clienteId = clientes[index].id;
      if (vehiculos[index]) servicio.vehiculoId = vehiculos[index].id;
      this.create("servicios", servicio);
    });
  }

  seedUsuarios() {
    const usuarios = [
      {
        nombre: "Admin",
        apellidos: "Sistema",
        email: "admin@loyolamotors.com",
        rol: "admin",
        activo: true,
        ultimoLogin: new Date().toISOString(),
      },
      {
        nombre: "Técnico",
        apellidos: "Principal",
        email: "tecnico@loyolamotors.com",
        rol: "tecnico",
        activo: true,
        ultimoLogin: new Date().toISOString(),
      },
    ];

    usuarios.forEach((usuario) => {
      this.create("usuarios", usuario);
    });
  }

  seedActividades() {
    const actividades = [
      {
        type: "cliente_created",
        description: "Novo cliente cadastrado: João Silva Santos",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        usuario: "Admin Sistema",
      },
      {
        type: "servico_completed",
        description: "Manutenção preventiva finalizada para BMW X3",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        usuario: "Técnico Principal",
      },
      {
        type: "payment_received",
        description: "€450 recebidos de João Santos - Serviço #1234",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        usuario: "Sistema",
      },
      {
        type: "appointment_created",
        description: "Novo agendamento para revisão de freios - Mercedes C200",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        usuario: "Admin Sistema",
      },
    ];

    localStorage.setItem(this.tables.actividades, JSON.stringify(actividades));
  }

  seedMetricas() {
    const metricas = {
      ultimaActualizacion: new Date().toISOString(),
      periodo: "mensal",
      datos: this.getMetricas(),
    };

    localStorage.setItem(this.tables.metricas, JSON.stringify(metricas));
  }

  // Backup e Restore
  exportData() {
    const data = {};
    Object.entries(this.tables).forEach(([key]) => {
      data[key] = this.getAll(key);
    });
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, records]) => {
        if (this.tables[key]) {
          localStorage.setItem(this.tables[key], JSON.stringify(records));
        }
      });
      this.emitEvent("data_imported", data);
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Limpeza de dados
  clearAllData() {
    Object.values(this.tables).forEach((table) => {
      localStorage.removeItem(table);
    });
    this.init();
  }
}

// Singleton instance
const db = new LoyolaMotorsDatabase();

// Export para uso em toda a aplicação
export default db;

// Export das funcionalidades principais
// Export das funcionalidades principais (com bind para garantir o contexto 'this')
export const create = db.create.bind(db);
export const read = db.read.bind(db);
export const update = db.update.bind(db);
export const deleteRecord = db.delete.bind(db);
export const getAll = db.getAll.bind(db);
export const query = db.query.bind(db);
export const on = db.on.bind(db);
export const off = db.off.bind(db);
export const getMetricas = db.getMetricas.bind(db);
export const getChartData = db.getChartData.bind(db);
export const getRecentActivities = db.getRecentActivities.bind(db);
export const addActivity = db.addActivity.bind(db);

// Helpers específicos
export const clienteService = {
  create: (data) => db.create("clientes", data),
  getAll: () => db.getAll("clientes"),
  update: (id, data) => db.update("clientes", id, data),
  delete: (id) => db.delete("clientes", id),
  getByEmail: (email) => db.query("clientes", { email }),
  getActive: () => db.query("clientes", { activo: true }),
};

export const vehiculoService = {
  create: (data) => db.create("vehiculos", data),
  getAll: () => db.getAll("vehiculos"),
  update: (id, data) => db.update("vehiculos", id, data),
  delete: (id) => db.delete("vehiculos", id),
  getByCliente: (clienteId) => db.query("vehiculos", { clienteId }),
  getActive: () => db.query("vehiculos", { activo: true }),
};

export const servicioService = {
  create: (data) => db.create("servicios", data),
  getAll: () => db.getAll("servicios"),
  update: (id, data) => db.update("servicios", id, data),
  delete: (id) => db.delete("servicios", id),
  getByEstado: (estado) => db.query("servicios", { estado }),
  getByCliente: (clienteId) => db.query("servicios", { clienteId }),
};

export const usuarioService = {
  create: (data) => db.create("usuarios", data),
  getAll: () => db.getAll("usuarios"),
  update: (id, data) => db.update("usuarios", id, data),
  delete: (id) => db.delete("usuarios", id),
  getByRole: (rol) => db.query("usuarios", { rol }),
  getActive: () => db.query("usuarios", { activo: true }),
};
