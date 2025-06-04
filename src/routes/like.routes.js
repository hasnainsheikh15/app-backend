import Router from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from '../controllers/like.controllers.js';

const likeRouter = Router();
likeRouter.use(verifyJWT)

likeRouter.route("/toggle-like/:videoId").post(toggleVideoLike)
likeRouter.route("/toggle-comment-like/:commentId").post(toggleCommentLike);
likeRouter.route("/toggle-tweet-like/:tweetId").post(toggleTweetLike); // Assuming similar logic for tweets
likeRouter.route("/get-liked-videos").get(getLikedVideos)

export default likeRouter;