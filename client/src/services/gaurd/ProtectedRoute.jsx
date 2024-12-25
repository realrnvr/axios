import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import CustomLoader from "@/components/customLoader/CustomLoader";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <CustomLoader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

export default ProtectedRoute;
