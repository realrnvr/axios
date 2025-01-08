import { atom} from "recoil";


export const isHostAtom = atom({
    key: 'isHost', 
    default: 'false', 
  });

  export const isAttendanceActiveAtom = atom({
    key: 'isAttendanceActive', 
    default: 'false', 
  });