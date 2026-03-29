import { ServiceCardTwo } from "./CartaoServicoDois";
import servicesDataTwo from "../../dadosJson/dadosServicosDois.json";

const ServicesSectionTwo = ({ styleTypleTwo }) => {
  const data = styleTypleTwo ? servicesDataTwo.slice(0, 3) : servicesDataTwo;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-75 ak-height-lg-80"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((service) => (
          <ServiceCardTwo service={service} key={service.id} />
        ))}
      </div>
    </div>
  );
};

export default ServicesSectionTwo;
