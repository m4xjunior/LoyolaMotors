
import Services from "../componentes/Servicos/SecaoServicos";
import Cta from "../componentes/ChamadaAcao/ChamadaAcao";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";

const Service = () => {
  return (
    <>
      <CommonPageHero title={"Servicios"} />
      <Services />
      <Cta />
    </>
  );
};

export default Service;
