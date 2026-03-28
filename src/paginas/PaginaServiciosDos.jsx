
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import Cta from "../componentes/ChamadaAcao/ChamadaAcao";
import ServicesSectionTwo from "../componentes/Servicos/SecaoServicosDois";

const ServicesTwo = () => {
  return (
    <>
      <CommonPageHero title={"Servicios"} />
      <ServicesSectionTwo />
      <Cta />
    </>
  );
};

export default ServicesTwo;
