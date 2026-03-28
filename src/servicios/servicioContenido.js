const obtenerClave = (coleccion) => `loyola_contenido_${coleccion}`;

const obtenerAlmacen = (coleccion) => {
  try { return JSON.parse(localStorage.getItem(obtenerClave(coleccion)) || '[]'); }
  catch { return []; }
};

const guardarAlmacen = (coleccion, datos) => {
  localStorage.setItem(obtenerClave(coleccion), JSON.stringify(datos));
};

export const COLECCIONES = [
  'diapositivas', 'servicios', 'blog', 'equipo', 'galeria',
  'testimonios', 'preguntas', 'precios', 'estadisticas',
  'pestanasEmpresa', 'logosClientes', 'ofertasCta',
];

export const servicioContenido = {
  obtener: async (coleccion, filtros = {}) => {
    let datos = obtenerAlmacen(coleccion);
    if (filtros.activo !== undefined) datos = datos.filter(d => d.activo === filtros.activo);
    if (filtros.orden) datos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    return datos;
  },
  obtenerUno: async (coleccion, id) => {
    return obtenerAlmacen(coleccion).find(d => d.id === id) || null;
  },
  guardar: async (coleccion, id, datos) => {
    const todos = obtenerAlmacen(coleccion);
    const i = todos.findIndex(d => d.id === id);
    if (i >= 0) {
      todos[i] = { ...todos[i], ...datos, actualizadoEn: new Date().toISOString() };
    } else {
      todos.push({ ...datos, id: id || crypto.randomUUID(), creadoEn: new Date().toISOString() });
    }
    guardarAlmacen(coleccion, todos);
    return todos.find(d => d.id === (id || datos.id));
  },
  eliminar: async (coleccion, id) => {
    const todos = obtenerAlmacen(coleccion);
    guardarAlmacen(coleccion, todos.filter(d => d.id !== id));
    return true;
  },
  reordenar: async (coleccion, ids) => {
    const todos = obtenerAlmacen(coleccion);
    const reordenados = ids.map((id, i) => {
      const item = todos.find(d => d.id === id);
      return item ? { ...item, orden: i } : null;
    }).filter(Boolean);
    guardarAlmacen(coleccion, reordenados);
    return reordenados;
  },
  contarTodos: async (coleccion) => {
    return obtenerAlmacen(coleccion).length;
  },
};
