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
  useChat,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "@/components/customLoader/CustomLoader";
import { useAuth0 } from "@auth0/auth0-react";
import { Sidebar } from "lucide-react";
import "./chat.css";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { Button } from "@/components/ui/button";

const apiKey = "az7swwjyh7mr";
const chatClient = StreamChat.getInstance(apiKey);

export default function ChatLayout() {
  const { user, isLoading: isAuthLoading } = useAuth0();
  const [newChannelName, setNewChannelName] = useState("");
  const [clientReady, setClientReady] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const token = useChat();

  const userId = user?.sub?.replace(/[^a-z0-9@_-]/gi, "_");

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!userId || !token) return;

        await chatClient.connectUser(
          {
            id: userId,
            name: user?.name || userId,
            image: user?.picture,
          },
          token
        );
        console.log(token);

        setClientReady(true);
      } catch (error) {
        console.error("Error connecting user:", error);
        toast({
          title: "Failed to connect to chat",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    if (token && userId && !clientReady) {
      initChat();
    }

    return () => {
      if (clientReady) {
        chatClient.disconnectUser();
        setClientReady(false);
      }
    };
  }, [token, userId, user, clientReady]);

  const createChannel = async () => {
    if (!newChannelName.trim()) {
      toast({
        title: "Invalid channel name",
        description: "Channel name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const channelId = `${newChannelName
        .toLowerCase()
        .replace(/\s/g, "-")}-${Date.now()}`;
      const channel = chatClient.channel("messaging", channelId, {
        name: newChannelName,
        created_by_id: userId,
        members: [userId],
      });

      await channel.create();
      await channel.addMembers([userId]);

      setNewChannelName("");

      toast({
        title: "Channel created",
        description: `${newChannelName} has been created successfully`,
      });
    } catch (error) {
      console.error("Error creating channel:", error);
      toast({
        title: "Failed to create channel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteChannel = async () => {
    try {
      const channel = chatClient.activeChannels;
      if (!channel) {
        toast({
          title: "No channel selected",
          description: "Please select a channel to delete",
          variant: "destructive",
        });
        return;
      }

      await channel.delete();

      toast({
        title: "Channel deleted",
        description: "Channel has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast({
        title: "Failed to delete channel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isAuthLoading || !clientReady || !token) return <CustomLoader />;

  return (
    <div className="chat-container">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <div className={`chat-sidebar ${!isOpen ? "closed" : ""}`}>
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Sidebar />
          </button>
          <div className="sidebar_options">
            <ChatDialog
              createChannel={createChannel}
              newChannelName={newChannelName}
              setNewChannelName={setNewChannelName}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </div>
          <div className="sidebar-channelList">
            <ChannelList sort={{ last_message_at: -1 }} showChannelSearch />
          </div>
        </div>
        <div className="chatbox-chat">
          <Channel>
            <Window>
              <ChannelHeader />
              <Button variant="destructive" onClick={deleteChannel}>
                Delete
              </Button>
              <MessageList />
              <MessageInput focus audioRecordingEnabled />
            </Window>
            <Thread />
          </Channel>
        </div>
      </Chat>
    </div>
  );
}
