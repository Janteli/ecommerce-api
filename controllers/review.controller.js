import Product from "../model/Product.model.js";
import Review from "../model/Review.model.js";
import asyncHandler from "express-async-handler";

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { message, rating} = req.body;
// 1. Find the product
const {productId} = req.params;
// console.log("product -id",productId);

const productFound = await Product.findById(productId).populate('reviews')
// console.log("product found",productFound)
if(!productFound){
  throw new Error('Product Not Found')
}
// check if user already reviewed this product
const hasReviewed = productFound?.reviews?.find((review=>{
  // console.log(review);
  return review?.user?.toString() === req?.userAuthId?.toString();
  
}))
// console.log(hasReviewed);
if(hasReviewed){
  throw new Error("You have already reviewed this product.")
}
// create review
const review = await Review.create(
  {
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  }
);
productFound.reviews.push(review?._id);
// resave
await productFound.save();
res.status(201).json({
  success: true,
  message: "Review created successfullys"
})
});


// @desc    Get all Brand
// @route   GET /api/brands
// @access  Public

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.json({
    status: "success",
    message: "brands fethched successfully",
    brands,
  });
});

// @desc    Get single Brand
// @route   GET /api/brands/:id
// @access  Public

export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  res.json({
    status: "success",
    message: "the brand fetched successfully",
    brand,
  });
});

// @desc    update brands
// @route   PUT /api/brands/:id
// @access  Private/Admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //   update
  // if (!product) {
  //     throw new Error("Product not found");
  //   }

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "Brand updated successfully",
    brand,
  });
});

// @desc    delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
   
    res.json({
      status: "success",
      message: "Brand deleted successfully",
    });
  });
