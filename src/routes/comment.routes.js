import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controllers.js";

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route("/:videoId").get(getAllComments);
commentRouter.route("/add-comment/:videoId").post(addComment)
commentRouter.route("/update-comment/:commentId").patch(updateComment)
commentRouter.route("/delete-comment/:commentId").delete(deleteComment)
export default commentRouter;
