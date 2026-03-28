import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextAnimation from "../../components/TextAnimation/TextAnimation";
import { servicioConfiguracion } from "../../servicios/servicioConfiguracion";

import footerLogo from "/assets/img/icon/loyola-logo-v2.png";

const CONFIG_POR_DEFECTO = {
  telefono: '+34 640 16 29 47',
  email: 'info@loyolamotors.es',
  direccion: 'Calle Sant Ignasi de Loiola, 21 - BJ IZ, 46008 Valencia',
  horario: 'Lun - Vie: 9:00 - 18:00',
  redesSociales: {
    facebook: 'https://www.facebook.com/',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://www.x.com/',
  },
};

const PiePagina = () => {
  const [config, setConfig] = useState(CONFIG_POR_DEFECTO);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    servicioConfiguracion.obtener().then(setConfig);
  }, []);

  const telefono = config.telefono || CONFIG_POR_DEFECTO.telefono;
  const emailEmpresa = config.email || CONFIG_POR_DEFECTO.email;
  const direccion = config.direccion || CONFIG_POR_DEFECTO.direccion;
  const horario = config.horario || CONFIG_POR_DEFECTO.horario;
  const telefonoHref = `tel:${telefono.replace(/\s/g, '')}`;
  const redesSociales = config.redesSociales || CONFIG_POR_DEFECTO.redesSociales;

  const menuPrincipal = [
    { title: "Sobre nosotros", link: "/about" },
    { title: "Servicios", link: "/service" },
    { title: "Precios", link: "/pricing" },
    { title: "Equipo", link: "/team" },
    { title: "Contacto", link: "/contact" },
  ];

  const menuSecundario = [
    { title: "Cita previa", link: "/appointment" },
    { title: "Blog", link: "/blog" },
    { title: "Preguntas frecuentes", link: "/faq" },
    { title: "Términos y Condiciones", link: "/terms-conditions" },
    { title: "Política de Privacidad", link: "/privacy-policy" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setMessage("¡Gracias por suscribirte!");
      setEmail("");
    } else {
      setMessage("Por favor, introduce un email válido.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <>
      <div className="ak-height-125 ak-height-lg-80"></div>
      <footer className="footer style-1 footer-bg">
        <div className="container">
          <div className="ak-height-40 ak-height-lg-60"></div>
          <div
            className="footer-email"
            data-aos="fade-zoom-in"
            data-aos-easing="ease-in-back"
            data-aos-delay="100"
            data-aos-offset="0"
          >
            <div
              className="background-text"
              data-aos="fade-left"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              Boletín
            </div>
            <div className="footer-heading-email">
              <h5 className="email-title">
                Suscríbete para recibir novedades, ofertas y descuentos.
              </h5>
              <div>
                <p id="ak-alert-footer">{message}</p>
                <form className="email-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="footerEmail"
                    id="footerEmail"
                    placeholder="Introduce tu email..."
                    className="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-btn">
                    <span className="send">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                      >
                        <path
                          d="M23.0345 3.91676C23.5566 2.42362 22.157 0.976718 20.7126 1.51775L3.06022 8.11754C1.61105 8.65982 1.43579 10.704 2.76894 11.5024L8.40369 14.8748L13.4353 9.67315C13.6633 9.44555 13.9686 9.31961 14.2855 9.32246C14.6024 9.3253 14.9055 9.45671 15.1296 9.68837C15.3537 9.92004 15.4808 10.2334 15.4836 10.561C15.4863 10.8887 15.3645 11.2043 15.1444 11.4399L10.1127 16.6415L13.3761 22.4667C14.1472 23.8448 16.1246 23.6624 16.6491 22.1655L23.0345 3.91676Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="ak-height-70 ak-height-lg-30"></div>
          <div className="primary-color-border"></div>
          <div className="ak-height-35 ak-height-lg-30"></div>
          <div className="footer-logo">
            <img
              src={footerLogo}
              alt="footer-logo"
              style={{ maxWidth: "200px" }}
            />
            <div className="ak-height-15 ak-height-lg-10"></div>
          </div>
          <div className="footer-content">
            {/* Footer info column */}
            <div
              className="footer-info"
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-duration="500"
            >
              <p className="desp">
                Loyola Motors Valencia — Taller especializado en chapa, pintura y mecánica general con más de 20 años de experiencia en el centro de Valencia.
              </p>
              <div className="ak-height-35 ak-height-lg-30"></div>
              <div className="d-flex align-items-center gap-3">
                <div className="heartbeat-icon">
                  <Link to={telefonoHref}>
                    <span className="ak-heartbeat-btn">
                      <img src="/assets/img/icon/phone.svg" alt="..." />
                    </span>
                  </Link>
                </div>
                <TextAnimation
                  link={telefonoHref}
                  title={telefono}
                  classNamePass="phone white"
                />
              </div>
            </div>

            {/* Menu principal */}
            <div
              className="footer-menu-one"
              data-aos="fade-up"
              data-aos-delay="50"
              data-aos-duration="500"
            >
              <div className="footer-menu">
                <p className="menu-title">ENLACES RÁPIDOS</p>
                {menuPrincipal.map((item, idx) => (
                  <TextAnimation
                    key={idx}
                    link={item.link}
                    title={item.title}
                    classNamePass="menu-item white"
                  />
                ))}
              </div>
            </div>

            {/* Menu secundario */}
            <div
              className="footer-menu-two"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="500"
            >
              <div className="footer-menu">
                <p className="menu-title">ENLACES RÁPIDOS</p>
                {menuSecundario.map((item, idx) => (
                  <TextAnimation
                    key={idx}
                    link={item.link}
                    title={item.title}
                    classNamePass="menu-item white"
                  />
                ))}
              </div>
            </div>

            {/* Dirección y contacto */}
            <div
              className="footer-address"
              data-aos="fade-up"
              data-aos-delay="150"
              data-aos-duration="500"
            >
              <div className="footer-address">
                <p className="adress-title">UBICACIÓN Y CONTACTO</p>
                <Link to="#" className="location">
                  <span className="me-1">
                    <img
                      src="/assets/img/icon/location.svg"
                      alt="Location"
                    />
                  </span>
                  {direccion}
                </Link>
                <Link to={`mailto:${emailEmpresa}`} className="email">
                  <span className="me-1">
                    <img src="/assets/img/icon/email.svg" alt="Email" />
                  </span>
                  {emailEmpresa}
                </Link>
                <p className="date">
                  <span className="me-1">
                    <img
                      src="/assets/img/icon/calender.svg"
                      alt="Calendar"
                    />
                  </span>
                  Horario: {horario}
                </p>
              </div>
            </div>
          </div>
          <div className="ak-height-70 ak-height-lg-30"></div>
          <div className="primary-color-border"></div>
          <div className="copy-right">
            <p className="title  text-hover-animaiton">
              © 2025 Loyola Motors Valencia. Todos los derechos reservados. |{" "}
              <Link
                to="/terms-conditions"
                style={{ textDecoration: "underline", opacity: 0.7 }}
              >
                Términos y Condiciones
              </Link>
              {" | "}
              <Link
                to="/privacy-policy"
                style={{ textDecoration: "underline", opacity: 0.7 }}
              >
                Política de Privacidad
              </Link>
              {" | "}
              <Link
                to="/login"
                style={{ textDecoration: "underline", opacity: 0.7 }}
              >
                Admin
              </Link>
            </p>
            <div className="social-icon">
              {redesSociales.facebook && (
                <Link to={redesSociales.facebook}>
                  <img src="/assets/img/icon/facebookicon.svg" alt="..." />
                </Link>
              )}
              {redesSociales.linkedin && (
                <Link to={redesSociales.linkedin}>
                  <img src="/assets/img/icon/linkedinicon.svg" alt="..." />
                </Link>
              )}
              {redesSociales.twitter && (
                <Link to={redesSociales.twitter}>
                  <img src="/assets/img/icon/twittericon.svg" alt="..." />
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PiePagina;
