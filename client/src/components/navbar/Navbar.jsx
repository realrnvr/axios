import "./navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="navbar_container | container">
      <div className="navbar">
        <div className="logo">
          <strong className="text-gradient--clr-blue">Enter</strong>Act
        </div>
        <div className="navbar_buttons">
          <Button
            variant="secondary"
            onClick={() => {
              loginWithRedirect();
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
