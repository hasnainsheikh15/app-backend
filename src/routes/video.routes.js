import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  publishVideo,
} from "../controllers/video.controllers.js";

const videoRouter = Router();
videoRouter.use(verifyJWT);

videoRouter.route("/").get(getAllVideos);
videoRouter.route("/publish").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

export default videoRouter;
