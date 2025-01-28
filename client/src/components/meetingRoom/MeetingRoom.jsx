import "./meeting-room.css";
import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users, MessageCircle, Code, FocusIcon, NotebookIcon, PhoneCall } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CustomLoader from "../customLoader/CustomLoader";
import ChatMeet from "../chat/ChatMeet";
import CodeEditor from "../codeEditor/CodeEditor";
import { useStrictMode } from "../../hooks/useStrictMode";
import { useStrictModeEnforcement } from "../../hooks/useStrictModeEnforcement";

import StrictModeDialog from "../strictModeButton/StrictModeDialog";

import AttendancePopup from "../attendance/AttendancePopup";
import { isAttendanceActiveAtom ,isHostAtom } from "../../Atoms/Atom";
import { useRecoilValue } from "recoil";
import EventListener from "../strictModeButton/EventListener";
import InputPart from "../codeEditor/InputPart";
import OutputPart from "../codeEditor/OutputPart";
import { FloatingDock } from "../extraUicom/floatingDock";
import StrictModePopup from "../strictModeButton/StrictModePopup";
import AttendenceHostPopup from "../attendance/AttendenceHostPopup";
import EndCallPopup from "../endCallButton/EndCallPopup";

const MeetingRoom = () => {
  const [searchParams] = useSearchParams();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();
  const { isStrictMode } = useStrictMode();

  const [layout, setLayout] = useState("speaker-left");
  const isPersonalRoom = !!searchParams.get("personal");
  const isHost=useRecoilValue(isHostAtom);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const meetingId = searchParams.get("id") || "general";
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isStrictPopop,setIsStrictPopup]=useState(false);
  const [isAttendencePopop,setIsAttendencePopup]=useState(false);
  const [isEndCallPopop,setEndCallPopup]=useState(false);
  const isAttendanceActive = useRecoilValue(isAttendanceActiveAtom);
  const items = [
    {
      title: "Strict Mode",
      href: "/",
      icon: <FocusIcon/>,
      bgColor: "bg-yellow-600",
      hoverColor: "bg-yellow-600",
      iconColor: "text-red-100",
      onClick: (prev) => setIsStrictPopup(!prev),
    },
    {
      title: "Attendence",
      href: "/",
      icon: <NotebookIcon/>,
      bgColor: "bg-blue-600",
      hoverColor: "bg-blue-600",
      iconColor: "text-blue-100",
      onClick: (prev) => setIsAttendencePopup(!prev),
    },
    {
      title: "Hang up",
      href: "/",
      icon: <PhoneCall/>,
      bgColor: "bg-red-600",
      hoverColor: "bg-red-600",
      iconColor: "text-red-100",
      onClick: (prev) =>setEndCallPopup(!prev),
    }
  ];
  console.log(isPersonalRoom,"is personal room")
  const handleShowDialog = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  const handleReenterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to re-enter fullscreen:", error);
    }
  };

  const handleDialogTimeout = () => {
    console.warn("User did not re-enter fullscreen in time.");
    setShowDialog(false);
  };

  useStrictModeEnforcement({
    isStrictMode,
    onShowDialog: handleShowDialog,
  });

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  const CallLayout = () => {
    switch (layout) {
      case "grid": {
        return <PaginatedGridLayout />;
      }
      case "speaker-right": {
        return <SpeakerLayout participantsBarPosition="left" />;
      }
      default: {
        return <SpeakerLayout participantsBarPosition="right" />;
      }
    }
  };

  if (
    callingState !== CallingState.JOINED &&
    callingState !== CallingState.LEFT
  ) {
    return <CustomLoader />;
  }

  const onMarkAttendance = () => {
    console.log("attendance marked");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <EventListener />
      {isAttendanceActive && <AttendancePopup onMarkAttendance={onMarkAttendance} />}
      {showDialog && (
        <StrictModeDialog
          message={dialogMessage}
          onReenterFullscreen={handleReenterFullscreen}
          onTimeout={handleDialogTimeout}
        />
      )}
      <div className="relative flex size-full item-center justify-center">
        {showCodeEditor ? (
          <>
            <div className="h-[calc(100vh-86px)] pl-5 w-1/3 flex flex-col space-y-2 transition-all duration-300">
              <div className="h-1/2 bg-neutral-900 rounded-lg overflow-hidden">
                <CallLayout />
              </div>
              <div className="flex space-x-2">
               <InputPart/>
               <OutputPart/>
              </div>
            </div>
            <div className="h-[calc(100vh-86px)] w-2/3 ml-2 transition-all duration-300 bg-white rounded-lg overflow-hidden">
              <CodeEditor />
            </div>
          </>
        ) : (
          <div className={cn(
            "flex size-full max-w-[1000px] items-center",
            showChat ? "max-w-[800px]" : "max-w-[1000px]"
          )}>
            <CallLayout />
          </div>
        )}

        {/* Participants List */}
        <div
          className={cn(
            "h-[calc(100vh-86px)] ml-2 transition-all duration-300 call__participants-list",
            showParticipants ? "block" : "hidden"
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

        {/* Chat Section */}
        <div
          className={cn(
            "h-[calc(100vh-100px)] w-80 ml-10 transition-all duration-300 bg-white rounded-lg overflow-hidden",
            showChat ? "block" : "hidden"
          )}
        >
          <ChatMeet meetingId={meetingId} />
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5">
        <CallControls />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="mb-4">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((val, idx) => {
              return (
                <div key={idx}>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setLayout(val.toLocaleLowerCase());
                    }}
                  >
                    {val}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button
          onClick={() => {
            setShowParticipants((prevShowParticipants) => !prevShowParticipants);
            setShowChat(false);
            setShowCodeEditor(false);
          }}
        >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        <button
          onClick={() => {
            setShowChat((prev) => !prev);
            setShowParticipants(false);
            setShowCodeEditor(false);
          }}
          >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <MessageCircle size={20} className="text-white" />
          </div>
        </button>
        <button
          onClick={() => {
            setShowCodeEditor((prev) => !prev);
            setShowParticipants(false);
            setShowChat(false);
          }}
        >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Code size={20} className="text-white" />
          </div>
        </button>
      </div>
        {isHost && <div className="dock-div"> 
          <FloatingDock 
  items={items}
  desktopClassName="dock-css"
  mobileClassName="fixed bottom-4 right-4"
  defaultBgColor="bg-neutral-800"
  defaultHoverColor="bg-neutral-700"
/>
HOST CONTROLS
</div>
       }
    <StrictModePopup isStrictPopop={isStrictPopop} setIsStrictPopup={setIsStrictPopup}/>
    <AttendenceHostPopup isAttendencePopop={isAttendencePopop} setIsAttendencePopup={setIsAttendencePopup}/>
    <EndCallPopup isEndCallPopop={isEndCallPopop} setEndCallPopup={setEndCallPopup}/>
    {isStrictMode &&  <div className="warn-strict">Strict Mode is ON </div>}

    </section>
  );
};

export default MeetingRoom;
