import express from "express";
import scriptRoute from "./routes/script-route.js";
import imgRoute from "./routes/img-route.js";
import voiceRoute from "./routes/voice-route.js";
const routeIndex = express.Router();

// Import các route khác nếu có

routeIndex.use("/script", scriptRoute);
routeIndex.use("/img", imgRoute);
routeIndex.use("/voice", voiceRoute);

export default routeIndex;
