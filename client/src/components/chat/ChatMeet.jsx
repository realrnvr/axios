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
import { MessageCircle, Users, AlertCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useChat } from "../../services/chat/ChatProvider";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "../customLoader/CustomLoader";
import PropTypes from "prop-types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const apiKey = "az7swwjyh7mr";
const chatClient = StreamChat.getInstance(apiKey);

const ChatMeet = ({ meetingId }) => {
  const { user } = useAuth0();
  const chatToken = useChat();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [error, setError] = useState(null);
  const userId = user?.sub?.replace(/[^a-z0-9@_-]/gi, "_");

  useEffect(() => {
    const initializeChat = async () => {
      if (!userId || !chatToken) {
        setError("Unable to initialize chat: missing credentials");
        return;
      }

      setLoading(true);
      try {
        await chatClient.connectUser(
          {
            id: userId,
            name: user?.name || userId,
            image: user?.picture,
          },
          chatToken
        );

        const channelId = `${meetingId.toLowerCase().replace(/\s/g, "-")}`;
        const channel = chatClient.channel("messaging", channelId, {
          name: `Meeting: ${meetingId}`,
          members: [userId],
        });

        await channel.watch();
        setChannel(channel);
        setError(null);
      } catch (error) {
        setError("Failed to initialize chat. Please try again.");
        toast({
          title: "Chat Error",
          description: "Failed to initialize chat. Please try again.",
          variant: "destructive",
        });
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
    return (
      <div className="h-full flex items-center justify-center bg-neutral-800">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-800 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-800">
      {channel ? (
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-white">Meeting Chat</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <MessageList
                className="bg-neutral-950"
                highlightUnreadMessages
                messageActions={["edit", "delete", "react", "reply"]}
              />
              <MessageInput 
                focus 
                className="border-t border-neutral-800 bg-neutral-900"
                attachButton={false}
              />
            </Window>
            <Thread fullWidth />
          </Channel>
        </Chat>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-neutral-400 gap-2">
          <AlertCircle className="h-8 w-8 text-neutral-500" />
          <p>Failed to load chat</p>
        </div>
      )}
    </div>
  );
};

ChatMeet.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default ChatMeet;