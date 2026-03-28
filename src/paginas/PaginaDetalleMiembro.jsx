import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import SingleTeamMemberDetails from "../componentes/Equipe/DetalhesMembroEquipe";
import TeamDetailsSlider from "../componentes/Equipe/CarrosselDetalhesEquipe";

import membersDataFallback from "../dataJson/teamMembersData.json";
import SpecialistTeamMembers from "../componentes/Equipe/MembrosEspecialistas";
import { servicioContenido } from "../servicios/servicioContenido";

const TeamMemberDetails = () => {
  const { teamId } = useParams();
  const [membersData, setMembersData] = useState(membersDataFallback);

  useEffect(() => {
    servicioContenido.obtener('equipo').then(r => {
      if (r.length > 0) setMembersData(r);
    });
  }, []);

  const team = membersData.find((team) => team.id === parseInt(teamId));

  if (!team) {
    return <p>Miembro del equipo no encontrado</p>;
  }

  return (
    <>
      <CommonPageHero title={"TEAM PAGE"} />
      <SingleTeamMemberDetails team={team} />
      <TeamDetailsSlider />
      <SpecialistTeamMembers styleTypeTwo={true} team={team} />
    </>
  );
};

export default TeamMemberDetails;
