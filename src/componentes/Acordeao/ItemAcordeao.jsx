import PropTypes from "prop-types";

const AccordionItem = ({ title, content, isOpen, onToggle, index }) => {
  return (
    <div className="ak-accordion-item" data-aos="fade-up">
      <div
        className={`ak-accordion-title ${isOpen ? "active" : ""}`}
        onClick={() => onToggle(index)}
      >
        <h6>{title}</h6>
      </div>
      {isOpen && <div className="ak-accordion-tab">{content}</div>}
    </div>
  );
};

export default AccordionItem;

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
