import { Link } from "react-router-dom";
import { MoreBtn } from "../Botao/Botao";

const ServicesDetailContent = ({ service }) => {
  const {
    service_details: { title, description, services },
    similar_services,
  } = service;

  return (
    <>
      <div className="ak-height-75 ak-height-lg-80"></div>
      <div className="flex justify-center">
        <div className="sticky-content mx-auto max-w-7xl px-4">
          <div className="content">
            <div className="single-blog-list" data-aos="fade-up">
              <h4 className="single-blog-title">{title}</h4>
              <p className="single-blog-desp">{description}</p>
              <img
                src="/assets/img/service/services-single.jpg"
                data-aos="fade-up"
                className="max-w-full h-auto"
                alt="..."
              />
              <div className="ak-height-50 ak-height-lg-50"></div>
            </div>
            {services?.map((service, index) => (
              <div className="single-blog-list" data-aos="fade-up">
                <h4 className="single-blog-title">
                  {index + 1}.{service?.title}
                </h4>
                <p className="single-blog-desp">{service?.description}</p>
              </div>
            ))}
          </div>
          <div className="sidebar">
            <div className="flex flex-col gap-4 2xl:items-end">
              {similar_services?.map((similar_item, index) => (
                <div className="service-card-style-2" data-aos="fade-up">
                  <div className="service-icon">
                    <img src={similar_item.icon} alt={similar_item.title} />
                  </div>
                  <div className="service-desp">
                    <Link
                      to={`/service-single/${similar_item.id}`}
                      className="title"
                    >
                      {similar_item.title}
                    </Link>
                    <p className="desp">{similar_item.description}</p>
                    <MoreBtn
                      to={`/service-single/${similar_item.id}`}
                      className="more-btn"
                    >
                      VER MÁS
                    </MoreBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesDetailContent;
