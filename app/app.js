import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Stripe from "stripe";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/users.route.js";
import {
  globalErrHandler,
  notFound,
} from "../middlewares/globalErrHandler.middleware.js";
import productRoutes from "../routes/product.route.js";
import categoriesRoutes from "../routes/categories.route.js";
import brandsRoutes from "../routes/brands.route.js";
import colorRoutes from "../routes/colors.route.js";
import reviewRoutes from "../routes/review.route.js";
import orderRoutes from "../routes/order.route.js";
import Order from "../model/Order.model.js";
import { getAllordersCtrl } from "../controllers/order.controller.js";
import couponRoutes from "../routes/coupon.route.js";

// db connect
dbConnect();
const app = express();

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
// stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret =
  "whsec_59c3214152104d77e4c02aa81cef01870b86f1b845552cf8565780c4a509e8b8";

// Match the raw body to content type application/json
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);

      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      // update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      // console.log({
      //   orderId,
      //   paymentStatus,
      //   paymentMethod,
      //   totalAmount,
      //   currency,
      // });

      // find the order
      const order = await Order.findByIdAndUpdate(
        // instead orderId JSON.parse(orderId) if JSON.stringify is used in metadata
        orderId,{
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
      },{new: true})
      // console.log(order);
      
    } else {
      return;
    }

    // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntent = event.data.object;
    //     console.log('PaymentIntent was successful!');
    //     break;
    //   case 'payment_method.attached':
    //     const paymentMethod = event.data.object;
    //     console.log('PaymentMethod was attached to a Customer!');
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

// All middleware and route should be after webhook logic even express.json
app.use(express.json());

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/brands", brandsRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes)

// err handler middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
