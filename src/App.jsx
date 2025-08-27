import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./layout/Main";
import AOS from "aos";
import ErrorPages from "./pages/ErrorPages";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import ServicesTwo from "./pages/ServicesTwo";
import Blog from "./pages/Blog";
import SingleBlog from "./pages/SingleBlog";
import Team from "./pages/Team";
import TeamMemberDetails from "./pages/TeamMemberDetails";
import Testimonials from "./pages/Testimonial";
import Gallery from "./pages/Gallery";
import Appointment from "./pages/Appointment";
import Pricing from "./pages/Pricing";
import CommingSoon from "./pages/CommingSoon";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import SingleService from "./pages/SingleService";
import LoginPage from "./pages/LoginPage";
import SingleInvoicePage from "./pages/SingleInvoicePage";
import InvoiceFormPage from "./pages/InvoiceFormPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import InvoicesPage from "./pages/InvoicesPage";
import DashboardPage from "./pages/DashboardPage";
import ClientesManagementPage from "./pages/ClientesManagementPage";
import NovoClientePage from "./pages/NovoClientePage";
import NovoServicoPage from "./pages/NovoServicoPage";
import NovoVehiculoPage from "./pages/NovoVehiculoPage";
import VehiclesPage from "./pages/VehiclesPage";
import VehicleServicesPage from "./pages/VehicleServicesPage";
import ServicesPage from "./pages/ServicesPage";
import UsersManagementPage from "./pages/UsersManagementPage";
import ClienteDetailPage from "./pages/ClienteDetailPage";

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Main />}>
        <Route index element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/service" element={<Service />}></Route>
        <Route path="/service-two" element={<ServicesTwo />}></Route>
        <Route
          path="/service-single/:serviceId"
          element={<SingleService />}
        ></Route>
        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/blog-single/:blogId" element={<SingleBlog />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-member/:teamId" element={<TeamMemberDetails />} />
        <Route path="/testimonial" element={<Testimonials />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/comming-soon" element={<CommingSoon />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="empleado">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes"
          element={
            <ProtectedRoute requiredRole="empleado">
              <ClientesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes/novo"
          element={
            <ProtectedRoute requiredRole="empleado">
              <NovoClientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes/:clienteId"
          element={
            <ProtectedRoute requiredRole="empleado">
              <ClienteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes/novo"
          element={
            <ProtectedRoute requiredRole="empleado">
              <NovoClientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes/editar/:clienteId"
          element={
            <ProtectedRoute requiredRole="empleado">
              <NovoClientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehiculos"
          element={
            <ProtectedRoute requiredRole="empleado">
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehiculos/novo"
          element={
            <ProtectedRoute requiredRole="empleado">
              <NovoVehiculoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehiculos/:vehicleId/servicios"
          element={
            <ProtectedRoute requiredRole="empleado">
              <VehicleServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/servicios"
          element={
            <ProtectedRoute requiredRole="empleado">
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/servicios/nuevo"
          element={
            <ProtectedRoute requiredRole="empleado">
              <NovoServicoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsersManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Legacy Invoice Routes */}
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute>
              <InvoiceFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice/:id"
          element={
            <ProtectedRoute>
              <SingleInvoicePage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/*" element={<ErrorPages />}></Route>
    </Routes>
  );
}
