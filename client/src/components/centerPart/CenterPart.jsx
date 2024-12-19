import "./center-part.css";
import { useAuth0 } from "@auth0/auth0-react";

const CenterPart = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="centerpart | container">
      <div className="centerpart__text">
        <p className="centerpart__intro">Welcome to</p>
        <h2 className="centerpart__title">
          <strong className="text-gradient--clr-blue">Enter</strong>
          Act.
        </h2>
        <p className="centerpart__description">
          Bring people together with effortless meetings. Connect, collaborate,
          and make every interaction meaningful!
        </p>
        <button className="centerpart__btn" onClick={() => loginWithRedirect()}>
          Get Started
        </button>
        <img
          className="centerpart__img centerpart__img--p-1"
          src="/pre-1.svg"
          alt=""
        />
        <img
          className="centerpart__img centerpart__img--p-2"
          src="/pre-2.svg"
          alt=""
        />
        <img
          className="centerpart__img centerpart__img--p-3"
          src="/pre-3.svg"
          alt=""
        />
        <img
          className="centerpart__img centerpart__img--p-4"
          src="/pre-4.svg"
          alt=""
        />
      </div>
    </div>
  );
};

export default CenterPart;
