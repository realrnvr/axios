
import { useEffect } from "react";
import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput, Thread, LoadingIndicator, ChannelList } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "./chat.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useChat } from "../../services/chat/chatProvider";

export default function Chat_Layout() {
  const { client } = useChat(); 
  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!client || isLoading || !user) return;

    const initializeChannel = async () => {
      try {
        const sanitizedId = user.name?.replace(/[^a-z0-9@_-]/gi, "_") || "Guest";
        const channel = client.channel("messaging", "testing", {
          name: "messaging-testing",
          members: [sanitizedId],
        });

        await channel.watch();
      } catch (error) {
        console.error("Error initializing channel:", error);
      }
    };

    initializeChannel();

    return () => {
      // Cleanup logic to be added
    };
  }, [client, user, isLoading]);

  if (!client) return <LoadingIndicator />;

  return (
    <div className="window">
      <Chat client={client} theme="str-chat__theme-dark">
        <ChannelList />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
