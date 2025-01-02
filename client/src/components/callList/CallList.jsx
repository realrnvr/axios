import "./call-list.css";
import { useGetCalls } from "@/hooks/useGetCalls";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../customLoader/CustomLoader";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

const CallList = ({ type }) => {
  const { endedCalls, upcomingCalls, isLoading } = useGetCalls();

  const navigate = useNavigate();

  // select data based on 'type'
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return upcomingCalls;
      default:
        return [];
    }
  };

  // fallback message based on 'type'
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  const calls = getCalls(); // Corrected to use getCalls without parameters
  const NoCallsMessage = getNoCallsMessage();

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <article className="call__container">
      {calls && calls.length > 0 ? (
        calls.map((meeting, idx) => {
          return (
            <div key={idx} className="meeting__card">
              <p>id: {meeting?.id}</p>
              <p>title: {meeting?.state?.custom?.description || "----"}</p>
              <p>
                date:{" "}
                {new Date(meeting?.state?.startsAt).toLocaleString() ||
                  new Date(meeting?.start_time).toLocaleString()}
              </p>
              <div>
                {type !== "ended" && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `http://localhost:5173/meeting/${meeting?.id}`
                      );
                      toast({ title: "copied!" });
                    }}
                  >
                    Copy link
                  </Button>
                )}
                {type === "recordings" && (
                  <Button variant="secondary">Play</Button>
                )}
                {type === "recordings" ? (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/${meeting?.url}`)}
                  >
                    Play
                  </Button>
                ) : type === "ended" ? null : (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/meeting/${meeting?.id}`)}
                  >
                    Start
                  </Button>
                )}
                <p>
                  {type === "recordings"
                    ? meeting?.url
                    : type === "ended"
                    ? null
                    : `http://localhost:5173/meeting/${meeting?.id}`}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <h2>{NoCallsMessage}</h2>
      )}
    </article>
  );
};

CallList.propTypes = {
  type: PropTypes.string,
};

export default CallList;
