import { useState, useEffect } from "react";
import SectionHeading from "../TituloSecao/TituloSecao";
import { MoreBtn } from "../Botao/Botao";
import TeamCard from "./CartaoEquipe";
import { servicioContenido } from "../../servicios/servicioContenido";

const MEMBERS_POR_DEFECTO = [
  {
    id: 1,
    name: "Darrell T. Beedle",
    title: "Lead Mechanic",
    image: "/assets/img/member/member_1.jpg",
    desp: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form injected humour, or randomised. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form injected humour, or randomised.",
    socialLinks: {
      linkedin: "https://www.facebook.com/",
      facebook: "https://bd.linkedin.com/",
      twitter: "https://www.instagram.com/",
    },
    contact: {
      address: "2118 Thornridge Cir, 35624",
      email: "example@example.com",
      phone: "+7 (903) 679-96-15",
      website: "www.website.com",
    },
  },
  {
    id: 2,
    name: "Michael Jack",
    title: "Service Advisor",
    image: "/assets/img/member/member_2.jpg",
    desp: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    socialLinks: {
      linkedin: "https://www.facebook.com/",
      facebook: "https://bd.linkedin.com/",
      twitter: "https://www.instagram.com/",
    },
    contact: {
      address: "2118 Thornridge Cir, 35624",
      email: "example@example.com",
      phone: "+7 (903) 679-96-15",
      website: "www.website.com",
    },
  },
  {
    id: 3,
    name: "Cathy Sparkman",
    title: "Diagnostic Technician",
    image: "/assets/img/member/member_3.jpg",
    desp: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    socialLinks: {
      linkedin: "https://www.facebook.com/",
      facebook: "https://bd.linkedin.com/",
      twitter: "https://www.instagram.com/",
    },
    contact: {
      address: "2118 Thornridge Cir, 35624",
      email: "example@example.com",
      phone: "+7 (903) 679-96-15",
      website: "www.website.com",
    },
  },
];

const Teams = () => {
  const [membersData, setMembersData] = useState(MEMBERS_POR_DEFECTO);

  useEffect(() => {
    servicioContenido.obtener('equipo').then(r => {
      if (r.length > 0) setMembersData(r);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-190 ak-height-lg-80"></div>
      <div className="team-contant">
        <div className="team-heading" data-aos="fade-right">
          <SectionHeading
            bgText={"Equipo"}
            title={"Nuestro equipo"}
            desp={
              "Profesionales con amplia experiencia en chapa, pintura y mecánica para cuidar tu vehículo."
            }
          />
          <div className="ak-height-50 ak-height-lg-10"></div>
          <MoreBtn to={"/team"}>VER MÁS</MoreBtn>
        </div>
        <div
          className="teams"
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="100"
          data-aos-offset="0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {membersData?.map((member, index) => (
              <TeamCard key={index} member={member} delay={index * 50} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Teams;
