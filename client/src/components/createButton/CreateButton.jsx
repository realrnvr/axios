import PropTypes from "prop-types";
import "./create-button.css";

const CreateButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="hero__card">
      <figure>
        <svg fill="currentColor" viewBox="0 0 16 16" className="hero__svg">
          <path
            fillRule="evenodd"
            d="M0 5a2 2 0 012-2h7.5a2 2 0 011.983 1.738l3.11-1.382A1 1 0 0116 4.269v7.462a1 1 0 01-1.406.913l-3.111-1.382A2 2 0 019.5 13H2a2 2 0 01-2-2V5z"
          />
        </svg>
      </figure>
      <figcaption  className="hero__caption">Create</figcaption>
    </button>
  );
};

CreateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CreateButton;
