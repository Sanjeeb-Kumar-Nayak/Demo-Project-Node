const { Client } = require("pg");

const connection = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "tilu1994",
  database: "system",
});

connection
  .connect()
  .then(() => console.log("Connected to the postgresql database successfully"))
  .catch((err) =>
    console.error("Postgresql database connection error", err.stack)
  );

module.exports = connection;
