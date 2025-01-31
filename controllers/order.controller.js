import Order from "../model/Order.model.js";
import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import User from "../model/User.model.js";
import Product from "../model/Product.model.js";
import Coupon from "../model/Coupon.model.js";
// @desc create orders
// @route POST api/v1/orders
// @access private

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
// console.log(stripe);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // get the coupon after createCouponCtrl is created- coupon is being accessed query methond in url ?property=value
  // console.log(req.query);
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error('Coupon has expired.')
  }

  if(!couponFound){
    throw new Error("Coupon does not exists.")
  }

//   get discount
const discount = couponFound?.discount/100
  // Get the payload(customer, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // console.log("req",req.body)
  // console.log(({
  //     orderItems, shippingAddress, totalPrice
  // }));

  // Find the user
  // console.log(req.userAuthId);
  // console.log("userId",req.userAuthId);

  // if (!req.userAuthId) {
  //     throw new Error('User not authenticated.');
  // }

  const user = await User.findById(req.userAuthId);
  // Check if user has shippig address or not
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping Address.");
  }
  // Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No oredered items");
  }
  // Place/Create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound? totalPrice - totalPrice * discount : totalPrice
  });
  console.log("order",order);
  user.orders.push(order?._id);
  await user.save();
  // Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  // console.log(products);
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  user.orders.push(order?._id);
  await user.save();

  // make payment (stripe)
  // convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.qty * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: order?._id.toString(),
      // or orderId : JSON.stringify(order?._id)
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });

  // make payment (stripe) -payload sent to stripe
  // const convertedOrders = orderItems.map((item)=>{
  //     return {
  //         price_data:{
  //             currency:"usd",
  //             product_data:{
  //                 name: item?.name,
  //                 description:item?.description
  //             },
  //             unit_amount: item?.price * 100
  //         },
  //         quantity: item?.qty
  //     }
  // })
  // const session = await stripe.checkout.sessions.create({
  //     line_items:convertedOrders,
  //     metadata:{
  //         orderId : JSON.stringify(order?._id)
  //     },
  //     mode: 'payment',
  //     success_url:'http://localhost:3000/success',
  //     cancel_url:'http://localhost:3000/success'
  // })
  // res.send({url: session.url})
  // Payment webhook
  // Update the user order
  // res.json({
  //     success: true,
  //     message: 'Order created',
  //     order,
  //     user
  // })
});

// @desc get all orders
// @route GET /api/v1/orders
// @access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //    find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

// @desc get single order
// @route GET /api/v1/orders/:id
// @access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  // get the id from params
  const id = req.params.id;
  // console.log( 'ID',id);

  const order = await Order.findById(id);

  res.status(200).json({
    success: true,
    message: "single order",
    order,
  });
});

// @desc update order to delevered
// @route PUT /api/v1/orders/update/:id
// @access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  // get the id from params
  const id = req.params.id;
  // update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

// @desc get sales sum of orders
// @route GET /api/v1/orders/salws/sum
// @access private/admin

export const getOrderStatsCtrl = asyncHandler(async(req, res) => {
  // get order stats
  const orders = await Order.aggregate([
    {
      "$group":{
        _id:null,
        minimumSale:{
          $min: "$totalPrice"
        },
        totalSales: {
          $sum: "$totalPrice"
        },
        maxSale: {
          $max: "$totalPrice"
        },
        avgSale:{
          $avg: "$totalPrice"
        }
      }
    }
  ])
  // get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // console.log(today);
  const saleToday = await Order.aggregate([
    {
      $match:{
        createdAt:{
          $gte: today
        }
      }
    },
  {
    $group:{
      _id:null,
      totalSales: {
        $sum: "$totalPrice"
      }
    }
  }
  
  ])
  // send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday
  })
})

