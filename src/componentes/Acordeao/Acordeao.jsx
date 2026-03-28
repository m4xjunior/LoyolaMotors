import { useState, useEffect } from "react";
import {
  Accordion as ShadcnAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { servicioContenido } from "../../servicios/servicioContenido";

const FAQ_POR_DEFECTO = [
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
  const [faqItems, setFaqItems] = useState(FAQ_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('preguntas').then(r => {
      if (r.length > 0) setFaqItems(r);
    });
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };

  return (
    <div className="ak-accordion">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ShadcnAccordion type="single" collapsible defaultValue="item-0">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </ShadcnAccordion>
    </div>
  );
};

export default Accordion;
