const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    email: String,
    mob: Number,
  });

const productModel = mongoose.model("informations", productSchema);

module.exports = productModel;