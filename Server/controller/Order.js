const Retailer = require("../model/Retailer");
const Product = require("../model/Product");
const Order = require("../model/Order");
const User = require("../model/User");
const Cart = require("../model/Cart");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const mailSender = require("../util/mailSender");
const OrderConfirmation = require("../template/OrderConfirmation");
const OrderPlaced = require("../template/OrderPlaced");
const OrderCancelledUser = require("../template/OrderCancelledUser");
const OrderCancelledRetailer = require("../template/OrderCancelledRetailer");
const OTPSending = require("../template/OTPSending");
const PurchaseConfirmation = require("../template/PurchaseConfirmation");
const createPDF = require("../template/DeliveryReceipt");
const OutforDelivery = require("../template/OutforDelivery");

exports.placeOrder = async (req, res) => {
  try {
    const { productId, token, retailerId, quantity } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error decoding Token",
      });
    }
    // Get Product to Buy
    const product = await Product.findById({
      _id: new mongoose.Types.ObjectId(productId),
    });

    const curQuantity = product.quantity;

    // Get Total Price to pay for Order
    const total = quantity * product.price;

    // Get the Retailer
    const retailer = await Retailer.findOne({
      _id: new mongoose.Types.ObjectId(retailerId),
    });

    // Create an instance of Order
    const order = await Order.create({
      productId,
      retailerId,
      userId: decode.id,
      price: total,
      quantity,
    });

    // Send Email informing the User who is buying the Course
    await mailSender(
      decode.email,
      "Order Confirmation",
      await OrderConfirmation(order, product)
    );

    // Send Email informing the Retailer whose product is bought
    await mailSender(
      retailer.email,
      "New Order Placed",
      await OrderPlaced(retailer, product, order)
    );

    // Updating new quantity after the product is bought
    await Product.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(productId) },
      {
        quantity: curQuantity - quantity,
      }
    );

    // Update the order in retailer Schema
    await Retailer.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(retailerId) },
      {
        $push: {
          orders: order._id,
        },
      }
    );

    // Update the order in User Schema
    await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $push: {
          orders: order._id,
        },
      }
    );
    const cart = await Cart.findOneAndDelete({
      productId: product._id,
      buyer: new mongoose.Types.ObjectId(decode.id),
    });
    await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $pull: {
          cartItems: cart._id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error placing Order",
    });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(orderId) },
      {
        states: "Cancelled",
      }
    );
    const retailer = await Retailer.findById({
      _id: new mongoose.Types.ObjectId(order.retailerId),
    });
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(order.userId),
    });
    const product = await Product.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(order.productId) },
      {
        $inc: { quantity: order.quantity },
      }
    );
    await mailSender(
      retailer.email,
      "Order Cancelled",
      await OrderCancelledRetailer(order, product, user)
    );
    await mailSender(
      user.email,
      "Order Cancelled",
      await OrderCancelledUser(order, product)
    );
    return res.status(200).json({
      success: true,
      message: "Order Cancelled",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error cancelling Order",
    });
  }
};
exports.changeState = async (req, res) => {
  try {
    const { orderId, state, phoneNo } = req.body;
    const order = await Order.findById({
      _id: new mongoose.Types.ObjectId(orderId),
    });
    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Order not found",
      });
    }
    order.states = state;
    order.save();
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(order.userId),
    });
    const product = await Product.findById({
      _id: new mongoose.Types.ObjectId(order.productId),
    });
    if (phoneNo && state === "Out for Delivery") {
      await mailSender(
        user.email,
        "Your Order is Out for Delivery",
        await OutforDelivery(user, order, product, phoneNo)
      );
    }
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to update product status",
    });
  }
};
exports.generateOTP = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById({
      _id: new mongoose.Types.ObjectId(orderId),
    })
      .populate("userId")
      .exec();
    const otpLength = 6;
    const otpOptions = {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    };
    const otp = otpGenerator.generate(otpLength, otpOptions);
    console.log(otp);
    // Save the OTP in Order Schema
    order.otp = otp;
    order.save();
    // Send Mail to the Buyer
    await mailSender(
      order.userId.email,
      "Purchase Confirmation OTP",
      await OTPSending(otp, order)
    );
    return res.status(200).json({
      success: true,
      message: "OTP was successfully sent",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error confirming Order",
    });
  }
};
exports.confirmOrder = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await Order.findById(orderId).populate("userId").exec();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.otp !== otp) {
      return res.status(500).json({
        success: false,
        message: "Please enter a valid OTP",
      });
    }

    // Create the PDF
    const pdfBuffer = await createPDF(order);

    // Send Mail informing purchase confirmation with receipt
    await mailSender(
      order.userId.email,
      "Purchase Confirmation",
      await PurchaseConfirmation(),
      [{ filename: `Receipt_${order._id}.pdf`, content: pdfBuffer }]
    );

    order.otp = "";
    order.states = "Delivered";
    order.save();

    return res.status(200).json({
      success: true,
      message: "Order delivery confirmed",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error confirming Order",
    });
  }
};
