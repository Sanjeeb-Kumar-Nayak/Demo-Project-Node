const connection = require("./userDatabase");

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

module.exports = {
  listingUser,
  createUser,
  updateUser,
  deleteUser,
};
