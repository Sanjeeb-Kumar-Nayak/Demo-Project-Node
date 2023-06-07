const express = require("express");
const jwt = require("jsonwebtoken");
const dbConnect = require("../mongodb/database");
const connection = require("../postgresql/config");
const cors = require("cors");
const app = express();

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

app.post("/createUser", (req, resp) => {
  const { email, mobile, name, password } = req.body;
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
          [email, mobile, name, password],
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

app.post("/loginUser", (req, resp) => {
  const { email, password } = req.body;
  connection.query(
    "select * from users where email = $1 or password = $2",
    [email, password],
    (err, result) => {
      if (result.rowCount != 0) {
        connection.query(
          "select * from users where email = $1",
          [email],
          (err, result) => {
            if (result.rowCount != 0) {
              connection.query(
                "select * from users where password = $1",
                [password],
                (err, result) => {
                  if (result.rowCount != 0) {
                    let data = {
                      status: 1,
                      message: "Login Successfully",
                      data: result.rows,
                    };
                    resp.send(data);
                  } else {
                    let data = {
                      status: 1,
                      message: "Wrong Password",
                      data: result.rows,
                    };
                    resp.send(data);
                  }
                }
              );
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
      } else {
        let data = { status: 1, message: "Wrong Email & Password", data: result.rows };
        resp.send(data);
      }
    }
  );
});

app.post("/changePassword/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const { currentPassword, newPassword, confirmPassword } = req.body;
  connection.query(
    "select * from users where id = $1 and password = $2",
    [id, currentPassword],
    (err, result) => {
      if (result.rowCount != 0) {
        if (newPassword == confirmPassword) {
          connection.query(
            "update users set password = $1 where id = $2",
            [confirmPassword, id],
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
    }
  );
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

app.post("/forgotPassword/resetPassword/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const { newPassword, confirmPassword } = req.body;
  if (newPassword == confirmPassword) {
    connection.query(
      "update users set password = $1 where id = $2",
      [confirmPassword, id],
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

app.post("/updateUser/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const { email, mobile, name, password } = req.body;
  connection.query(
    "update users set email = $1, mobile = $2, name = $3, password = $4 where id = $5",
    [email, mobile, name, password, id],
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
