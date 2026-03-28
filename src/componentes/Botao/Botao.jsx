import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

export function ButtonCommon(props) {
  return (
    <Link to={props.to} className="common-btn">
      {props.children}
    </Link>
  );
}

ButtonCommon.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function MoreBtn(props) {
  return (
    <Link to={props.to} className="more-btn">
      {props.children}
    </Link>
  );
}

MoreBtn.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function CtaBtn(props) {
  return (
    <Link to={props.to} className="cta-btn">
      <img src="/assets/img/icon/phone.svg" alt="..." />
      <span className="ms-2"> {props.children}</span>
    </Link>
  );
}

CtaBtn.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
