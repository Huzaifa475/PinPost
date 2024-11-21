import {Router} from "express"
import { verifyJwt } from "../middleware/auth.middleware.js"
import { createPost, deletePost, searchAllPostBasedOnLocation, searchAllPostOfUer, updatePost } from "../controller/post.controller.js"

const router = Router()

router.route("/create").post(verifyJwt, createPost);

router.route("/delete/:postId").post(verifyJwt, deletePost);

router.route("/update/:postId").patch(verifyJwt, updatePost);

router.route("/search-user").get(verifyJwt, searchAllPostOfUer);

router.route("/search-location").get(verifyJwt, searchAllPostBasedOnLocation);

export default router;