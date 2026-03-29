import { useState, useEffect } from "react";
import { servicioContenido } from "../../servicios/servicioContenido";

const DATOS_POR_DEFECTO = [
  {
    id: 1,
    titulo: "Misión",
    contenido:
      "Ofrecer chapa, pintura y mecánica con calidad de taller oficial, precios transparentes y entrega rápida en Valencia.",
  },
  {
    id: 2,
    titulo: "Visión",
    contenido:
      "Ser el taller de referencia en Valencia por confianza, garantía de hasta 1 año y atención en menos de 2 horas.",
  },
  {
    id: 3,
    titulo: "Historia",
    contenido:
      "Más de 20 años cuidando los coches de familias y empresas, con más de 900 reseñas 5 estrellas.",
  },
];

const CompanyTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [datos, setDatos] = useState(DATOS_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('pestanasEmpresa', { orden: true }).then(r => {
      if (r.length > 0) setDatos(r);
    });
  }, []);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="company-tab">
        <ul className="tabs">
          {datos?.map((tab, index) => (
            <li
              key={tab.id || index}
              className={activeTab === index ? "active-tab" : ""}
              onClick={() => handleTabClick(index)}
            >
              {tab.titulo}
            </li>
          ))}
        </ul>

        <div className="tabs-content">
          <div className="list">
            <div className="ak-section-heading ak-style-1 ak-type-1">
              <div className="background-text">Sobre la empresa</div>
              <h3 className="desp">{datos[activeTab]?.contenido}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTab;
