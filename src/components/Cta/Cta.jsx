import React from "react";
import { Link } from "react-router-dom";
import { CtaBtn } from "../Button/Button";

const ctaData = {
  title: "¡Oferta limitada!",
  description:
    "Sólo 15 plazas disponibles este mes para el paquete 'Transformación completa' (pintura total + revisión + garantía 1 año). Precio: €1.400 (normal €1.650) – ahorra 15%.",
};

const Cta = () => {
  const { title, description } = ctaData;

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
          <CtaBtn to="tel:+34640162947">Reserva tu plaza ahora – Llama +34 640 16 29 47</CtaBtn>
        </div>
      </div>
    </div>
  );
};

export default Cta;
