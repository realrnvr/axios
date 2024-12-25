import { useGetCalls } from "@/hooks/useGetCalls";
import PropTypes from "prop-types";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import MeetingCard from "../meetingCard/MeetingCard";

const CallList = ({ type }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const { pathname } = useLocation();
  const [recordings, setRecordings] = useState();

  const getCalls = () => {
    switch (type) {
      case "ended": {
        return endedCalls;
      }
      case "recordings": {
        return recordings;
      }
      case "upcoming": {
        return upcomingCalls;
      }
      default: {
        return [];
      }
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended": {
        return "No Previous Calls";
      }
      case "recordings": {
        return "No Recordings";
      }
      case "upcoming": {
        return "No Upcoming Calls";
      }
      default: {
        return "";
      }
    }
  };

  const calls = getCalls();

  const NoCallsMessage = getNoCallsMessage();

  return (
    <div>
      {calls && calls.length > 0 ? (
        calls.map((meeting, idx) => {
          return <MeetingCard key={idx} />;
        })
      ) : (
        <h2>{NoCallsMessage}</h2>
      )}
    </div>
  );
};

CallList.propTypes = {
  type: PropTypes.string,
};

export default CallList;
