import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.jsx";
import { ProveedorAutenticacion } from "@/contextos/ContextoAutenticacion";
import { sembrarDatosIniciales } from "@/utilidades/semillaDatos";

import "./index.scss";
import "./globals.css";

sembrarDatosIniciales();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProveedorAutenticacion>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProveedorAutenticacion>
  </React.StrictMode>,
);
