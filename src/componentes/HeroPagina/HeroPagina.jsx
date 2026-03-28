import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CommonPageHero = ({ title }) => {
  return (
    <div className="container">
      <div className="common-page-title">
        <h3 className="page-title">{title}</h3>
        <div className="d-flex gap-2 align-items-center">
          <Link to="/">Inicio</Link>
          <p> / {title}</p>
        </div>
      </div>
      <div className="primary-color-border"></div>
    </div>
  );
};

CommonPageHero.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CommonPageHero;
