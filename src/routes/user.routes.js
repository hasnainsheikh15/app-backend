import { Router } from "express";
import {
  changePassword,
  currentUser,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  registerUser,
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
router.route("/update-details").put(verifyJWT, updateDetails);
 // put is mainly used for the updating the details
export default router;
