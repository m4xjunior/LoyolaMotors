
import Videos from "../componentes/VideoPopup/Videos";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import FrequentlyQuestions from "../componentes/PerguntasFrequentes/PerguntasFrequentes";
import AppointmentForm from "../componentes/FormularioAgendamento/FormularioAgendamento";

const Faq = () => {
  return (
    <>
      <CommonPageHero title={"Preguntas frecuentes"} />
      <FrequentlyQuestions />
      <Videos videoId={"VcaAVWtP48A"} />
      <AppointmentForm />
    </>
  );
};

export default Faq;
