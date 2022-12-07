const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/e-com");

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  mob: Number,
});

const edit = async () => {
    const productModel = mongoose.model("informations", productSchema);
    let data = await productModel.updateOne(
      { name: "Tilu" },
      { $set: { name: "Sanjeeb Kumar Nayak" } }
    );
    console.log(data);
  };

edit();