import "./navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const spareImage="https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3F832b_sebiBjhpzoFzXdy&ust=1735057278449000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiaxpGmvooDFQAAAAAdAAAAABAE" ;
  
  return (
    <div className="navbar_container | container">
      <div className="navbar">
        <div className="logo">
          <strong className="text-gradient--clr-blue">Enter</strong>Act
        </div>
        <div className="navbar_buttons">
        {isAuthenticated && user?.picture && (
            <img
              src={user.picture || spareImage}
              alt="Profile"
              className="navbar_user_pic"
            />
          )}
          <Button
            variant="secondary"
            onClick={() => {
              isAuthenticated ? logout() : loginWithRedirect();
            }}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
