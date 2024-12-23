import React, { useState, useEffect } from "react";
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

import { useAuth0 } from "@auth0/auth0-react";
import { useChat } from "../../services/chat/chatProvider";

import "./chat.css";

const apiKey = "az7swwjyh7mr";
const options = { presence: true, state: true };
const sort = { last_message_at: -1 };

export default function Chat_Layout() {
  const { user, isLoading } = useAuth0();
  const [newChannelName, setNewChannelName] = useState("");
  const [availableChannels, setAvailableChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null); 
  const userId = user.sub.replace(/[^a-z0-9@_-]/gi, "_");
  const token = useChat();

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

 
  const joinChannel = async (channelId) => {
    try {
      const channel = client.channel("messaging", channelId);
      await channel.addMembers([userId]);
      setActiveChannel(channel); 
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <Chat client={client} theme="str-chat__theme-dark">
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{ width: "300px", padding: "10px", borderRight: "1px solid gray" }}>
          {/* Input  */}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Enter channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              style={{ width: "80%", padding: "5px" }}
            />
            <button onClick={createChannel} style={{ padding: "5px" }}>
              Create
            </button>
          </div>
          {/* all Available Channels */}
          <div>
            <h3>Available Channels</h3>
            {availableChannels.length > 0 ? (
              availableChannels.map((channel) => (
                <div
                  key={channel.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span>{channel.data.name || channel.id}</span>
                  <button
                    onClick={() => joinChannel(channel.id)}
                    style={{ padding: "5px" }}
                  >
                    Join
                  </button>
                </div>
              ))
            ) : (
              <p>No channels available</p>
            )}
          </div>
        </div>
        {/* to replace it by channel list*/}
        <div style={{ flexGrow: 1 }}>
          {activeChannel ? (
            <Channel channel={activeChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          ) : (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h2>Select or Create a Channel to Start Chatting</h2>
            </div>
          )}
        </div>
      </div>
    </Chat>
  );
}
