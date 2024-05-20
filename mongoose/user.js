const schema = require("./schema");

const listingUser = async (req, resp) => {
  let response = await schema.userModel.find();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const createUser = async (req, resp) => {
  let response = new schema.userModel(req.body);
  let result = await response.save();
  resp.send(result);
};

const updateUser = async (req, resp) => {
  let { email, password } = req.body;
  let result = await schema.userModel.updateOne(
    { email: email },
    { $set: { password: password } }
  );
  resp.send(result);
};

const deleteUser = async (req, resp) => {
  let result = await schema.userModel.deleteMany(req.body);
  resp.send(result);
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let response = await schema.userModel.findOne({ email });

  if (response) {
    if (response.password === password) {
      let result = { status: 1, message: "Login Successfull", data: response };
      resp.send(result);
    } else {
      let result = { message: "Worng Passord" };
      resp.send(result);
    }
  } else {
    let result = { message: "Worng Email" };
    resp.send(result);
  }
};

module.exports = {
  listingUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
