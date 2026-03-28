
import PricingTable from "../componentes/Precos/TabelaPrecos";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import AppointmentForm from "../componentes/FormularioAgendamento/FormularioAgendamento";

export default function Pricing() {
  return (
    <>
      <CommonPageHero title={"Planes de precios"} />
      <PricingTable type={true} />
      <AppointmentForm />
    </>
  );
}
