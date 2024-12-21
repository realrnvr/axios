import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  ChannelList
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
const apiKey = "az7swwjyh7mr";

const user = {
  id: "rushi",
  name: "rushi",
  image:
    "https://archive.org/download/whatsapp-smiling-guy-i-accidentally-made/whatsapp%20generic%20person%20dark.jpg",
};

export default function Chat_Layout() {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(user, chatClient.devToken(user.id));
      const channel = chatClient.channel("messaging", "testing", {
        image: "",
        name: "messaging-testing",
        members: [user.id],
      });
      await channel.watch();
      setClient(chatClient);
    }
    init();
    if (client) return () => client.disconnectUser();
  }, []);
  if (!client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme="messaging dark">
        <ChannelList/>
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
