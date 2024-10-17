import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import {  } from "../controllers/brand.controller.js";
import { createColorCtrl, deleteColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl } from "../controllers/color.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorRoutes = express.Router()

colorRoutes.post("/", isLoggedIn, isLoggedIn, createColorCtrl);
colorRoutes.get("/",  getAllColorsCtrl);
colorRoutes.get("/:id",  getSingleColorCtrl);
colorRoutes.delete("/:id",isLoggedIn, isAdmin, deleteColorCtrl);
colorRoutes.put("/update/:id",isLoggedIn, isAdmin,  updateColorCtrl);


export default colorRoutes;