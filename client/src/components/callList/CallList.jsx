import "./call-list.css";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import CustomLoader from "../customLoader/CustomLoader";
import PropTypes from "prop-types";
import { Copy } from "lucide-react";

const CallList = ({ type }) => {
  const { endedCalls, upcomingCalls, isLoading } = useGetCalls();

  const navigate = useNavigate();

  // select data based on 'type'
  const getCalls = (type) => {
    switch (type) {
      case "ended":
        return endedCalls();
      case "upcoming":
        return upcomingCalls();
      default:
        return [];
    }
  };

  // fallback message based on 'type'
  const getNoCallsMessage = (type) => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  const calls = getCalls(type); // Corrected to use getCalls without parameters
  const NoCallsMessage = getNoCallsMessage(type);

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <>
      {calls && calls.length > 0 ? (
        calls.map((meeting, idx) => {
          return (
            <div key={idx} className="meeting__card">
              <div>
                <div className="meeting__top-card">
                  <label htmlFor="meeting-title" className="meeting__label">
                    Meet Id:
                  </label>
                  <Copy
                    color="#fff"
                    width={17}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(meeting?.id);
                      toast({ title: "Copied!" });
                    }}
                  />
                </div>
                <div className="meeting__id">
                  <p id="meeting-id" className="meeting__id-para">
                    {meeting?.id}
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="meeting-title" className="meeting__label">
                  Title:
                </label>
                <p className="meetin__date" id="meeting-title">
                  {meeting?.state?.custom?.description || "----"}
                </p>
              </div>
              <div>
                <label htmlFor="meeting-title" className="meeting__label">
                  Date:
                </label>
                <p className="meetin__date">
                  {new Date(meeting?.state?.startsAt).toLocaleString() ||
                    new Date(meeting?.start_time).toLocaleString()}
                </p>
              </div>
              <div className="meeting__btn-container">
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
                {type === "ended" ? null : (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/meeting/${meeting?.id}`)}
                  >
                    Start
                  </Button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <h2>{NoCallsMessage}</h2>
      )}
    </>
  );
};

CallList.propTypes = {
  type: PropTypes.string,
};

export default CallList;
