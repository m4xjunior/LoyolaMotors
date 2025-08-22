import { useEffect } from "react";
import AOS from "aos";
import { AppRoutes } from "./routes";

export default function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return <AppRoutes />;
}
