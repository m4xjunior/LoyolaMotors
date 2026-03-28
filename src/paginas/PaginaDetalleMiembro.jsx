import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CommonPageHero from "../components/CommonPageHero/CommonPageHero";
import SingleTeamMemberDetails from "../components/Team/SingleTeamMemberDetails";
import TeamDetailsSlider from "../components/Team/TeamDetailsSlider";

import membersDataFallback from "../dataJson/teamMembersData.json";
import SpecialistTeamMembers from "../components/Team/SpecialistTeamMembers";
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
