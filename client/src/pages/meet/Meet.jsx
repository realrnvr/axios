import { useAuth0 } from "@auth0/auth0-react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Meet = () => {
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
  });
  const [callDetails, setCallDetails] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false); // Track client readiness
  const { toast } = useToast();

  const navigate = useNavigate();
  const { user, isLoading } = useAuth0();
  const client = useStreamVideoClient();

  // Wait until the client is ready
  useEffect(() => {
    if (!isLoading && client) {
      setIsClientReady(true); // Mark client as ready when available
    }
  }, [client, isLoading]);

  const createMeeting = async () => {
    if (!isClientReady || !user) {
      console.error("Client not ready or user not authenticated");
      return;
    }

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const callId = crypto.randomUUID(); // Generate random call ID
      const call = client.call("default", callId); // Create a call instance

      if (!call) {
        throw new Error("Failed to create call");
      }

      const startsAt =
        values.dateTime.toISOString() || new Date().toISOString();
      const description = values.description || "Instant meeting";

      // Create the call with metadata
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });

      setCallDetails(call); // Store call details if needed later
      navigate(`/meeting/${call.id}`); // Redirect to meeting
      toast({ title: "Meeting created" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  if (!isClientReady) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={createMeeting}>Create Meeting</button>
    </div>
  );
};

export default Meet;
