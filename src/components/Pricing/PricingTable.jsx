import React from "react";
import PricingCard from "./PricingCard";
import SectionHeading from "../SectionHeading/SectionHeading";

// Precios recomendados Loyola (comparados con mercado)
const pricingData = [
  {
    title: "Retrovisor (unidad)",
    discountPrice: "€35",
    mainPrice: "€40-60 mercado",
    options: [
      "Pintura y montaje",
      "Garantía de satisfacción",
      "Entrega rápida",
      "Precio transparente",
    ],
    isActive: false,
    aosDelay: 0,
  },
  {
    title: "Paragolpes (unidad)",
    discountPrice: "€140-150",
    mainPrice: "€160 mercado",
    options: [
      "Reparación + pintura",
      "Materiales de calidad",
      "Tiempos express",
      "Garantía escrita",
    ],
    isActive: true,
    aosDelay: 50,
  },
  {
    title: "Pintura completa",
    discountPrice: "€1.400-1.500",
    mainPrice: "€1.650 mercado",
    options: [
      "Lijado y preparación",
      "Cabina de pintura",
      "Pulido profesional",
      "Entrega con inspección final",
    ],
    isActive: false,
    aosDelay: 100,
  },
];

const PricingTable = ({ type }) => {
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
            {pricingData.map((data, index) => (
              <PricingCard
                key={index}
                title={data.title}
                discountPrice={data.discountPrice}
                mainPrice={data.mainPrice}
                options={data.options}
                isActive={data.isActive}
                aosDelay={data.aosDelay}
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
