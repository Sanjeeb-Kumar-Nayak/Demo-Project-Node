const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const database = "e-com";

async function dbConnect() {
  await client.connect();
  let result = client.db(database);
  return result.collection("users");
}

module.exports = dbConnect;
