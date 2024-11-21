import {Router} from "express"
import { verifyJwt } from "../middleware/auth.middleware.js"
import {createReview, deleteReview, searchAllReviewOfPost, serachAllReviewOfUser, updateReview} from "../controller/review.controller.js"

const router = Router()

router.route("/create/:postId").post(verifyJwt, createReview)

router.route("/delete/:reviewId").post(verifyJwt, deleteReview)

router.route("/update/:reviewId").patch(verifyJwt, updateReview)

router.route("/search-user").get(verifyJwt, serachAllReviewOfUser)

router.route("/search-post/:postId").get(verifyJwt, searchAllReviewOfPost)

export default router