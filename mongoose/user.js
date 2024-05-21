const schema = require("./schema");
const bcrypt = require("bcrypt");

const listingUser = async (req, resp) => {
  let response = await schema.userModel.find();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const createUser = async (req, resp) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    email: email,
    password: hassedPassword,
  };
  let response = new schema.userModel(data);
  let result = await response.save();
  resp.send(result);
};

const updateUser = async (req, resp) => {
  let { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let result = await schema.userModel.updateOne(
    { email: email },
    { $set: { password: hassedPassword } }
  );
  resp.send(result);
};

const deleteUser = async (req, resp) => {
  let { email } = req.body;
  let result = await schema.userModel.deleteMany(email);
  resp.send(result);
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let response = await schema.userModel.findOne({ email });

  if (response) {
    bcrypt.compare(password, response.password, (err, result) => {
      if (result) {
        let data = {
          status: 1,
          message: "Login Successfull",
          data: response,
        };
        resp.send(data);
      } else {
        let data = { message: "Worng Passord" };
        resp.send(data);
      }
    });
  } else {
    let data = { message: "Worng Email" };
    resp.send(data);
  }
};

module.exports = {
  listingUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
