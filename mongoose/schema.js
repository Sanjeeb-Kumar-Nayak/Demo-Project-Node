const mongoose = require("mongoose");
require("./database");

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: Number, required: false },
});

const productModel = mongoose.model("product", productSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
  productModel,
  userModel,
};
