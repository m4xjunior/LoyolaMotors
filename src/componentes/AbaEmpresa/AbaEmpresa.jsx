import { useState } from "react";

const tabContents = [
  {
    title: "Misión",
    description:
      "Ofrecer chapa, pintura y mecánica con calidad de taller oficial, precios transparentes y entrega rápida en Valencia.",
  },
  {
    title: "Visión",
    description:
      "Ser el taller de referencia en Valencia por confianza, garantía de hasta 1 año y atención en menos de 2 horas.",
  },
  {
    title: "Historia",
    description:
      "Más de 20 años cuidando los coches de familias y empresas, con más de 900 reseñas 5 estrellas.",
  },
];

const CompanyTab = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="company-tab">
        <ul className="tabs">
          {tabContents?.map((tab, index) => (
            <li
              key={index}
              className={activeTab === index ? "active-tab" : ""}
              onClick={() => handleTabClick(index)}
            >
              {tab.title}
            </li>
          ))}
        </ul>

        <div className="tabs-content">
          <div className="list">
            <div className="ak-section-heading ak-style-1 ak-type-1">
              <div className="background-text">Sobre la empresa</div>
              <h3 className="desp">{tabContents[activeTab].description}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTab;
