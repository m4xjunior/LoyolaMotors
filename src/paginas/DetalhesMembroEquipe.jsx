import { useParams } from "react-router-dom";

import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import SingleTeamMemberDetails from "../componentes/Equipe/DetalhesMembroEquipe";
import TeamDetailsSlider from "../componentes/Equipe/CarrosselDetalhesEquipe";

import membersData from "../dadosJson/dadosMembrosEquipe.json";
import SpecialistTeamMembers from "../componentes/Equipe/MembrosEspecialistas";

const TeamMemberDetails = () => {
  const { teamId } = useParams();
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
