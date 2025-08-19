import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination } from "swiper/modules";
import { ButtonCommon } from "../Button/Button";
import { Link } from "react-router-dom";

const sliderData = [
  {
    id: 1,
    title: "Taller de Chapa y Pintura en Valencia",
    maintitle: "Transformamos tu coche en 24h",
    desp: "Más de 20 años de experiencia, garantía de 1 año y precios 15% más baratos. Presupuesto gratuito.",
    url: "tel:+34640162947",
    img: "/assets/img/hero/hero_slider_bg_1.png",
    alt: "Coche de lujo siendo reparado en taller de chapa y pintura Loyola Motors en Valencia",
  },
  {
    id: 2,
    title: "900 Reseñas de 5 Estrellas",
    maintitle: "Confianza y Calidad Garantizada",
    desp: "Clientes satisfechos nos avalan. Atendemos solo 15 coches al mes para máxima dedicación.",
    url: "tel:+34640162947",
    img: "/assets/img/hero/hero_slider_bg_2.png",
    alt: "Cliente satisfecho recibiendo su coche reparado en Loyola Motors",
  },
  {
    id: 3,
    title: "Presupuesto de Pintura de Coche",
    maintitle: "Ahorra hasta un 25%",
    desp: "Compara nuestros precios transparentes y ahorra. Presupuesto detallado en menos de 30 minutos.",
    url: "tel:+34640162947",
    img: "/assets/img/hero/hero_slider_bg_1.png",
    alt: "Mecánico de Loyola Motors preparando presupuesto para pintura de coche",
  },
];

const HeroSlider = () => {
  const swiperRef = useRef(null);
  return (
    <section className="ak-slider ak-slider-hero-1">
      <Swiper
        speed={1000}
        loop={true}
        slidesPerView={"auto"}
        parallax={true}
        pagination={{
          clickable: true,
          el: ".hero-swiper-pagination",
          renderBullet: function (index, className) {
            return '<p className="' + className + '">' + (index + 1) + "</p>";
          },
        }}
        modules={[Parallax, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {sliderData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="ak-hero ak-style1 slide-inner">
              <img
                src={item.img}
                className="ak-hero-bg ak-bg object-cover"
                alt={item.alt}
              />
              <div className="container">
                <div className="hero-slider-info">
                  <div className="slider-info">
                    <div className="hero-title">
                      <h1
                        className="hero-main-title"
                        data-swiper-parallax="300"
                      >
                        {item.title}
                      </h1>
                      <h1
                        className="hero-main-title-1 style-2"
                        data-swiper-parallax="100"
                      >
                        {item.maintitle}
                      </h1>
                      <p className="mini-title" data-swiper-parallax="400">
                        {item.desp}
                      </p>
                    </div>
                    <div className="ak-height-45 ak-height-lg-30"></div>
                    <div data-swiper-parallax="300">
                      <ButtonCommon to={item.url}>Llama ahora +34 640 16 29 47</ButtonCommon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="ak-swiper-controll-hero-1">
        <div className="ak-swiper-navigation-wrap">
          <div className="ak-swiper-button-prev">
            <div
              className="hero-swiper-prev"
              onClick={() => swiperRef.current.slideNext()}
            >
              <div className="btn-cricle ak-white-bg-1"></div>
              <div className="btn-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="41"
                  viewBox="0 0 29 41"
                  fill="none"
                >
                  <path
                    d="M1.82581 20.0839L7.72307 14.1866C7.93491 13.9392 8.3072 13.9104 8.55457 14.1223C8.80194 14.3341 8.83078 14.7064 8.61889 14.9538C8.59912 14.9769 8.57763 14.9984 8.55457 15.0181L3.66574 19.9129H20.0831C20.4088 19.9129 20.6729 20.1769 20.6729 20.5026C20.6729 20.8284 20.4088 21.0924 20.0831 21.0924H3.66574L8.55457 25.9812C8.80194 26.193 8.83078 26.5653 8.61889 26.8127C8.40699 27.0601 8.03475 27.0889 7.78738 26.877C7.76432 26.8572 7.74278 26.8358 7.72307 26.8127L1.82575 20.9154C1.59714 20.6854 1.59714 20.314 1.82581 20.0839Z"
                    fill="#fff"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="ak-swiper-button-next">
            <div
              className="hero-swiper-next"
              onClick={() => swiperRef.current.slidePrev()}
            >
              <div className="btn-cricle ak-white-bg-1"></div>
              <div className="btn-arrow ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="41"
                  viewBox="0 0 29 41"
                  fill="none"
                >
                  <path
                    d="M20.5013 20.0839L14.6041 14.1866C14.3922 13.9392 14.0199 13.9104 13.7726 14.1223C13.5252 14.3341 13.4964 14.7064 13.7083 14.9538C13.728 14.9769 13.7495 14.9984 13.7726 15.0181L18.6614 19.9129H2.24401C1.91834 19.9129 1.6543 20.1769 1.6543 20.5026C1.6543 20.8284 1.91834 21.0924 2.24401 21.0924H18.6614L13.7726 25.9812C13.5252 26.193 13.4964 26.5653 13.7083 26.8127C13.9202 27.0601 14.2924 27.0889 14.5398 26.877C14.5628 26.8572 14.5844 26.8358 14.6041 26.8127L20.5014 20.9154C20.73 20.6854 20.73 20.314 20.5013 20.0839Z"
                    fill="#fff"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="hero-contact-info">
          <Link to="tel:+34640162947">
            <div className="d-flex align-items-center gap-2">
              <div className="heartbeat-icon">
                <img src="/assets/img/icon/phone.svg" alt="..." />
              </div>
              <p className="ak-font-18 ak-white-color ak-semi-bold">
                +34 640 16 29 47
              </p>
            </div>
          </Link>
          <Link to="#">
            <div className="d-flex align-items-center gap-2">
              <div className="heartbeat-icon">
                <img src="/assets/img/icon/heroaddress.svg" alt="..." />
              </div>
              <p className="ak-font-18 ak-white-color ak-semi-bold">
                C/ Sant Ignasi de Loiola, 21-BJ IZ, 46008 Valencia, España
              </p>
            </div>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <div className="heartbeat-icon">
              <img src="/assets/img/icon/hero-time.svg" alt="..." />
            </div>
            <p className="ak-font-18 ak-white-color ak-semi-bold">
              Lun - Vie: 9:00 - 18:00
            </p>
          </div>
        </div>
      </div>
      <div className="hero-pagination">
        <div className="hero-swiper-pagination"></div>
      </div>
      <div className="social-hero">
        <Link to="https://www.x.com/" className="social-icon1">
          <img src="/assets/img/icon/twiter.svg" alt="twitericon" />
        </Link>
        <Link to="https://www.facebook.com/" className="social-icon1">
          <img src="/assets/img/icon/facebook.svg" alt="twitericon" />
        </Link>
        <Link to="https://www.linkedin.com/" className="social-icon1">
          <img src="/assets/img/icon/linkedin.svg" alt="twitericon" />
        </Link>
        <div className="social-horizontal"></div>
        <h6 className="social-link">SÍGUENOS</h6>
      </div>
    </section>
  );
};

export default HeroSlider;
