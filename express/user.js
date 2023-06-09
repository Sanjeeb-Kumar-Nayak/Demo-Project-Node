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
              data: result.rows,
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
        const userPassword = result.rows[0].password;
        bcrypt.compare(password, userPassword, (err, result) => {
          if (result) {
            jwt.sign({ result }, jwtKey, (err, token) => {
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
                  data: result.rows,
                  auth: token,
                };
                resp.send(data);
              }
            });
          } else {
            let data = {
              status: 1,
              message: "Wrong Password",
              data: result.rows,
            };
            resp.send(data);
          }
        });
      } else {
        let data = {
          status: 1,
          message: "Wrong Email",
          data: result.rows,
        };
        resp.send(data);
      }
    }
  );
});

app.post("/changePassword/:id", async (req, resp) => {
  const id = parseInt(req.params.id);
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
        let data = { status: 0, message: "Send OTP" };
        resp.send(data);
      } else {
        let data = { status: 0, message: "User does not exist" };
        resp.send(data);
      }
    }
  );
});

app.post("/forgotPassword/resetPassword/:id", async (req, resp) => {
  const id = parseInt(req.params.id);
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

app.post("/updateUser/:id", async (req, resp) => {
  const id = parseInt(req.params.id);
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

app.post("/deleteUser/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  connection.query("delete from users where id = $1", [id], (err, result) => {
    let data = {
      status: 1,
      message: "User Deleted Successfully",
    };
    resp.send(data);
  });
});

app.listen(8080);
