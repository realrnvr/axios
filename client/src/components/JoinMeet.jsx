import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const JoinMeet = ({ setModal }) => {
  const navigate = useNavigate();
  const [joinVal, setJoinVal] = useState("");
  const handleJoinValChange = (e) => {
    setJoinVal(e.target.value);
  };

  const handleJoinClick = (link) => {
    if (!link || typeof link !== "string" || link.trim() === "") {
      toast({ title: "Invalid or empty link provided" });
      return;
    }

    const trimmedLink = link.trim();

    const urlRegex =
      /\/meeting\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;
    const match = trimmedLink.match(urlRegex);

    if (match && match[1]) {
      navigate(`/meeting/${match[1]}`);
      return;
    }

    const isValidUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        trimmedLink
      );

    if (isValidUuid) {
      navigate(`/meeting/${trimmedLink}`);
    } else {
      toast({ title: "Invalid link or meeting ID" });
    }
  };

  return (
    <div className="hero__join">
      <input
        type="text"
        placeholder="Enter Meet link or Id"
        className="hero__input"
        value={joinVal}
        onChange={handleJoinValChange}
      />
      <Button variant="secondary" onClick={() => handleJoinClick(joinVal)}>
        Join
      </Button>
      <Button
        variant="secondary"
        className="hero__close"
        onClick={() => setModal("")}
      >
        Close
      </Button>
    </div>
  );
};

JoinMeet.propTypes = {
  setModal: PropTypes.func,
};

export default JoinMeet;
