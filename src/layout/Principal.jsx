import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Cabecalho/Cabecalho";
import Footer from "./Rodape/Rodape";
import { pageScrollUp } from "../auxiliar/principal";
import ScrollUpButton from "../componentes/VoltarTopo/VoltarTopo";
import AdminNavBar from "../componentes/NavAdmin/BarraNavAdmin";

const Main = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    pageScrollUp();
  }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ScrollUpButton />
      <AdminNavBar />
    </>
  );
};

export default Main;
