const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbConnect = require("../mongodb/database");
const connection = require("../postgresql/config");
const cors = require("cors");
const app = express();
const jwtKey = "secret";

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.post("/user/login", async (req, resp) => {
  let data = await dbConnect();
  data = await data.find().toArray();
  let response = { status: 1, message: "Success", data: data };
  resp.send(response);
});

app.post("/userData", (req, resp) => {
  connection.query("select * from users", (err, result) => {
    if (err) {
      let data = { status: 0, message: "Failed", data: result };
      resp.send(data);
    } else {
      let data = { status: 1, message: "Success", data: result.rows };
      resp.send(data);
    }
  });
});

app.post("/createUser", async (req, resp) => {
  const { email, mobile, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  connection.query(
    "select * from users where email = $1 or mobile = $2",
    [email, mobile],
    (err, result) => {
      if (result.rowCount != 0) {
        connection.query(
          "select * from users where email = $1",
          [email],
          (err, result) => {
            if (result.rowCount != 0) {
              connection.query(
                "select * from users where mobile = $1",
                [mobile],
                (err, result) => {
                  if (result.rowCount != 0) {
                    let data = {
                      status: 0,
                      message: "Email & Mobile Already Exist",
                    };
                    resp.send(data);
                  } else {
                    let data = { status: 0, message: "Email Already Exist" };
                    resp.send(data);
                  }
                }
              );
            } else {
              let data = { status: 0, message: "Mobile Already Exist" };
              resp.send(data);
            }
          }
        );
      } else {
        connection.query(
          "insert into users (email, mobile, name, password) values ($1, $2, $3, $4) returning *",
          [email, mobile, name, hassedPassword],
          (err, result) => {
            let data = {
              status: 1,
              message: "User Created Successfully",
              data: result.rows[0],
            };
            resp.send(data);
          }
        );
      }
    }
  );
});

app.post("/loginUser", async (req, resp) => {
  const { email, password } = req.body;

  connection.query(
    "select * from users where email = $1",
    [email],
    (err, result) => {
      if (result.rowCount != 0) {
        const userDetails = result.rows[0];
        const userPassword = userDetails.password;
        bcrypt.compare(password, userPassword, (err, result) => {
          if (result) {
            jwt.sign(userDetails, jwtKey, (err, result) => {
              if (err) {
                let data = {
                  status: 0,
                  message: "User not found",
                };
                resp.send(data);
              } else {
                let data = {
                  status: 1,
                  message: "Login Successfully",
                  data: userDetails,
                  token: result,
                };
                resp.send(data);
              }
            });
          } else {
            let data = {
              status: 0,
              message: "Wrong Password",
            };
            resp.send(data);
          }
        });
      } else {
        let data = {
          status: 0,
          message: "Wrong Email",
        };
        resp.send(data);
      }
    }
  );
});

app.post("/changePassword", verifyToken, async (req, resp) => {
  const token = req.body["token"];
  const decodeToken = jwt.decode(token, jwtKey);
  const id = parseInt(decodeToken.id);
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(confirmPassword, salt);

  connection.query("select * from users where id = $1", [id], (err, result) => {
    const userPassword = result.rows[0].password;
    bcrypt.compare(currentPassword, userPassword, (err, result) => {
      if (result) {
        if (newPassword == confirmPassword) {
          connection.query(
            "update users set password = $1 where id = $2",
            [hassedPassword, id],
            (err, result) => {
              let data = {
                status: 1,
                message: "Password Changed Successfully",
              };
              resp.send(data);
            }
          );
        } else {
          let data = { status: 0, message: "Password does not match" };
          resp.send(data);
        }
      } else {
        let data = { status: 0, message: "Enter Wrong Password" };
        resp.send(data);
      }
    });
  });
});

app.post("/forgotPassword/sendOtp", (req, resp) => {
  const { email } = req.body;
  connection.query(
    "select * from users where email = $1",
    [email],
    (err, result) => {
      if (result.rowCount != 0) {
        let data = { status: 1, message: "Send OTP" };
        resp.send(data);
      } else {
        let data = { status: 0, message: "User does not exist" };
        resp.send(data);
      }
    }
  );
});

app.post("/forgotPassword/resetPassword", verifyToken, async (req, resp) => {
  const token = req.body["token"];
  const decodeToken = jwt.decode(token, jwtKey);
  const id = parseInt(decodeToken.id);
  const { newPassword, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(confirmPassword, salt);

  if (newPassword == confirmPassword) {
    connection.query(
      "update users set password = $1 where id = $2",
      [hassedPassword, id],
      (err, result) => {
        let data = { status: 1, message: "Reset Password Successfully" };
        resp.send(data);
      }
    );
  } else {
    let data = { status: 0, message: "Password does not match" };
    resp.send(data);
  }
});

app.post("/updateUser", verifyToken, async (req, resp) => {
  const token = req.body["token"];
  const decodeToken = jwt.decode(token, jwtKey);
  const id = parseInt(decodeToken.id);
  const { email, mobile, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  connection.query(
    "update users set email = $1, mobile = $2, name = $3, password = $4 where id = $5",
    [email, mobile, name, hassedPassword, id],
    (err, result) => {
      let data = {
        status: 1,
        message: "User Updated Successfully",
      };
      resp.send(data);
    }
  );
});

app.post("/deleteUser", verifyToken, (req, resp) => {
  const token = req.body["token"];
  const decodeToken = jwt.decode(token, jwtKey);
  const id = parseInt(decodeToken.id);

  connection.query("delete from users where id = $1", [id], (err, result) => {
    let data = {
      status: 1,
      message: "User Deleted Successfully",
    };
    resp.send(data);
  });
});

function verifyToken(req, resp, next) {
  const token = req.body["token"];
  if (token) {
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        let data = {
          status: 0,
          message: "Please provide valid token",
        };
        resp.status(401).send(data);
      } else {
        next();
      }
    });
  } else {
    let data = {
      status: 0,
      message: "Please add token",
    };
    resp.status(403).send(data);
  }
}

app.listen(8080);
