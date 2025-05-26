import { Router } from "express";
import {
  changePassword,
  currentUser,
  getUserChannelInfo,
  getUSerHistory,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  registerUser,
  updateAvatar,
  updateCoverImage,
  updateDetails,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(RefreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, currentUser); // fetching so using get method
router.route("/update-details").patch(verifyJWT, updateDetails);
// put is mainly used for the updating the details (whole resource actually and patch is used for required fields to be updated only )
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/update-cover-image")
  .post(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/channel/:username").get(verifyJWT, getUserChannelInfo);
router.route("watch-history").get(verifyJWT, getUSerHistory);
export default router;
