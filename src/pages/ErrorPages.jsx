import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPages() {
  return (
    <div className="error-section error-page-bg-img ak-bg ak-center">
      <div className="error-content">
        <h1 className="error-title ak-stroke-number color-white">404</h1>
        <h2 className="erro-sub-title">¡Vaya! Página no encontrada</h2>
        <p className="erro-desp">
          Lo sentimos, la página que buscas no existe o fue movida. Vuelve al inicio o
          contáctanos y te ayudamos a encontrar lo que necesitas.
        </p>
        <div className="go-to-home">
          <Link to="/" className="common-btn">
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}
