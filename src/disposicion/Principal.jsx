import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecera from "./Cabecera/Cabecera";
import PiePagina from "./PiePagina/PiePagina";
import VoltarTopo from "../componentes/VoltarTopo/VoltarTopo";
import BarraNavegacaoAdmin from "../componentes/NavAdmin/BarraNavAdmin";

const Principal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Cabecera />
      <Outlet />
      <PiePagina />
      <VoltarTopo />
      <BarraNavegacaoAdmin />
    </>
  );
};

export default Principal;
