
import AboutPageHero from "../componentes/HeroPagina/HeroPaginaSobre";
import CompanyTab from "../componentes/AbaEmpresa/AbaEmpresa";
import ChooseUs from "../componentes/PorQueNos/PorQueNos";
import AutoCounter from "../componentes/ContadorAutomatico/ContadorAutomatico";
import Testimonial from "../componentes/Depoimento/Depoimento";
import Teams from "../componentes/Equipe/Equipes";
import PricingTable from "../componentes/Precos/TabelaPrecos";
import TrustedClient from "../componentes/ClienteConfiavel/ClienteConfiavel";
import Cta from "../componentes/ChamadaAcao/ChamadaAcao";

const About = () => {
  return (
    <>
      <AboutPageHero title={"Sobre nosotros"} />
      <CompanyTab />
      <ChooseUs />
      <AutoCounter />
      <Testimonial />
      <Teams />
      <PricingTable />
      <TrustedClient />
      <Cta />
    </>
  );
};

export default About;
