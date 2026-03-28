import { useState, useEffect } from "react";
import PricingCard from "./CartaoPreco";
import SectionHeading from "../TituloSecao/TituloSecao";
import { servicioContenido } from "../../servicios/servicioContenido";

// Precios recomendados Loyola (comparados con mercado)
const DATOS_POR_DEFECTO = [
  {
    id: 1,
    nombre: "Retrovisor (unidad)",
    precio: "€35",
    precioMercado: "€40-60 mercado",
    listaCaracteristicas: [
      "Pintura y montaje",
      "Garantía de satisfacción",
      "Entrega rápida",
      "Precio transparente",
    ],
    destacado: false,
    aosDelay: 0,
  },
  {
    id: 2,
    nombre: "Paragolpes (unidad)",
    precio: "€140-150",
    precioMercado: "€160 mercado",
    listaCaracteristicas: [
      "Reparación + pintura",
      "Materiales de calidad",
      "Tiempos express",
      "Garantía escrita",
    ],
    destacado: true,
    aosDelay: 50,
  },
  {
    id: 3,
    nombre: "Pintura completa",
    precio: "€1.400-1.500",
    precioMercado: "€1.650 mercado",
    listaCaracteristicas: [
      "Lijado y preparación",
      "Cabina de pintura",
      "Pulido profesional",
      "Entrega con inspección final",
    ],
    destacado: false,
    aosDelay: 100,
  },
];

const PricingTable = ({ type }) => {
  const [datos, setDatos] = useState(DATOS_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('precios', { orden: true }).then(r => {
      if (r.length > 0) setDatos(r);
    });
  }, []);

  return (
    <>
      {type ? (
        <div className="ak-height-75 ak-height-lg-75"></div>
      ) : (
        <div className="ak-height-160 ak-height-lg-80"></div>
      )}
      <div className="ak-bg pricing-section-bg-img">
        <div className="ak-height-100 ak-height-lg-50"></div>
        <div className="container">
          {type || (
            <>
              <SectionHeading
                type={true}
                bgText="Precios"
                title="Precios"
                desp="Transparencia total y calidad garantizada. Ahorra 10-15% frente al mercado."
              />
              <div className="ak-height-50 ak-height-lg-50"></div>
            </>
          )}

          <div className="pricing">
            {datos.map((data, index) => (
              <PricingCard
                key={data.id || index}
                title={data.nombre}
                discountPrice={data.precio}
                mainPrice={data.precioMercado}
                options={data.listaCaracteristicas || []}
                isActive={data.destacado}
                aosDelay={data.aosDelay || index * 50}
              />
            ))}
          </div>
        </div>
        <div className="ak-height-100 ak-height-lg-80"></div>
      </div>
    </>
  );
};

export default PricingTable;
