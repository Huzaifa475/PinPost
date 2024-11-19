import {Router} from "express"
import { verifyJwt } from "../middleware/auth.middleware"
import { createPost, deletePost, searchAllPostBasedOnLocation, searchAllPostOfUer, updatePost } from "../controller/post.controller"

const router = Router()

router.route("/create-post").post(verifyJwt, createPost);

router.route("/delete-post/:postId").post(verifyJwt, deletePost);

router.route("/update-post/:postId").patch(verifyJwt, updatePost);

router.route("/search-user-posts").get(verifyJwt, searchAllPostOfUer);

router.route("/search-post-location").get(verifyJwt, searchAllPostBasedOnLocation);

export default router;