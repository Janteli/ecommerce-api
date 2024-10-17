import express from "express";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponCtrl, getCouponCtrl, updateCouponCtrl } from "../controllers/coupon.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponRoutes = express.Router()


couponRoutes.post('/',isLoggedIn,isAdmin, createCouponCtrl)
couponRoutes.get('/',isLoggedIn, getAllCouponCtrl)
couponRoutes.get('/', getAllCouponCtrl)
couponRoutes.get('/:id', getCouponCtrl);
couponRoutes.put('/update/:id',isLoggedIn, isAdmin, updateCouponCtrl);
couponRoutes.delete('/delete/:id',isLoggedIn, isAdmin, deleteCouponCtrl);




export default couponRoutes;