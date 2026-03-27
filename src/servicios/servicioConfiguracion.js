const CLAVE = 'loyola_configuracion';

const CONFIGURACION_POR_DEFECTO = {
  telefono: '+34 640 16 29 47',
  email: 'info@loyolamotors.es',
  direccion: 'C/ Sant Ignasi de Loiola, 21-BJ IZ, 46008 Valencia, Espana',
  horario: 'Lun - Vie: 9:00 - 18:00',
  redesSociales: { twitter: 'https://www.x.com/', facebook: 'https://www.facebook.com/', linkedin: 'https://www.linkedin.com/', instagram: '' },
  videoYoutube: 'VcaAVWtP48A',
  nombreEmpresa: 'Loyola Motors',
  eslogan: 'Taller de Chapa y Pintura en Valencia',
};

export const servicioConfiguracion = {
  obtener: async () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      return { ...CONFIGURACION_POR_DEFECTO, ...guardado };
    } catch { return { ...CONFIGURACION_POR_DEFECTO }; }
  },
  actualizar: async (datos) => {
    const actual = await servicioConfiguracion.obtener();
    const actualizado = { ...actual, ...datos };
    localStorage.setItem(CLAVE, JSON.stringify(actualizado));
    return actualizado;
  },
};
