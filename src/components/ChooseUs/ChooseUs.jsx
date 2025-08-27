import SectionHeading from "../SectionHeading/SectionHeading";
import { ButtonCommon } from "../Button/Button";

const chooseUsData = {
  bgText: "CARACTERÍSTICAS",
  title: "¿POR QUÉ ELEGIR LOYOLA MOTORS?",
  desp: "Más de 20 años cuidando los carros de su familia. 900 reviews 5 estrellas, precios transparentes y garantía de hasta 1 año.",
  img: "/assets/img/chooseus/choose-us.png",
  list: [
    { title: "TÉCNICOS CERTIFICADOS (más de 10 años de formación continua)" },
    { title: "MÁS DE 900 RESEÑAS 5 ESTRELLAS en Google y Facebook" },
    { title: "GARANTÍA DE HASTA 1 AÑO en reparaciones y pintura" },
    { title: "PRECIOS TRANSPARENTES – compara y ahorra hasta 25%" },
    { title: "ATENCIÓN PERSONALIZADA – respondemos en menos de 2 horas" },
  ],
};

const ChooseUs = () => {
  const { bgText, title, desp, list, img } = chooseUsData;

  return (
    <section className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="choose-us-container-extents">
        <div className="choose-us-contain">
          <div className="choose-us-info" data-aos="fade-up">
            <SectionHeading bgText={bgText} title={title} desp={desp} />
            <div className="ak-height-60 ak-height-lg-30"></div>
            <div className="stroke-heading-text">
              {list.map((item) => (
                <h3
                  key={item.title}
                  className="ak-stroke-text hover-color-changes"
                >
                  {item.title}
                </h3>
              ))}
            </div>
            <div className="ak-height-60 ak-height-lg-30"></div>
            <ButtonCommon to="tel:+34640162947">Solicita tu presupuesto ahora</ButtonCommon>
          </div>
          <div
            className="choose-us-img"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <img src={img} alt="..." />
            <img
              className="circle-img"
              src="/assets/img/chooseus/Circle.png"
              alt="..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
