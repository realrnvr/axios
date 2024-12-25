import { Router } from "express";
import {chatTokenGenerator} from "../controller/chat.js"

const chatRouter=Router();
chatRouter.route("/chat-token/:userId").get(chatTokenGenerator);

export default chatRouter;