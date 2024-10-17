import express from "express";
import { createOrderCtrl, getAllordersCtrl, getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/order.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRoutes = express.Router()

orderRoutes.post('/',isLoggedIn, createOrderCtrl);
orderRoutes.get('/',isLoggedIn, getAllordersCtrl);
orderRoutes.get('/:id',isLoggedIn, getSingleOrderCtrl);
orderRoutes.put('/update/:id',isLoggedIn, updateOrderCtrl);
orderRoutes.get('/sales/stats',isLoggedIn, isAdmin, getOrderStatsCtrl);


export default orderRoutes;