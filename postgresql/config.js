const {Client} = require('pg');
const connection = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "tilu1994",
    database: "system"
})

connection.connect();

module.exports = connection;