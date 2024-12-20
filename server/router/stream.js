import { Router } from "express";
import { tokenProvider } from "../controller/stream.js";

const router = Router();

router.route("/token-provider/:userId").get(tokenProvider);

export default router;
