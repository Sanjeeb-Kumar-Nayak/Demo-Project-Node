const express = require("express");
const cors = require("cors");
const user = require("../express/user");
const app = express();

app.use(express.json());

app.use(
    cors({
      origin: "*",
    })
  );

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

app.listen(8080);