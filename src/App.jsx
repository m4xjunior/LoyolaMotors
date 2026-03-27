import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Principal from "./disposicion/Principal";
import PanelPrincipal from "./disposicion/PanelDisposicion/PanelPrincipal";
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
import PaginaDetalleFactura from "./paginas/PaginaDetalleFactura";
import InvoiceForm from "./components/InvoiceForm/InvoiceForm";
import ProtectedRoute from "./componentes/RutaProtegida/RutaProtegida";
import PaginaFacturas from "./paginas/PaginaFacturas";
import PaginaPanel from "./paginas/PaginaPanel";
import PaginaClientes from "./paginas/PaginaClientes";
import PaginaNuevoCliente from "./paginas/PaginaNuevoCliente";
import PaginaNuevoServicio from "./paginas/PaginaNuevoServicio";
import PaginaNuevoVehiculo from "./paginas/PaginaNuevoVehiculo";
import PaginaVehiculos from "./paginas/PaginaVehiculos";
import PaginaServiciosVehiculo from "./paginas/PaginaServiciosVehiculo";
import PaginaServicios from "./paginas/PaginaServicios";
import PaginaUsuarios from "./paginas/PaginaUsuarios";
import PaginaDetalleCliente from "./paginas/PaginaDetalleCliente";
import PaginaTerminos from "./paginas/PaginaTerminos";
import PaginaPrivacidad from "./paginas/PaginaPrivacidad";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<PaginaInicioSesion />} />

      {/* Public site routes under Main layout (Header + Footer) */}
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

      {/* Dashboard routes under PanelPrincipal layout (Sidebar + PanelCabecera) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="empleado">
            <PanelPrincipal />
          </ProtectedRoute>
        }
      >
        <Route index element={<PaginaPanel />} />
        <Route path="clientes" element={<PaginaClientes />} />
        <Route path="clientes/novo" element={<PaginaNuevoCliente />} />
        <Route path="clientes/:clienteId" element={<PaginaDetalleCliente />} />
        <Route path="clientes/editar/:clienteId" element={<PaginaNuevoCliente />} />
        <Route path="vehiculos" element={<PaginaVehiculos />} />
        <Route path="vehiculos/novo" element={<PaginaNuevoVehiculo />} />
        <Route path="vehiculos/:vehicleId/servicios" element={<PaginaServiciosVehiculo />} />
        <Route path="servicios" element={<PaginaServicios />} />
        <Route path="servicios/nuevo" element={<PaginaNuevoServicio />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaUsuarios />
            </ProtectedRoute>
          }
        />
        {/* Invoice routes - moved from /invoices to /dashboard/invoices */}
        <Route path="invoices" element={<PaginaFacturas />} />
        <Route path="create-invoice" element={<InvoiceForm />} />
        <Route path="invoice/:id" element={<PaginaDetalleFactura />} />
      </Route>

      <Route path="/*" element={<PaginaError />} />
    </Routes>
  );
}
