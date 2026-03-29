import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Principal from "./disposicion/Principal";
import AOS from "aos";
import PaginaError from "./paginas/PaginaError";
import PaginaInicio from "./paginas/PaginaInicio";
import PaginaSobreNosotros from "./paginas/PaginaSobreNosotros";
import PaginaServicio from "./paginas/PaginaServicio";
import PaginaServiciosDos from "./paginas/PaginaServiciosDos";
import PaginaBlog from "./paginas/PaginaBlog";
import PaginaArticuloBlog from "./paginas/PaginaArticuloBlog";
import PaginaEquipo from "./paginas/PaginaEquipo";
import PaginaDetalleMiembro from "./paginas/PaginaDetalleMiembro";
import PaginaTestimonios from "./paginas/PaginaTestimonios";
import PaginaGaleria from "./paginas/PaginaGaleria";
import PaginaCita from "./paginas/PaginaCita";
import PaginaPrecios from "./paginas/PaginaPrecios";
import PaginaProximamente from "./paginas/PaginaProximamente";
import PaginaPreguntas from "./paginas/PaginaPreguntas";
import PaginaContacto from "./paginas/PaginaContacto";
import PaginaDetalleServicio from "./paginas/PaginaDetalleServicio";
import PaginaInicioSesion from "./paginas/PaginaInicioSesion";
import PaginaTerminos from "./paginas/PaginaTerminos";
import PaginaPrivacidad from "./paginas/PaginaPrivacidad";

export default function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <Routes>
      <Route path="/inicio-sesion" element={<PaginaInicioSesion />} />
      <Route path="/login" element={<PaginaInicioSesion />} />

      <Route path="/" element={<Principal />}>
        <Route index element={<PaginaInicio />} />
        <Route path="about" element={<PaginaSobreNosotros />} />
        <Route path="service" element={<PaginaServicio />} />
        <Route path="service-two" element={<PaginaServiciosDos />} />
        <Route path="service-single/:serviceId" element={<PaginaDetalleServicio />} />
        <Route path="blog" element={<PaginaBlog />} />
        <Route path="blog-single/:blogId" element={<PaginaArticuloBlog />} />
        <Route path="team" element={<PaginaEquipo />} />
        <Route path="team-member/:teamId" element={<PaginaDetalleMiembro />} />
        <Route path="testimonial" element={<PaginaTestimonios />} />
        <Route path="appointment" element={<PaginaCita />} />
        <Route path="pricing" element={<PaginaPrecios />} />
        <Route path="faq" element={<PaginaPreguntas />} />
        <Route path="gallery" element={<PaginaGaleria />} />
        <Route path="contact" element={<PaginaContacto />} />
        <Route path="comming-soon" element={<PaginaProximamente />} />
        <Route path="terms-conditions" element={<PaginaTerminos />} />
        <Route path="privacy-policy" element={<PaginaPrivacidad />} />
      </Route>

      <Route path="/*" element={<PaginaError />} />
    </Routes>
  );
}
