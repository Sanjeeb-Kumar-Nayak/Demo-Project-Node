const connection = require("./userDatabase");

const ListingUser = async (req, resp) => {
  let dbConnect = await connection();
  let response = await dbConnect.find().toArray();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const CreateUser = async (req, resp) => {
  let dbConnect = await connection();
  let result = await dbConnect.insertOne(req.body);
  resp.send(result);
};

module.exports = {
  ListingUser,
  CreateUser,
};
