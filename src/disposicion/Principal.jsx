import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecera from "./Cabecera/Cabecera";
import PiePagina from "./PiePagina/PiePagina";
import { pageScrollUp } from "../auxiliar/principal";
import ScrollUpButton from "../componentes/VoltarTopo/VoltarTopo";
// /* COMPONENTE LEGADO - Reemplazado por shadcn Sidebar */ import AdminNavBar from "../componentes/NavAdmin/BarraNavAdmin";

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
      {/* COMPONENTE LEGADO - Reemplazado por shadcn Sidebar */}{/* <AdminNavBar /> */}
    </>
  );
};

export default Principal;
