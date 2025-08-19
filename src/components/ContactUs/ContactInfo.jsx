import React from "react";
import SectionHeading from "../SectionHeading/SectionHeading";

const contactData = [
  {
    label: "Correo",
    icon: "/assets/img/icon/email.svg",
    info: ["info@loyolamotors.es"],
  },
  {
    label: "Ubicación",
    icon: "/assets/img/icon/location.svg",
    info: [
      "Calle Sant Ignasi de Loiola, 21 - BJ IZ",
      "46008 Valencia, España",
    ],
  },
  {
    label: "Teléfono",
    icon: "/assets/img/icon/phone.svg",
    info: ["963 846 955"],
  },
  {
    label: "Horario",
    icon: "/assets/img/icon/date-icon.svg",
    info: ["Lun - Vie: 9:00 - 18:00"],
  },
];

const ContactInfo = () => {
  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="contact-info">
        <div className="left-info" data-aos="fade-right">
          <div className="content">
            <SectionHeading
              bgText={"Contacto"}
              title={"Contacto"}
              desp={
                "Más de 20 años cuidando de tu vehículo en el corazón de Valencia. Solicita tu presupuesto sin compromiso."
              }
            />
          </div>
        </div>

        <div className="right-info">
          {contactData.map((item, index) => (
            <div className="info-card" key={index} data-aos="fade-left">
              <p>{item.label} :</p>
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <img src={item.icon} alt={item.label} />
                </div>
                <div>
                  {item.info.map((info, idx) => (
                    <p key={idx}>{info}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
