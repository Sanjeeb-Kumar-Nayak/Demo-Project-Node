const connection = require("./database");

const listingUser = async (req, resp) => {
  let dbConnect = await connection();
  let response = await dbConnect.find().toArray();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const createUser = async (req, resp) => {
  let dbConnect = await connection();
  let result = await dbConnect.insertOne(req.body);
  resp.send(result);
};

const updateUser = async (req, resp) => {
  let { email, password } = req.body;
  let dbConnect = await connection();
  let result = await dbConnect.updateOne(
    { email: email },
    { $set: { password: password } }
  );
  resp.send(result);
};

const deleteUser = async (req, resp) => {
  let dbConnect = await connection();
  let result = await dbConnect.deleteOne(req.body);
  resp.send(result);
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    if (response.password === password) {
      let result = { status: 1, message: "Login Successfull", data: response };
      resp.send(result);
    } else {
      let result = { message: "Wrong Password" };
      resp.send(result);
    }
  } else {
    let result = { message: "Wrong Email" };
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
