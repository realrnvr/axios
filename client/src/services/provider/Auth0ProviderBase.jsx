import { Auth0Provider } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const Auth0ProviderBase = ({ children }) => {
  return (
    <Auth0Provider
      domain={
        import.meta.VITE_AUTH0_DOMAIN || "dev-riaw1h1kzszelhv5.us.auth0.com"
      }
      clientId={
        import.meta.VITE_AUTH0_CLIENT_ID || "w5dAqh53hZqBrhmIIwytz4Sr9eSF3AR8"
      }
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

Auth0ProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Auth0ProviderBase;
