const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/e-com");

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  mob: Number,
});

const insert = async () => {
  const productModel = mongoose.model("informations", productSchema);
  let data = new productModel({
    name: "Milu",
    email: "rkn.milu@gmail.com",
    mob: 9090397764,
  });
  let result = await data.save();
  console.log(result);
};

insert();