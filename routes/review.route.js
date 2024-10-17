import express from "express";
import { createReviewCtrl } from "../controllers/review.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const reviewRoutes = express.Router()
reviewRoutes.post('/:productId',isLoggedIn, createReviewCtrl)

export default reviewRoutes;