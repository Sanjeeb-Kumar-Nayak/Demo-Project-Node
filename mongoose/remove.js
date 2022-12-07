const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/e-com");

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  mob: Number,
});

const remove = async () => {
    const productModel = mongoose.model("informations", productSchema);
    let data = await productModel.deleteOne({name: "Milu"});
    console.log(data);
};

remove();