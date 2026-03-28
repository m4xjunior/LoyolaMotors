import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
<<<<<<<< HEAD:src/disposicion/Principal.jsx
import Cabecera from "./Cabecera/Cabecera";
import PiePagina from "./PiePagina/PiePagina";
import { pageScrollUp } from "../helper/main";
import ScrollUpButton from "../components/ScrollUp/Scrollup";
import AdminNavBar from "../components/AdminNav/AdminNavBar";
========
import Header from "./Cabecalho/Cabecalho";
import Footer from "./Rodape/Rodape";
import { pageScrollUp } from "../auxiliar/principal";
import ScrollUpButton from "../componentes/VoltarTopo/VoltarTopo";
import AdminNavBar from "../componentes/NavAdmin/BarraNavAdmin";
>>>>>>>> origin/main:src/layout/Principal.jsx

const Principal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    pageScrollUp();
  }, [pathname]);

  return (
    <>
      <Cabecera />
      <Outlet />
      <PiePagina />
      <ScrollUpButton />
      <AdminNavBar />
    </>
  );
};

export default Principal;
