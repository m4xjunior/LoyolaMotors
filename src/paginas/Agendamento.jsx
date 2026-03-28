
import AppointmentForm from "../componentes/FormularioAgendamento/FormularioAgendamento";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import ServiceProgres from "../componentes/ProgressoServico/ProgressoServico";
import SectionHeading from "../componentes/TituloSecao/TituloSecao";

const Appointment = () => {
  return (
    <>
      <CommonPageHero title={"Cita previa"} />
      <AppointmentForm />
      <div className="ak-height-125 ak-height-lg-80"></div>

      <SectionHeading
        type={true}
        bgText={"PROCESO"}
        title={"PROCESO / CARACTERÍSTICAS"}
        desp={
          "Te guiamos en todo el proceso: diagnóstico, presupuesto y entrega con garantía."
        }
      />
      <ServiceProgres />
    </>
  );
};

export default Appointment;
