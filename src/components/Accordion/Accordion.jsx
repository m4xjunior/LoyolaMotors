import { useState } from 'react';
import AccordionItem from "./AccordionItem";

const faqItems = [
  {
    title: "¿Qué servicios ofrecéis en vuestro taller?",
    content:
      "Ofrecemos servicios completos de chapa, pintura y mecánica general. Desde reparaciones de golpes y arañazos hasta mantenimiento de motor, frenos y revisiones pre-ITV.",
  },
  {
    title: "¿Con qué frecuencia debo revisar mi coche?",
    content:
      "Recomendamos una revisión cada 10.000 o 15.000 kilómetros, o según lo especificado en el manual de tu vehículo, para garantizar su óptimo funcionamiento y seguridad.",
  },
  {
    title: "¿Cómo sé si mis frenos necesitan ser reemplazados?",
    content:
      "Si escuchas un chirrido, sientes vibraciones o notas que tardas más en frenar, es probable que sea hora de reemplazar los frenos. Contáctanos para una revisión gratuita.",
  },
  {
    title: "¿Qué puedo hacer entre revisiones?",
    content:
      "Comprueba regularmente la presión de los neumáticos, los niveles de aceite y mantén el coche limpio. Sigue las pautas de mantenimiento del manual de tu vehículo.",
  },
  {
    title: "¿Ofrecéis garantía en vuestras reparaciones?",
    content:
      "Sí, ofrecemos hasta 1 año de garantía en todas nuestras reparaciones de chapa y pintura, y 6 meses en reparaciones mecánicas. Contáctanos para más detalles.",
  },
];

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.content
      }
    }))
  };

  return (
    <div className="ak-accordion">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {faqItems.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default Accordion;
