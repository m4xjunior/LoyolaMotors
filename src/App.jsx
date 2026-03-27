import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./layout/Main";
import DashboardMain from "./layout/DashboardLayout/DashboardMain";
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
import InvoiceForm from "./components/InvoiceForm/InvoiceForm";
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
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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

      {/* Public site routes under Main layout (Header + Footer) */}
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="service" element={<Service />} />
        <Route path="service-two" element={<ServicesTwo />} />
        <Route path="service-single/:serviceId" element={<SingleService />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog-single/:blogId" element={<SingleBlog />} />
        <Route path="team" element={<Team />} />
        <Route path="team-member/:teamId" element={<TeamMemberDetails />} />
        <Route path="testimonial" element={<Testimonials />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="faq" element={<Faq />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="comming-soon" element={<CommingSoon />} />
        <Route path="terms-conditions" element={<TermsConditions />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>

      {/* Dashboard routes under DashboardMain layout (Sidebar + DashboardHeader) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="empleado">
            <DashboardMain />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="clientes" element={<ClientesManagementPage />} />
        <Route path="clientes/novo" element={<NovoClientePage />} />
        <Route path="clientes/:clienteId" element={<ClienteDetailPage />} />
        <Route path="clientes/editar/:clienteId" element={<NovoClientePage />} />
        <Route path="vehiculos" element={<VehiclesPage />} />
        <Route path="vehiculos/novo" element={<NovoVehiculoPage />} />
        <Route path="vehiculos/:vehicleId/servicios" element={<VehicleServicesPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="servicios/nuevo" element={<NovoServicoPage />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsersManagementPage />
            </ProtectedRoute>
          }
        />
        {/* Invoice routes - moved from /invoices to /dashboard/invoices */}
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="create-invoice" element={<InvoiceForm />} />
        <Route path="invoice/:id" element={<SingleInvoicePage />} />
      </Route>

      <Route path="/*" element={<ErrorPages />} />
    </Routes>
  );
}
