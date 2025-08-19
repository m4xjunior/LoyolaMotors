import React from "react";
import Accordion from "../Accordion/Accordion";

import accordionImg from "/assets/img/accordion-side-img.jpg";

const contactDetails = {
  title: " Preguntas frecuentes",
  phone: "963 846 955",
  email: "info@loyolamotors.es",
  address: "Calle Sant Ignasi de Loiola, 21 - BJ IZ, 46008 Valencia",
  workingHours: "Lun - Vie: 9:00 - 18:00",
};

const FrequentlyQuestions = () => {
  const { title, phone, email, address, workingHours } = contactDetails;

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
