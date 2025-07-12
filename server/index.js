import express from "express";
import scriptRoute from "./routes/script-route.js";
import imgRoute from "./routes/img-route.js";
import voiceRoute from "./routes/voice-route.js";
import videoRoute from "./routes/video-route.js";

import youtubeRoute from "./routes/youtube-route.js";
import userRoute from "./routes/user-route.js";

const routeIndex = express.Router();

// Import các route khác nếu có

routeIndex.use("/script", scriptRoute);
routeIndex.use("/img", imgRoute);
routeIndex.use("/voice", voiceRoute);
routeIndex.use("/video", videoRoute);
routeIndex.use("/youtube", youtubeRoute);
routeIndex.use("/user", userRoute);

export default routeIndex;
