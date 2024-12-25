import { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { useAuth0 } from "@auth0/auth0-react";
import { useChat } from "../../services/chat/chatProvider";
import { Sidebar } from "lucide-react";
import "./chat.css";
import { ChatDialog } from "@/components/chat/ChatDialog";

const apiKey = "az7swwjyh7mr";
const options = { presence: true, state: true };
const sort = { last_message_at: -1 };

export default function Chat_Layout() {
  const { user} = useAuth0();
  const [newChannelName, setNewChannelName] = useState("");
  const [availableChannels, setAvailableChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const userId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");
  const token = useChat();
  const [isOpen, setIsOpen] = useState(true);
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  });

  const filters = { type: "messaging" };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channels = await client.queryChannels(filters, sort, options);
        setAvailableChannels(channels);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    if (client) fetchChannels();
  }, [client]);

  const createChannel = async () => {
    if (!newChannelName.trim()) return alert("Channel name cannot be empty");
    try {
      const channel = client.channel("messaging", newChannelName, {
        name: newChannelName,
        members: [userId],
      });
      await channel.create();
      setNewChannelName("");
      setActiveChannel(channel);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };
  if (!client) return <CustomLoader/>;

  return (
    <div className="chat-container">
      <Chat client={client} theme="str-chat__theme-dark">
        <div className={`chat-sidebar ${!isOpen ? "closed" : ""}`}>
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            {<Sidebar/>}
          </button>
          <div className="sidebar_options">
            <ChatDialog
              setActiveChannel={setActiveChannel}
              activeChannel={activeChannel}
              createChannel={createChannel}
              newChannelName={newChannelName}
              setNewChannelName={setNewChannelName}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </div>
          <div className="sidebar-channelList">
            <ChannelList />
          </div>
        </div>
        <div className="chatbox-chat">
          <Channel channel={activeChannel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput audioRecordingEnabled />
            </Window>
            <Thread />
          </Channel>
        </div>
      </Chat>
    </div>
  );
}
