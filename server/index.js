import express from "express";
const app = express();

import { config } from "dotenv";
config();

import cors from "cors";
import router from "./router/stream.js";

// frontend ports to allow
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  })
);

// stream router
// http://localhost:3000/api/v1/stream/...
app.use("/api/v1/stream", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening to PORT ${PORT}`);
});
