
import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import ServiceProgres from "../components/ServiceProgres/ServiceProgres";
import SectionHeading from "../components/SectionHeading/SectionHeading";

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
