import React from "react";
import { Link } from "react-router-dom";

import { MoreBtn } from "../Button/Button";
import SectionHeading from "../SectionHeading/SectionHeading";

const speciaList = [
  {
    id: 1,
    img: "/assets/img/service/service_1.jpg",
    title: "Reparación de Chapa y Pintura",
    desp: "Servicio experto en reparación de chapa y pintura. Devolvemos a tu coche su aspecto original con materiales de primera calidad y garantía de 1 año.",
  },
  {
    id: 2,
    img: "/assets/img/service/service_2.jpg",
    title: "Pintura de Llantas",
    desp: "Renueva el aspecto de tus llantas con un acabado profesional y duradero. Ofrecemos una amplia gama de colores y acabados para personalizar tu coche.",
  },
  {
    id: 3,
    img: "/assets/img/service/service_3.jpg",
    title: "Preparación para ITV",
    desp: "Preparamos tu vehículo para pasar la ITV sin problemas. Revisión completa de puntos clave y gestión de la cita por ti.",
  },
];

const SpecialistTeamMembers = ({ team }) => {
  console.log(team);

  return (
    <>
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="d-flex justify-content-center">
        <div className="sticky-content container">
          <div className="content style_2">
            <div className="service">
              {speciaList.map((item) => (
                <div
                  className="service-card"
                  data-aos="fade-left"
                  key={item?.id}
                >
                  <Link to={`/service-single/${item?.id}`} className="card-img">
                    <img src={`${item?.img}`} className="ak-bg" alt="..." />
                  </Link>
                  <div className="card-info">
                    <Link
                      to={`/service-single/${item?.id}`}
                      className="card-title"
                    >
                      {item?.title}
                    </Link>
                    <p className="card-desp">{item?.desp}</p>
                    <MoreBtn to={`/service-single/${item?.id}`}>
                      VER MÁS
                    </MoreBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sidebar width-none">
            <div className="services-content">
              <SectionHeading
                bgText={"Servicios"}
                title={team?.name}
                desp={team?.desp}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialistTeamMembers;
