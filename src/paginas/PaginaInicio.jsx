
import HeroSlider from "../componentes/Carroseis/CarrosselHero";
import ServiceProgres from "../componentes/ProgressoServico/ProgressoServico";
import ChooseUs from "../componentes/PorQueNos/PorQueNos";
import Services from "../componentes/Servicos/SecaoServicos";
import Videos from "../componentes/VideoPopup/Videos";
import TrustedClient from "../componentes/ClienteConfiavel/ClienteConfiavel";
import Testimonial from "../componentes/Depoimento/Depoimento";
import PricingTable from "../componentes/Precos/TabelaPrecos";
import Blogs from "../componentes/Blog/Blogs";
import Teams from "../componentes/Equipe/Equipes";
import AutoCounter from "../componentes/ContadorAutomatico/ContadorAutomatico";
import Cta from "../componentes/ChamadaAcao/ChamadaAcao";
import AreaMiembros from "../components/AreaMiembros/AreaMiembros";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ServiceProgres />
      <ChooseUs />
      <Services styleTypeTwo={true} />
      <Videos videoId={"VcaAVWtP48A"} />
      <AutoCounter />
      <TrustedClient />
      <Testimonial />
      <AreaMiembros />
      <Cta />
      <Teams />
      <PricingTable />
      <Blogs styleTypeTwo={true} />
    </>
  );
}
