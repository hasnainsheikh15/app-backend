import { Router } from "express";
import { createTweet, getUserTweets, updateTweet , deleteTweet } from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tweetRouter = Router();
tweetRouter.use(verifyJWT)
tweetRouter.route("/").post(createTweet);
tweetRouter.route("/get-tweets").get(getUserTweets)
tweetRouter.route("/update-tweet/:tweetId").patch(updateTweet)
tweetRouter.route("/delete-tweet/:tweetId").delete(deleteTweet)

export default tweetRouter;
