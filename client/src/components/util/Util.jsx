import "./util.css";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Upcoming from "@/pages/upcoming/Upcoming";
import Ended from "@/pages/ended/Ended";
import TaskPlanner from "../../components/features/TaskPlanner";

const Util = () => {
  const [open, setOpen] = useState(false);
  const [outlet, setOutlet] = useState("");
  const { user, isLoading } = useAuth0();

  const outletMap = {
    upcomming: <Upcoming />,
    ended: <Ended />,
    taskplanner: <TaskPlanner />
  };

  const getOutlet = (type) => {
    return outletMap[type];
  };

  return (
    <section className="sidebar">
      <>
        <div
          className={`sidebar__content ${open ? "sidebar__content--z" : null}`}
        >
          <div
            className={`sliderbar__container-l ${
              open ? "sliderbar__container-l--open" : null
            }`}
          >
            <button onClick={() => setOpen((prevOpen) => !prevOpen)}>
              <svg viewBox="0 0 24 24" className="slidebar__svg">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                ></path>
              </svg>
            </button>
            <h2 className="slider__user">
              {isLoading ? "loading..." : user?.nickname}
            </h2>
            <div className="slider__button-container">
              <h3 className="slider__btn-title">meeting</h3>
              <button
                onClick={() => setOutlet("upcomming")}
                className={`slider__nav-btn ${
                  outlet === "upcomming" ? "slider__nav-btn--active" : null
                }`}
              >
                <svg viewBox="0 0 24 24" className="slidebar__svg">
                  <path
                    fill="currentColor"
                    d="M15 22v-2h4V10H5v4H3V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm-7 2l-1.4-1.4L9.175 20H1v-2h8.175L6.6 15.4L8 14l5 5z"
                  ></path>
                </svg>
                <span>Upcomming</span>
              </button>
              <button
                onClick={() => setOutlet("ended")}
                className={`slider__nav-btn ${
                  outlet === "ended" ? "slider__nav-btn--active" : null
                }`}
              >
                <svg viewBox="0 0 24 24" className="slidebar__svg">
                  <path
                    fill="currentColor"
                    d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9c-.98.49-1.87 1.12-2.66 1.85c-.18.18-.43.28-.7.28c-.28 0-.53-.11-.71-.29L.29 13.08a.96.96 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71s-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29c-.27 0-.52-.11-.7-.28a11.3 11.3 0 0 0-2.67-1.85a1 1 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9"
                  ></path>
                </svg>
                <span>Ended</span>
              </button>
              <button
                onClick={() => setOutlet("taskplanner")}
                className={`slider__nav-btn ${
                  outlet === "taskplanner" ? "slider__nav-btn--active" : null
                }`}
              >
                <svg viewBox="0 0 24 24" className="slidebar__svg">
                  <path
                    fill="currentColor"
                    d="M3 13h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7zm-4 6h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7z"
                  ></path>
                </svg>
                <span>Task Planner</span>
              </button>
            </div>
          </div>
          <div
            className={`sliderbar__container-r ${
              open ? "sliderbar__container-r--open" : null
            }`}
          >
            <h3 className="slider__sec-title">{outlet}</h3>
            {!outlet ? (
              <div>
                <h3 className="slider__intro-title">
                  Hello {user?.given_name}
                </h3>
                <div className="slider__text-container">
                  <p className="slider__description">
                    Here, you&apos;ll find everything you need to manage your
                    meetings effortlessly.
                  </p>
                  <p className="slider__description">
                    <strong className="slider__strong">
                      Track Your Meetings:
                    </strong>{" "}
                    View past and upcoming meetings at a glance.
                  </p>
                  <p className="slider__description">
                    <strong className="slider__strong">
                      Manage Participants:
                    </strong>{" "}
                    Add, remove, or update participants with ease.
                  </p>
                  <p className="slider__description">
                    <strong className="slider__strong">
                      Plan Your Tasks:
                    </strong>{" "}
                    Organize and track your tasks efficiently.
                  </p>
                </div>
              </div>
            ) : null}
            <div className="slider__grid">{getOutlet(outlet)}</div>
          </div>
        </div>
      </>
      <div className="slider__option">
        <button onClick={() => setOpen(true)}>
          <svg className="slidebar__svg" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M64 144h226.75a48 48 0 0 0 90.5 0H448a16 16 0 0 0 0-32h-66.75a48 48 0 0 0-90.5 0H64a16 16 0 0 0 0 32m384 224h-66.75a48 48 0 0 0-90.5 0H64a16 16 0 0 0 0 32h226.75a48 48 0 0 0 90.5 0H448a16 16 0 0 0 0-32m0-128H221.25a48 48 0 0 0-90.5 0H64a16 16 0 0 0 0 32h66.75a48 48 0 0 0 90.5 0H448a16 16 0 0 0 0-32"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Util;