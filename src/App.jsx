import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
import PaginaNuevaFactura from "./paginas/PaginaNuevaFactura";
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
import PaginaRepuestos from "./paginas/PaginaRepuestos";
import PaginaCitas from "./paginas/PaginaCitas";
import PaginaReportes from "./paginas/PaginaReportes";
import PaginaAdminDiapositivas from "./paginas/PaginaAdminDiapositivas";
import PaginaAdminPrecios from "./paginas/PaginaAdminPrecios";
import PaginaAdminConfiguracion from "./paginas/PaginaAdminConfiguracion";
import PaginaAdminServicios from "./paginas/PaginaAdminServicios";
import PaginaAdminBlog from "./paginas/PaginaAdminBlog";
import PaginaAdminEquipo from "./paginas/PaginaAdminEquipo";
import PaginaAdminGaleria from "./paginas/PaginaAdminGaleria";
import PaginaAdminTestimonios from "./paginas/PaginaAdminTestimonios";
import PaginaAdminPreguntas from "./paginas/PaginaAdminPreguntas";

export default function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);


  return (
    <Routes>
      <Route path="/inicio-sesion" element={<PaginaInicioSesion />} />
      {/* Legacy alias */}
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

      {/* Panel routes under PanelPrincipal layout (Sidebar + PanelCabecera) */}
      <Route
        path="/panel"
        element={
          <ProtectedRoute requiredRole="empleado">
            <PanelPrincipal />
          </ProtectedRoute>
        }
      >
        <Route index element={<PaginaPanel />} />
        <Route path="clientes" element={<PaginaClientes />} />
        <Route path="clientes/nuevo" element={<PaginaNuevoCliente />} />
        <Route path="clientes/:clienteId" element={<PaginaDetalleCliente />} />
        <Route path="clientes/editar/:clienteId" element={<PaginaNuevoCliente />} />
        <Route path="vehiculos" element={<PaginaVehiculos />} />
        <Route path="vehiculos/nuevo" element={<PaginaNuevoVehiculo />} />
        <Route path="vehiculos/editar/:vehiculoId" element={<PaginaNuevoVehiculo />} />
        <Route path="vehiculos/:vehicleId/servicios" element={<PaginaServiciosVehiculo />} />
        <Route path="servicios" element={<PaginaServicios />} />
        <Route path="servicios/nuevo" element={<PaginaNuevoServicio />} />
        <Route path="servicios/editar/:servicioId" element={<PaginaNuevoServicio />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaUsuarios />
            </ProtectedRoute>
          }
        />
        {/* Rutas de facturas */}
        <Route path="facturas" element={<PaginaFacturas />} />
        <Route path="facturas/nueva" element={<PaginaNuevaFactura />} />
        <Route path="facturas/editar/:facturaId" element={<PaginaNuevaFactura />} />
        <Route path="facturas/:facturaId" element={<PaginaDetalleFactura />} />
        {/* Rutas legacy para compatibilidad */}
        <Route path="invoices" element={<PaginaFacturas />} />
        <Route path="invoice/:id" element={<PaginaDetalleFactura />} />
        {/* Nuevas rutas de funcionalidades */}
        <Route path="repuestos" element={<PaginaRepuestos />} />
        <Route path="citas" element={<PaginaCitas />} />
        <Route path="reportes" element={<PaginaReportes />} />
        {/* Rutas de administracion de contenido CMS */}
        <Route
          path="admin/diapositivas"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminDiapositivas />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/precios"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminPrecios />
            </ProtectedRoute>
          }
          
        />
        <Route
          path="admin/configuracion"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminConfiguracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/servicios"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminServicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/blog"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/equipo"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminEquipo />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/galeria"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminGaleria />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/testimonios"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminTestimonios />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/preguntas"
          element={
            <ProtectedRoute requiredRole="admin">
              <PaginaAdminPreguntas />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/*" element={<PaginaError />} />
    </Routes>
  );
}
