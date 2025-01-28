import "./hero.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import CreateMeet from "../createMeet/CreateMeet";
import ReactDatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BackgroundBeams } from "../../components/extraUicom/backgroundBeams";

const Hero = () => {
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
  });
  const [callDetails, setCallDetails] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  console.log(isSchedule);

  const handleTextArea = (e) => {
    const { value, name } = e.target;
    setValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero__content">
          <button
            to="/schedule"
            className="hero__card"
            onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
          >
            <figure>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="hero__svg"
              >
                <path d="M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v1h20V7c0-1.7-1.3-3-3-3zM2 19c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-9H2v9zm15-7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-5-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-5-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
              </svg>
            </figure>
            <figcaption className="hero__caption">Schedule</figcaption>
          </button>
          <Link className="hero__card">
            <figure>
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                className="hero__svg"
              >
                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
              </svg>
            </figure>
            <figcaption>Join</figcaption>
          </Link>
          <CreateMeet
            values={values}
            setCallDetails={setCallDetails}
            callDetails={callDetails}
          />
        </div>
        {isOpen ? (
          <div className="hero__schedule-modal">
            {!isSchedule ? (
              <>
                <div className="flex flex-col">
                  <label className="hero__label" htmlFor="description">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={values.description}
                    onChange={handleTextArea}
                    className="hero__textarea"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="hero__label" htmlFor="date">
                    Pick a date:
                  </label>
                  <ReactDatePicker
                    selected={values.dateTime}
                    onChange={(date) =>
                      setValues((prevValues) => ({
                        ...prevValues,
                        dateTime: date,
                      }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="hero__date"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="hero__btn"
                  onClick={() => setIsSchedule(true)}
                >
                  Schedule Meeting
                </Button>
              </>
            ) : (
              <div className="hero__meeting">
                <p>Meeting link created!</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `localhost:5173/meeting/${callDetails?.id}`
                    );
                    toast({ title: "Link Copied!" });
                  }}
                >
                  Copy meeting Link
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </section>
      
     
      <BackgroundBeams />
    </>
  );
};

export default Hero;
