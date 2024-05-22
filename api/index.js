const express = require("express");
const cors = require("cors");
const user = require("../postgresql/user");
const userMongoDB = require("../mongodb/user");
const userMongoose = require("../mongoose/user");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// PostgreSQL
app.post("/user/loginUser", user.loginUser);
app.post("/user/listingUser", user.listingUser);
app.post("/user/filterUser", user.filterUser);
app.post("/user/createUser", user.createUser);
app.post("/user/deleteUser", user.verifyToken, user.deleteUser);
app.post("/user/updateUser", user.verifyToken, user.updateUser);
app.post("/user/changePassword", user.verifyToken, user.changePassword);
app.post("/user/resetPassword", user.verifyToken, user.resetPassword);
app.post("/user/sendOtp", user.sendOtp);
app.post("/user/verifyOtp", user.verifyOtp);

// MongoDB
app.post("/usermongodb/listingUser", userMongoDB.listingUser);
app.post("/usermongodb/createUser", userMongoDB.createUser);
app.post("/usermongodb/updateUser", userMongoDB.updateUser);
app.post("/usermongodb/deleteUser", userMongoDB.deleteUser);
app.post("/usermongodb/loginUser", userMongoDB.loginUser);
app.post("/usermongodb/sendOtp", userMongoDB.sendOtp);

// Mongoose
app.post("/usermongoose/listingUser", userMongoose.listingUser);
app.post("/usermongoose/createUser", userMongoose.createUser);
app.post("/usermongoose/updateUser", userMongoose.updateUser);
app.post("/usermongoose/deleteUser", userMongoose.deleteUser);
app.post("/usermongoose/loginUser", userMongoose.loginUser);

app.listen(8080);
