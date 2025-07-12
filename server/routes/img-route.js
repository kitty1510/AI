import express from "express";
import { generateImg } from "../controllers/img-controller.js";

const imgRoute = express.Router();
imgRoute.post("/", generateImg);
//export
export default imgRoute;
