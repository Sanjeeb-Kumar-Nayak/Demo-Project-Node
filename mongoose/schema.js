const mongoose = require("mongoose");
require("./database");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mob: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const productModel = mongoose.model("informations", productSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
  productModel,
  userModel,
};
