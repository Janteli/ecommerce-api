import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brand.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRoutes = express.Router()

brandsRoutes.post("/", isLoggedIn,isAdmin, createBrandCtrl);
brandsRoutes.get("/",  getAllBrandsCtrl);
brandsRoutes.get("/:id",  getSingleBrandCtrl);
brandsRoutes.delete("/:id",isLoggedIn, isAdmin, deleteBrandCtrl);
brandsRoutes.put("/update/:id",isLoggedIn, isAdmin,  updateBrandCtrl);


export default brandsRoutes;