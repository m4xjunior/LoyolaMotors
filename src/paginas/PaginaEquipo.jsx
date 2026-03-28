<<<<<<<< HEAD:src/paginas/PaginaEquipo.jsx
import { useState, useEffect } from "react";
import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import PersonDetails from "../components/Team/PersonDetails";
import MemberCard from "../components/Team/MemberCard";

import membersDataFallback from "../dataJson/teamMembersData.json";
import { servicioContenido } from "../servicios/servicioContenido";
========

import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import PersonDetails from "../componentes/Equipe/DetalhesPessoa";
import MemberCard from "../componentes/Equipe/CartaoMembro";

import membersData from "../dadosJson/dadosMembrosEquipe.json";
>>>>>>>> origin/main:src/paginas/Equipe.jsx

const Team = () => {
  const [membersData, setMembersData] = useState(membersDataFallback);

  useEffect(() => {
    servicioContenido.obtener('equipo').then(r => {
      if (r.length > 0) setMembersData(r);
    });
  }, []);

  return (
    <>
      <CommonPageHero title={"Equipo"} />
      <PersonDetails />
      <div className="container">
        <div className="all-members">
          <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
            {membersData?.map((member, index) => (
              <MemberCard key={index} member={member} delay={index * 50} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
