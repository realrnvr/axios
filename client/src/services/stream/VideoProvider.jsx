import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import axios from "axios";
import PropTypes from "prop-types";
import CustomLoader from "@/components/customLoader/CustomLoader";

const apiKey = import.meta.env.VITE_STREAM_API_KEY || "3ua7rmk2epdb";

const VideoProvider = ({ children }) => {
  const { user, isLoading } = useAuth0();
  const [client, setClient] = useState();

  useEffect(() => {
    if (isLoading || !user) return;

    const sanitizedId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");

    const tokenProvider = async () => {
      try {
        const response = await axios.get(
          `https://enteract-video.vercel.app/api/v1/stream/token-provider/${sanitizedId}`
        );

        const { token } = response.data;
        if (!token) {
          throw new Error("Token is missing in the response");
        }

        return token;
      } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
      }
    };

    const myClient = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: {
        id: sanitizedId,
        name: user.name || user.nickname,
        image: user.picture || "https://via.placeholder.com/150",
      },
      tokenProvider,
    });

    setClient(myClient);

    return () => {
      if (myClient) {
        myClient.disconnectUser();
        setClient(undefined);
      }
    };
  }, [isLoading, user]);

  if (!client && user) return <CustomLoader />;

  return <StreamVideo client={client}>{children}</StreamVideo>;
};

VideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VideoProvider;
