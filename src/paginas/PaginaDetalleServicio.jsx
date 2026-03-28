import { useParams } from "react-router-dom";

import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import ServicesDetailContent from "../componentes/Servicos/ConteudoDetalheServico";
import FrequentlyQuestions from "../componentes/PerguntasFrequentes/PerguntasFrequentes";
import Cta from "../componentes/ChamadaAcao/ChamadaAcao";

import serviceData from "../dadosJson/detalhesServico.json";

const SingleService = () => {
  const { serviceId } = useParams();
  const service = serviceData.find((post) => post.id === parseInt(serviceId));

  return (
    <>
      <CommonPageHero title={"Detalle del servicio"} />
      <ServicesDetailContent service={service} />
      <FrequentlyQuestions />
      <Cta />
    </>
  );
};

export default SingleService;
