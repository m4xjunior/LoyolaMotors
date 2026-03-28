import { useState, useEffect } from "react";
import Accordion from "../Accordion/Accordion";

import accordionImg from "/assets/img/accordion-side-img.jpg";
import { servicioConfiguracion } from "../../servicios/servicioConfiguracion";

const CONFIG_POR_DEFECTO = {
  title: " Preguntas frecuentes",
  telefono: "+34 640 16 29 47",
  email: "info@loyolamotors.es",
  direccion: "Calle Sant Ignasi de Loiola, 21 - BJ IZ, 46008 Valencia",
  horario: "Lun - Vie: 9:00 - 18:00",
};

const FrequentlyQuestions = () => {
  const [config, setConfig] = useState(CONFIG_POR_DEFECTO);

  useEffect(() => {
    servicioConfiguracion.obtener().then(setConfig);
  }, []);

  const title = " Preguntas frecuentes";
  const phone = config.telefono || CONFIG_POR_DEFECTO.telefono;
  const email = config.email || CONFIG_POR_DEFECTO.email;
  const address = config.direccion || CONFIG_POR_DEFECTO.direccion;
  const workingHours = config.horario || CONFIG_POR_DEFECTO.horario;

  return (
    <div className="container">
      <div className="ak-height-75 ak-height-lg-80"></div>
      <h4
        className="faq-images-title"
        data-aos="fade-left"
        data-aos-delay="700"
      >
        {title}
      </h4>
      <div className="faq-images">
        <div className="faq" data-aos="fade-up" data-aos-delay="750">
          <Accordion />
        </div>
        <div className="images" data-aos="fade-up" data-aos-delay="950">
          <img src={accordionImg} className="img-bg-faq" alt="Accordion Side" />
          <div className="images-info">
            <div className="d-flex align-items-center gap-3">
              <div className="heartbeat-icon">
                <a href={`tel:${phone}`}>
                  <span className="ak-heartbeat-btn">
                    <img src="/assets/img/icon/phone.svg" alt="Phone Icon" />
                  </span>
                </a>
              </div>
              <h3>{phone}</h3>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="heartbeat-icon">
                <a href={`mailto:${email}`}>
                  <span className="ak-heartbeat-btn">
                    <img src="/assets/img/icon/email.svg" alt="Email Icon" />
                  </span>
                </a>
              </div>
              <h3>{email}</h3>
            </div>
            <div className="ak-location">
              <a
                href="#"
                className="d-flex gap-2 location text-hover-animation"
              >
                <img src="/assets/img/icon/location.svg" alt="Location Icon" />
                <span>{address}</span>
              </a>
            </div>
            <div className="ak-date-time">
              <a
                href="#"
                className="date text-hover-animation d-flex align-items-center gap-2"
              >
                <span>
                  <img src="/assets/img/icon/date-icon.svg" alt="Date Icon" />
                </span>
                <span>{workingHours}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyQuestions;
