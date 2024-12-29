import { useAuth0 } from "@auth0/auth0-react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const client = useStreamVideoClient();
  const { user } = useAuth0();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!client || !user) return;
      setIsLoading(true);

      try {
        const { calls: fetchedCalls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.sub.replace(/[^a-z0-9@_-]/gi, "_") },
              { members: { $in: [user.sub.replace(/[^a-z0-9@_-]/gi, "_")] } },
            ],
          },
          limit: 100,
          watch: true,
        });

        setCalls(fetchedCalls);
      } catch (error) {
        console.error("Failed to fetch calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalls();
  }, [client, user]);

  const now = new Date().toISOString();

  const endedCalls = calls.filter(({ state }) => {
    const startsAt = state?.startsAt
      ? new Date(state.startsAt).toISOString()
      : null;
    const endedAt = state?.endedAt
      ? new Date(state.endedAt).toISOString()
      : null;

    return (startsAt && startsAt < now) || (endedAt && endedAt < now);
  });

  const upcomingCalls = calls.filter(({ state }) => {
    const startsAt = state?.startsAt
      ? new Date(state.startsAt).toISOString()
      : null;

    return startsAt && startsAt > now;
  });

  // useEffect(() => {
  //   const getRecord = async () => {
  //     try {
  //       const responses = [];
  //       for (const meeting of calls) {
  //         const response = await meeting.queryRecordings(); // Wait for each request
  //         responses.push(response);
  //       }
  //       console.log(responses);
  //     } catch (error) {
  //       console.error("Error fetching recordings:", error);
  //     }
  //   };

  //   getRecord();
  // }, [calls]);

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
