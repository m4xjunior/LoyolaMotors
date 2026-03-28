const CLAVE_ALMACEN = 'loyola_repuestos';

const obtenerAlmacen = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE_ALMACEN) || '[]'); }
  catch { return []; }
};

const guardarAlmacen = (datos) => {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(datos));
};

export const servicioRepuestos = {
  obtenerTodos: async (filtros = {}) => {
    let datos = obtenerAlmacen();
    if (filtros.termino) {
      const t = filtros.termino.toLowerCase();
      datos = datos.filter(d => ['nombre', 'codigo', 'categoria'].some(f => d[f]?.toLowerCase().includes(t)));
    }
    return datos;
  },
  obtenerPorId: async (id) => {
    return obtenerAlmacen().find(d => d.id === id) || null;
  },
  crear: async (datos) => {
    const todos = obtenerAlmacen();
    const nuevo = { ...datos, id: crypto.randomUUID(), creadoEn: new Date().toISOString() };
    todos.push(nuevo);
    guardarAlmacen(todos);
    return nuevo;
  },
  actualizar: async (id, datos) => {
    const todos = obtenerAlmacen();
    const i = todos.findIndex(d => d.id === id);
    if (i === -1) throw new Error('No encontrado');
    todos[i] = { ...todos[i], ...datos, actualizadoEn: new Date().toISOString() };
    guardarAlmacen(todos);
    return todos[i];
  },
  eliminar: async (id) => {
    const todos = obtenerAlmacen();
    guardarAlmacen(todos.filter(d => d.id !== id));
    return true;
  },
  buscar: async (termino) => {
    return servicioRepuestos.obtenerTodos({ termino });
  },
  contarTodos: async () => {
    return obtenerAlmacen().length;
  },
};
