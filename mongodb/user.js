const connection = require("./database");
const bcrypt = require("bcrypt");

const listingUser = async (req, resp) => {
  let dbConnect = await connection();
  let response = await dbConnect.find().toArray();
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

  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    let result = { status: 0, message: "User Already Exist" };
    resp.send(result);
  } else {
    let result = await dbConnect.insertOne(data);
    resp.send(result);
  }
};

const updateUser = async (req, resp) => {
  let { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let dbConnect = await connection();
  let result = await dbConnect.updateOne(
    { email: email },
    { $set: { password: hassedPassword } }
  );
  resp.send(result);
};

const deleteUser = async (req, resp) => {
  let { email } = req.body;
  let dbConnect = await connection();
  let result = await dbConnect.deleteOne(email);
  resp.send(result);
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

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
        let data = { message: "Wrong Password" };
        resp.send(data);
      }
    });
  } else {
    let data = { message: "Wrong Email" };
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
