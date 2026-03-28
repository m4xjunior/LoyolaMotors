import { useState, useEffect } from "react";
import { CtaBtn } from "../Botao/Botao";
import { servicioConfiguracion } from "../../servicios/servicioConfiguracion";

const CONFIG_POR_DEFECTO = {
  telefono: '+34 640 16 29 47',
  ctaTitulo: '¡Oferta limitada!',
  ctaDescripcion: "Sólo 15 plazas disponibles este mes para el paquete 'Transformación completa' (pintura total + revisión + garantía 1 año). Precio: €1.400 (normal €1.650) – ahorra 15%.",
};

const Cta = () => {
  const [config, setConfig] = useState(CONFIG_POR_DEFECTO);

  useEffect(() => {
    servicioConfiguracion.obtener().then(setConfig);
  }, []);

  const title = config.ctaTitulo || CONFIG_POR_DEFECTO.ctaTitulo;
  const description = config.ctaDescripcion || CONFIG_POR_DEFECTO.ctaDescripcion;
  const telefono = config.telefono || CONFIG_POR_DEFECTO.telefono;
  const telefonoHref = `tel:${telefono.replace(/\s/g, '')}`;

  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="cta" data-aos="fade-right">
        <span className="border-pr"></span>
        <span className="border-wh"></span>
        <div className="cta-info">
          <h2 className="cta-title" data-aos="fade-left" data-aos-delay="100">
            {title}
          </h2>
          <p className="cta-desp">{description}</p>
          <CtaBtn to={telefonoHref}>
            Reserva tu plaza ahora – Llama {telefono}
          </CtaBtn>
        </div>
      </div>
    </div>
  );
};

export default Cta;
