import express from "express";
import {
  createProductCtrl,
  deleteProductCtrl,
  getProductCtrl,
  getProductsCtrl,
  updateProductCtrl,
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productRoutes = express.Router();

// productRoutes.post("/", isLoggedIn, upload.single("file"), createProductCtrl); for single file upload
productRoutes.post("/", isLoggedIn,isAdmin, upload.array("files"), createProductCtrl);
productRoutes.get("/", getProductsCtrl);
productRoutes.get("/:id", getProductCtrl);
productRoutes.put("/:id",isLoggedIn, isAdmin, updateProductCtrl);
productRoutes.delete("/:id/delete",isLoggedIn, isAdmin,deleteProductCtrl);


export default productRoutes;
