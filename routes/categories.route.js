import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createCategoryCtrl,
  getAllCategoryCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} from "../controllers/categories.controller.js";
import categoryFileUpload from "../config/categoryUpload.js";

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", isLoggedIn, isAdmin, categoryFileUpload.single('file'), createCategoryCtrl);
categoriesRoutes.get("/", getAllCategoryCtrl);
categoriesRoutes.get("/:id", getSingleCategoryCtrl);
categoriesRoutes.put("/:id", isLoggedIn, isAdmin, updateCategoryCtrl);
categoriesRoutes.delete('/:id',isLoggedIn, isAdmin, deleteCategoryCtrl)


export default categoriesRoutes;
