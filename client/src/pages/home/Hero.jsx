import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const { user, logout } = useAuth0();
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      hello {user.name}
      <div className="ml-6">
        <Button
          variant="secondary"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Hero;
