// ============================================================
// SECCIÓN ÁREA DE MIEMBROS - Homepage
// Muestra los beneficios de ser miembro del taller
// Usa SpotlightCard (ReactBits) para efecto glow en hover
// ============================================================
import { Link } from "react-router-dom";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import "./AreaMiembros.css";

const beneficiosMiembro = [
  {
    icono: "🔧",
    titulo: "Estado de reparación",
    descripcion: "Sigue el progreso de tu vehículo en tiempo real. Fotos, etapas y fecha de entrega.",
  },
  {
    icono: "📋",
    titulo: "Historial de servicios",
    descripcion: "Consulta todas las reparaciones anteriores, facturas y garantías de tu coche.",
  },
  {
    icono: "🏷️",
    titulo: "Descuentos exclusivos",
    descripcion: "Accede a precios especiales reservados solo para miembros del taller.",
  },
  {
    icono: "📅",
    titulo: "Citas prioritarias",
    descripcion: "Reserva tu cita online con prioridad y sin esperas.",
  },
];

const AreaMiembros = () => {
  return (
    <section className="area-miembros-seccion" data-aos="fade-up">
      <div className="container">
        <div className="area-miembros-cabecera" data-aos="fade-up">
          <span className="area-miembros-etiqueta">Exclusivo</span>
          <h2 className="area-miembros-titulo">
            Área de Miembros
          </h2>
          <p className="area-miembros-subtitulo">
            Accede a tu panel personalizado como cliente de Loyola Motors. Controla todo desde tu móvil.
          </p>
        </div>

        <div className="area-miembros-grid">
          {beneficiosMiembro.map((beneficio, i) => (
            <SpotlightCard
              key={i}
              className="area-miembros-tarjeta"
              spotlightColor="rgba(255, 61, 36, 0.15)"
            >
              <div className="area-miembros-tarjeta-contenido" data-aos="fade-up" data-aos-delay={i * 100}>
                <span className="area-miembros-icono">{beneficio.icono}</span>
                <h3 className="area-miembros-tarjeta-titulo">{beneficio.titulo}</h3>
                <p className="area-miembros-tarjeta-descripcion">{beneficio.descripcion}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <div className="area-miembros-cta" data-aos="fade-up" data-aos-delay="200">
          <Link to="/inicio-sesion" className="area-miembros-boton">
            Acceder al Área de Miembros
            <span className="area-miembros-boton-flecha">→</span>
          </Link>
          <p className="area-miembros-nota">
            ¿Aún no eres miembro? Trae tu coche y te damos acceso automáticamente.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AreaMiembros;
