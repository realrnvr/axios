import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./chat.css"
import { useAuth0 } from "@auth0/auth0-react";

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

// MOVE IT TO ENV FILE
const apiKey = "az7swwjyh7mr";

// TEMP USER
const tempUser = {
  id: "rushi",
  name: "rushi",
  image:
    "https://archive.org/download/whatsapp-smiling-guy-i-accidentally-made/whatsapp%20generic%20person%20dark.jpg",
};

export default function Chat_Layout() {
  const { user,isLoading} = useAuth0();
  const [client, setClient] = useState(null);

  useEffect(() => {  
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);
  
      // const tempUser = {
      //   id: user?.name || "Guest",
      //   name: user?.name || "Guest",
      //   image: user?.picture ||  "https://archive.org/download/whatsapp-smiling-guy-i-accidentally-made/whatsapp%20generic%20person%20dark.jpg" ,
      // };
  
      await chatClient.connectUser(
        tempUser,
        chatClient.devToken(tempUser.id)
      );
      
      const channel = chatClient.channel("messaging", "testing", {
        image: "",
        name: "messaging-testing",
        members: [tempUser.id],
      });
  
      await channel.watch();
      setClient(chatClient);
    }
  
    init();
  
    return () => client?.disconnectUser();
  }, []);
  
  if (!client) return <LoadingIndicator />;

  return (
    <div className="window">
  <Chat client={client} theme="str-chat__theme-dark">
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
    </div>
  );
}
