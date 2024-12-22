import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import PropTypes from "prop-types";

const apiKey = "az7swwjyh7mr";
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
    const [client, setClient] = useState();

    useEffect(() => {
        if (isLoading || !user) return;
        console.log(user);
        const sanitizedId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");

        const initializeChatClient = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/chat/chat-token/${sanitizedId}`
                );
                const { token } = response.data;
                console.log(token);
                if (!token) {
                    throw new Error("Token is missing in the response");
                }

                const chatClient = StreamChat.getInstance(apiKey);
                await chatClient.connectUser(
                    {
                        id: sanitizedId,
                        name: user.name || user.nickname,
                        image: user.picture || "https://via.placeholder.com/150",
                    },
                    token
                );

                setClient(chatClient);
            } catch (error) {
                console.error("Error initializing chat client:", error);
            }
        };

        initializeChatClient();

        return () => {
            if (client) {
                client.disconnectUser();
                setClient(undefined);
            }
        };
    }, [isLoading, user ,client]);

    if (!client) return <div>Loading...</div>;

    return <ChatContext.Provider value={{ client }}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatProvider;
