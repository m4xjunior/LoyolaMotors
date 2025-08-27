import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const TeamCard = ({ member, delay }) => {
  return (
    <div className="col">
      <div
        className="team-card ak-bg"
        data-aos="fade-up"
        data-aos-delay={delay}
      >
        <img src={member.image} className="team-img" alt={member.name} />
        <div className="team-style-1">
          <div className="team-info">
            <div className="team-title">
              <Link to={`/team-member/${member.id}`}>{member.name}</Link>
              <p className="desp">{member.title}</p>
            </div>
            <div className="team-info-social">
              <Link href={member.socialLinks.linkedin} className="icon">
                <img src="/assets/img/icon/linkedinicon.svg" alt="LinkedIn" />
              </Link>
              <Link to={member.socialLinks.facebook} className="icon">
                <img src="/assets/img/icon/facebookicon.svg" alt="Facebook" />
              </Link>
              <Link to={member.socialLinks.twitter} className="icon">
                <img src="/assets/img/icon/twittericon.svg" alt="Twitter" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TeamCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    socialLinks: PropTypes.shape({
      linkedin: PropTypes.string,
      facebook: PropTypes.string,
      twitter: PropTypes.string,
    }),
  }).isRequired,
  delay: PropTypes.string,
};

export default TeamCard;
