import { useState, useEffect } from "react";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import PersonDetails from "../componentes/Equipe/DetalhesPessoa";
import MemberCard from "../componentes/Equipe/CartaoMembro";

import membersDataFallback from "../dadosJson/dadosMembrosEquipe.json";
import { servicioContenido } from "../servicios/servicioContenido";

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
      <div className="mx-auto max-w-7xl px-4">
        <div className="all-members">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
