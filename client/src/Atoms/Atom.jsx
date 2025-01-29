import { atom } from "recoil";

export const isHostAtom = atom({
  key: "isHost",
  default: "false",
});

export const isAttendanceActiveAtom = atom({
  key: "isAttendanceActive",
  default: "false",
});

export const languageAtom = atom({
  key: "languageAtom",
  default: "cpp",
});

export const inputAtom = atom({
  key: "inputAtom",
  default: "",
});
export const codeAtom = atom({
  key: "codeAtom",
  default: "",
});
export const outputAtom = atom({
  key: "outputAtom",
  default: "",
});
export const codeErrorAtom = atom({
  key: "codeError",
  default: "",
});

export const presentParticipantsAtom = atom({
  key: 'presentParticipantsAtom',
  default: []
});