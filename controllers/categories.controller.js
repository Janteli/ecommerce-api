import Category from "../model/Category.model.js";
import asyncHandler from "express-async-handler";

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // category exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  // create
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path
  });

  res.json({
    status: "success",
    message: "category created successfully",
    category,
  });
});

// @desc    Get all category
// @route   GET /api/categories
// @access  Public

export const getAllCategoryCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: "success",
    message: "categories fethched successfully",
    categories,
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: "success",
    message: "the category fetched successfully",
    category,
  });
});

// @desc    update category
// @route   PUT /api/categories/:id
// @access  Private/Admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //   update
  // if (!product) {
  //     throw new Error("Product not found");
  //   }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "Category updated successfully",
    category,
  });
});

// @desc    delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new Error("Category not found");
    }
    res.json({
      status: "success",
      message: "category deleted successfully",
    });
  });
