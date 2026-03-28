import { useState, useEffect } from "react";
import Counter from "./Counter";
import { servicioContenido } from "../../servicios/servicioContenido";

const ESTADISTICAS_POR_DEFECTO = [
  { id: 1, numero: 22, texto: "AÑOS DE EXPERIENCIA", orden: 0 },
  { id: 2, numero: 900, texto: "RESEÑAS 5 ESTRELLAS", orden: 1 },
  { id: 3, numero: 100, texto: "SATISFACCIÓN DEL CLIENTE", orden: 2 },
];

const AutoCounter = () => {
  const [estadisticas, setEstadisticas] = useState(ESTADISTICAS_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('estadisticas', { orden: true }).then(resultado => {
      if (resultado.length > 0) setEstadisticas(resultado);
    });
  }, []);

  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="auto-counter-section">
        <div className="row align-items-center gap-lg-0 gap-3" id="counter">
          {estadisticas.map((counter, index) => (
            <div key={counter.id} className="col-lg-4">
              <Counter
                end={counter.numero}
                delay={index * 50}
                text={counter.texto}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoCounter;
