import Coupon from "../model/Coupon.model.js";
import asyncHandler from "express-async-handler";

// @desc Create New Coupon
// @route POST /api/v1/coupons
// @access Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // check if admin
  // check if coupo already exists
  const couponExists = await Coupon.findOne({
    code,
  });
  if (couponExists) {
    throw new Error("Coupon already exists");
  }
  // check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value munst be a number");
  }
  // create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  //   send the response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc Get All Coupon
// @route GET /api/v1/coupons
// @access Private/Admin

export const getAllCouponCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

// @desc Get Single Coupon
// @route GET /api/v1/coupons/:id
// @access Private/Admin

export const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "Single Coupon is fetched",
    coupon,
  });
});

// @desc Update  Coupon
// @route PUT /api/v1/coupons/update/:id
// @access Private/Admin

export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
  }, {
    new: true
  });
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

// @desc delete Delete Coupon
// @route DELETE /api/v1/coupons/delete/:id
// @access Private/Admin

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupon updated successfully",
       
    })
});
