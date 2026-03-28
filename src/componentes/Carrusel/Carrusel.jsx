import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "motion/react";
import "./Carrusel.css";

const VELOCIDAD_ARRASTRE = 1.5;
const UMBRAL_VELOCIDAD = 500;
const GAP = 16;
const SPRING = { type: "spring", stiffness: 200, damping: 30 };

function ElementoCarrusel({ item, tamano, isActive }) {
  return (
    <motion.div
      className={`carrusel-item ${isActive ? "carrusel-item--activo" : ""}`}
      style={{
        width: tamano,
        flexShrink: 0,
      }}
      animate={{
        scale: isActive ? 1.03 : 0.95,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="carrusel-item__icono">{item.icon}</div>
      <div className="carrusel-item__contenido">
        <p className="carrusel-item__titulo">{item.title}</p>
        {item.valor !== undefined && (
          <p className="carrusel-item__valor" style={{ color: item.color || "var(--acento)" }}>
            {item.valor}
          </p>
        )}
        <p className="carrusel-item__descripcion">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function Carrusel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
}) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [anchoElemento, setAnchoElemento] = useState(baseWidth);
  const refContenedor = useRef(null);
  const refAutoplay = useRef(null);
  const estaPausado = useRef(false);

  const x = useMotionValue(0);
  const controles = useAnimation();

  const calcularPosicion = useCallback(
    (indice) => {
      if (!refContenedor.current) return 0;
      const anchoContenedor = refContenedor.current.offsetWidth;
      const centroContenedor = anchoContenedor / 2;
      const centroElemento = anchoElemento / 2;
      return centroContenedor - centroElemento - indice * (anchoElemento + GAP);
    },
    [anchoElemento]
  );

  const irAElemento = useCallback(
    (indice) => {
      let nuevoIndice = indice;
      if (loop) {
        nuevoIndice = ((indice % items.length) + items.length) % items.length;
      } else {
        nuevoIndice = Math.max(0, Math.min(items.length - 1, indice));
      }
      setIndiceActual(nuevoIndice);
      controles.start({ x: calcularPosicion(nuevoIndice), transition: SPRING });
    },
    [items.length, loop, controles, calcularPosicion]
  );

  /* Recalcular ancho responsivo */
  useEffect(() => {
    const handleResize = () => {
      if (refContenedor.current) {
        const anchoContenedor = refContenedor.current.offsetWidth;
        setAnchoElemento(Math.min(baseWidth, anchoContenedor * 0.85));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseWidth]);

  /* Posicionar al montar */
  useEffect(() => {
    controles.start({ x: calcularPosicion(indiceActual), transition: { duration: 0 } });
  }, [anchoElemento]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Autoplay */
  useEffect(() => {
    if (!autoplay) return;
    const iniciarAutoplay = () => {
      refAutoplay.current = setInterval(() => {
        if (!estaPausado.current) {
          irAElemento(indiceActual + 1);
        }
      }, autoplayDelay);
    };
    iniciarAutoplay();
    return () => clearInterval(refAutoplay.current);
  }, [autoplay, autoplayDelay, indiceActual, irAElemento]);

  const manejarArrastreTerminado = (_, info) => {
    const offset = info.offset.x;
    const velocidad = info.velocity.x;

    if (Math.abs(velocidad) > UMBRAL_VELOCIDAD) {
      irAElemento(velocidad > 0 ? indiceActual - 1 : indiceActual + 1);
    } else if (Math.abs(offset) > anchoElemento / 3) {
      irAElemento(offset > 0 ? indiceActual - 1 : indiceActual + 1);
    } else {
      controles.start({ x: calcularPosicion(indiceActual), transition: SPRING });
    }
  };

  return (
    <div
      className="carrusel-contenedor"
      ref={refContenedor}
      onMouseEnter={() => pauseOnHover && (estaPausado.current = true)}
      onMouseLeave={() => pauseOnHover && (estaPausado.current = false)}
    >
      <motion.div
        className="carrusel-pista"
        drag="x"
        dragConstraints={refContenedor}
        dragElastic={0.1}
        dragMomentum={false}
        dragTransition={{ power: VELOCIDAD_ARRASTRE }}
        style={{ x, gap: GAP }}
        animate={controles}
        onDragEnd={manejarArrastreTerminado}
      >
        {items.map((item, i) => (
          <ElementoCarrusel
            key={item.id ?? i}
            item={item}
            tamano={anchoElemento}
            isActive={i === indiceActual}
          />
        ))}
      </motion.div>

      {/* Indicadores */}
      <div className="carrusel-indicadores">
        {items.map((_, i) => (
          <button
            key={i}
            className={`carrusel-indicador ${i === indiceActual ? "carrusel-indicador--activo" : ""}`}
            onClick={() => irAElemento(i)}
            aria-label={`Ir al elemento ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
