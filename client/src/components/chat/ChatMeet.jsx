import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { MessageCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useChat } from "../../services/chat/ChatProvider";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "../customLoader/CustomLoader";
import PropTypes from "prop-types";

const apiKey = "az7swwjyh7mr";
const chatClient = StreamChat.getInstance(apiKey);

const ChatMeet = ({ meetingId }) => {
  const { user } = useAuth0();
  const chatToken = useChat();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const userId = user?.sub?.replace(/[^a-z0-9@_-]/gi, "_");

  useEffect(() => {
    const initializeChat = async () => {
      if (!userId || !chatToken) {
        console.error("User ID or chat token missing:", { userId, chatToken });
        return;
      }

      setLoading(true);
      try {
        console.log("Connecting user with token:", chatToken);

        await chatClient.connectUser(
          {
            id: userId,
            name: user?.name || userId,
            image: user?.picture,
          },
          chatToken
        );

        console.log("User connected:", userId);

        const channelId = `${meetingId.toLowerCase().replace(/\s/g, "-")}`;
        const channel = chatClient.channel("messaging", channelId, {
          name: `Meeting: ${meetingId}`,
          members: [userId],
        });

        await channel.watch();
        setChannel(channel);
      } catch (error) {
        toast({
          title: "Chat Error",
          description: "Failed to initialize chat. Please try again.",
          variant: "destructive",
        });
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatToken && userId && !isClientReady) {
      initializeChat();
    }

    return () => {
      if (isClientReady) {
        chatClient.disconnectUser();
        setIsClientReady(false);
      }
    };
  }, [chatToken, userId, meetingId, user?.name, user?.picture, isClientReady]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {channel ? (
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="p-2 border-b flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Meeting Chat</span>
              </div>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Failed to load chat</p>
        </div>
      )}
    </div>
  );
};

ChatMeet.propTypes = {
  meetingId: PropTypes.string,
};

export default ChatMeet;
