import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
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
videoRouter.route("/get-video/:videoId").get(getVideoById);

videoRouter
  .route("/update-video/:videoId")
  .patch(upload.single("thumbnail"), updateVideo);
videoRouter.route("/delete-video/:videoId").delete(deleteVideo);
videoRouter.route("/toggle-publish/:videoId").post(togglePublishStatus); // Assuming deleteVideo is implemented in updateVideo for now
export default videoRouter;
