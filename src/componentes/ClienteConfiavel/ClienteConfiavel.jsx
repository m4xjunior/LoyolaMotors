import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { servicioContenido } from "../../servicios/servicioContenido";

const DATOS_POR_DEFECTO = [
  { id: 1, imagenUrl: "/assets/img/client/trusted-client_1.png", nombre: "Cliente 1" },
  { id: 2, imagenUrl: "/assets/img/client/trusted-client_2.png", nombre: "Cliente 2" },
  { id: 3, imagenUrl: "/assets/img/client/trusted-client_3.png", nombre: "Cliente 3" },
  { id: 4, imagenUrl: "/assets/img/client/trusted-client_4.png", nombre: "Cliente 4" },
  { id: 5, imagenUrl: "/assets/img/client/trusted-client_5.png", nombre: "Cliente 5" },
  { id: 6, imagenUrl: "/assets/img/client/trusted-client_6.png", nombre: "Cliente 6" },
  { id: 7, imagenUrl: "/assets/img/client/trusted-client_7.png", nombre: "Cliente 7" },
  { id: 8, imagenUrl: "/assets/img/client/trusted-client_1.png", nombre: "Cliente 8" },
  { id: 9, imagenUrl: "/assets/img/client/trusted-client_2.png", nombre: "Cliente 9" },
  { id: 10, imagenUrl: "/assets/img/client/trusted-client_3.png", nombre: "Cliente 10" },
];

const TrustedClient = () => {
  const swiperRef = useRef(null);
  const [datos, setDatos] = useState(DATOS_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('logosClientes', { orden: true }).then(r => {
      if (r.length > 0) setDatos(r);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="ak-slider ak-trusted-client-slider">
        <h4 className="title">Trusted Client</h4>
        <Swiper
          speed={1000}
          loop={true}
          slidesPerView={"auto"}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {datos.map((item, i) => (
            <SwiperSlide key={item.id || i}>
              <div className="trusted-client">
                <img src={item.imagenUrl} alt={item.nombre || ""} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TrustedClient;
