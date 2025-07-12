import express from "express";
import { generateScript } from "../controllers/script-controller.js";

const scriptRoute = express.Router();

scriptRoute.post("/", generateScript);

//export
export default scriptRoute;
