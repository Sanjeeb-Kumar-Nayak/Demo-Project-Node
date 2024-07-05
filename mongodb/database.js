const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const database = "e-com";

async function dbConnect() {
  try {
    await client.connect();
    console.log("Connected to the mongodb database successfully");
    let result = client.db(database);
    return result.collection("users");
  } catch (error) {
    console.error("MongoDB database connecton error", error);
    throw error;
  }
}

module.exports = dbConnect;
