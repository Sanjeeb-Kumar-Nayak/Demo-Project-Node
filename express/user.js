const express = require("express");
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
    let data = { status: 1, message: "Success", data: result.rows };
    resp.send(data);
  });
});

app.post("/createUser", (req, resp) => {
  const { email, mobile, name, password } = req.body;
  connection.query(
    "insert into users (email, mobile, name, password) values ($1, $2, $3, $4) returning *",
    [email, mobile, name, password],
    (err, result) => {
      let data = { status: 1, message: "Successfully User Created", data: result.rows };
      resp.send(data);
    }
  );
});

app.post("/updateUser/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const { email, mobile, name, password } = req.body;
  connection.query(
    "update users set email = $1, mobile = $2, name = $3, password = $4 where id = $5",
    [email, mobile, name, password, id],
    (err, result) => {
      let data = { status: 1, message: "Successfully User Updated", data: result };
      resp.send(data);
    }
  );
});

app.post("/deleteUser/:id", (req,resp) => {
  const id = parseInt(req.params.id);
  connection.query("delete from users where id = $1", [id] ,(err, result) => {
    let data = { status: 1, message: "Successfully User Deleted", data: result };
      resp.send(data);
  })
})

app.listen(8080);
