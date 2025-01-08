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
import { LayoutList, Users, MessageCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EndCallButton from "../endCallButton/EndCallButton";
import CustomLoader from "../customLoader/CustomLoader";
import ChatMeet from "../chat/ChatMeet";
import CodeEditor from "../codeEditor/CodeEditor";
import { useStrictMode } from "../../hooks/useStrictMode"
import { useStrictModeEnforcement } from "../../hooks/useStrictModeEnforcement";
import EnableStrictModeButton from "../strictModeButton/StrictModeButton";
import { useCall } from "@stream-io/video-react-sdk";
import StrictModeListener from "../strictModeButton/strictModeListener";
const MeetingRoom = () => {

    const [searchParams] = useSearchParams();
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const navigate = useNavigate();
    const { isStrictMode } = useStrictMode();

    const [layout, setLayout] = useState("speaker-left");
    const isPersonalRoom = !!searchParams.get("personal");
    const [showParticipants, setShowParticipants] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const meetingId = searchParams.get("id") || "general";
    useEffect(() => {
        if (isStrictMode) {
            // Show the full-screen warning
            console.log("Strict mode enabled - show warning");
        } else {
            // Hide the full-screen warning
            console.log("Strict mode disabled - hide warning");
        }
    }, [isStrictMode]);

    // const isHost = localParticipant?.userId === call?.state.createdBy?.id;
    useStrictModeEnforcement({ isStrictMode });
    useEffect(() => { if (callingState === CallingState.LEFT) { navigate("/"); } }, [callingState, navigate]);
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

    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <StrictModeListener />
            <div className="relative flex size-full item-center justify-center">
                <div className={cn(
                    "flex size-full max-w-[1000px] items-center",
                    showChat ? "max-w-[800px]" : "max-w-[1000px]"
                )}>
                    <CallLayout />
                </div>
                {/* Fixed visibility toggle */}
                <div
                    className={cn(
                        "h-[calc(100vh-86px)] ml-2 transition-all duration-300 call__participants-list",
                        showParticipants ? "block" : "hidden" // Toggle visibility
                    )}
                >
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
                {/* this portion is newly added */}
                <div
                    className={cn(
                        "h-[calc(100vh-86px)] w-80 ml-2 transition-all duration-300 bg-white rounded-lg overflow-hidden",
                        showChat ? "block" : "hidden"
                    )}
                >
                    <ChatMeet meetingId={meetingId} />
                </div>
                <div
                    className={cn(
                        "h-[calc(100vh-86px)] w-80 ml-2 transition-all duration-300 bg-white rounded-lg overflow-hidden",
                        showCodeEditor ? "block" : "hidden"
                    )}
                >
                    <CodeEditor meetingId={meetingId} />
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
                {/* Toggle participants */}
                <button
                    onClick={() => {
                        setShowParticipants((prevShowParticipants) => !prevShowParticipants);
                        if (showChat) setShowChat(false);
                        setShowCodeEditor(false);
                    }
                    }
                >
                    <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                        <Users size={20} className="text-white" />
                    </div>
                </button>
                <button
                    onClick={() => {
                        setShowChat((prev) => !prev);
                        if (showParticipants) setShowParticipants(false);
                        setShowCodeEditor(false);
                    }}
                >

                    <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                </button>

                {/* code editor */}
                <button
                    onClick={() => {
                        setShowCodeEditor((prev) => !prev);
                        setShowParticipants(false);
                        setShowChat(false);
                    }}
                >editor

                </button>
                {!isPersonalRoom && <EnableStrictModeButton />}
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    );
};

export default MeetingRoom;
