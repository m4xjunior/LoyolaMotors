import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecera from "./Cabecera/Cabecera";
import PiePagina from "./PiePagina/PiePagina";
import { pageScrollUp } from "../helper/main";
import ScrollUpButton from "../components/ScrollUp/Scrollup";
import AdminNavBar from "../components/AdminNav/AdminNavBar";

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
