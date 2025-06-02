import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos } from "../controllers/video.controllers.js";

const videoRouter = Router();
videoRouter.use(verifyJWT);

videoRouter.route("/").get(getAllVideos)

export default videoRouter
