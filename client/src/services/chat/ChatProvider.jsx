import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import PropTypes from "prop-types";

const ChatContext = createContext(null);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

const ChatProvider = ({ children }) => {
    const { user, isLoading } = useAuth0();
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (isLoading || !user) return;

        const fetchToken = async () => {
            try {
                const sanitizedId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");
                const response = await axios.get(
                    `http://localhost:3000/api/v1/chat/chat-token/${sanitizedId}`
                );
                const { token } = response.data;
                if (!token) throw new Error("Token is missing");
                setToken(token);
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        fetchToken();
    }, [isLoading, user]);

    if (!token) return <div>Loading...</div>;

    return <ChatContext.Provider value={token}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatProvider;





// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { StreamChat } from "stream-chat";
// import axios from "axios";
// import PropTypes from "prop-types";

// const apiKey = "az7swwjyh7mr";
// const ChatContext = createContext(null);

// export const useChat = () => {
//     const context = useContext(ChatContext);
//     if (!context) {
//         throw new Error("useChat must be used within a ChatProvider");
//     }
//     return context;
// };

// const ChatProvider = ({ children }) => {
//     const { user, isLoading } = useAuth0();
//     const [client, setClient] = useState(null);

//     useEffect(() => {
//         if (isLoading || !user) return;

//         const sanitizedId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");
//         console.log("Sanitized ID:", sanitizedId);

//         const tokenProvider = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:3000/api/v1/chat/chat-token/${sanitizedId}`
//                 );
//                 const { token } = response.data;
//                 console.log("Token received:", token);
//                 if (!token) throw new Error("Token is missing");
//                 return token;
//             } catch (error) {
//                 console.error("Error fetching token:", error);
//                 throw error;
//             }
//         };
      
  

   

//         return () => {
//             console.log("Cleaning up chat client...");
//             // chatClient.disconnectUser();
//             setClient(null);
//         };
//     }, [isLoading, user]);

//     if (!client) return <div>Loading...</div>;

//     return <ChatContext.Provider value={  await tokenProvider() }>{children}</ChatContext.Provider>;
// };

// ChatProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// };

// export default ChatProvider;


         // const chatClient = StreamChat.getInstance(apiKey);
     // const connectUser = async () => {
        //     try {
        //         await chatClient.connectUser(
        //             {
        //                 id: sanitizedId,
        //                 name: user.name || user.nickname,
        //                 image: user.picture || "https://via.placeholder.com/150",
        //             },
        //             await tokenProvider()
        //         );
        //         console.log("Chat client connected");
        //         setClient(chatClient);
        //     } catch (error) {
        //         console.error("Error connecting user:", error);
        //     }
        // };

        // connectUser();