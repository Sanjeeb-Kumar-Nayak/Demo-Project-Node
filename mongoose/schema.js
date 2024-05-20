const mongoose = require("mongoose");
require("./database");

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  mob: Number,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const productModel = mongoose.model("informations", productSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
  productModel,
  userModel,
};
