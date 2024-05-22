const connection = require("./database");
const bcrypt = require("bcrypt");
const otpMail = require("../service/otpMail");

const listingUser = async (req, resp) => {
  let dbConnect = await connection();
  let response = await dbConnect.find().toArray();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const createUser = async (req, resp) => {
  const { name, mobile, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    email: email,
    password: hassedPassword,
  };

  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    let result = { status: 0, message: "User Already Exist" };
    resp.send(result);
  } else {
    let result = await dbConnect.insertOne(data);
    resp.send(result);
  }
};

const updateUser = async (req, resp) => {
  let { email, mobile, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    password: hassedPassword,
  };

  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    let result = await dbConnect.updateOne({ email: email }, { $set: data });
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const deleteUser = async (req, resp) => {
  let { email } = req.body;
  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    let result = await dbConnect.deleteOne({ email });
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    bcrypt.compare(password, response.password, (err, result) => {
      if (result) {
        let data = {
          status: 1,
          message: "Login Successfull",
          data: response,
        };
        resp.send(data);
      } else {
        let data = { status: 0, message: "Wrong Password" };
        resp.send(data);
      }
    });
  } else {
    let data = { status: 0, message: "Wrong Email" };
    resp.send(data);
  }
};

const sendOtp = async (req, resp) => {
  const { email } = req.body;
  const otp = otpMail.generateOTP();

  var mailOption = {
    from: "skn.tilu@gmail.com",
    to: email,
    subject: "OTP",
    text: `User verification OTP: ${otp}`,
  };

  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    otpMail.transporter.sendMail(mailOption, async (err, info) => {
      if (err) {
        console.log(err);
      } else {
        let result = await dbConnect.updateOne(
          { email: email },
          { $set: { otp } }
        );
        resp.send(result);
      }
    });
  } else {
    let data = { status: 0, message: "Email does not exist" };
    resp.send(data);
  }
};

const verifyOtp = async (req, resp) => {
  const { email, otp } = req.body;
  let dbConnect = await connection();
  let response = await dbConnect.findOne({ email });

  if (response) {
    if (otp == response.otp) {
      let data = {
        status: 1,
        message: "OTP verified Successfully",
      };
      resp.send(data);
    } else {
      let data = { status: 0, message: "OTP does not match" };
      resp.send(data);
    }
  } else {
    let data = { status: 0, message: "Wrong Email" };
    resp.send(data);
  }
};

module.exports = {
  listingUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  sendOtp,
  verifyOtp,
};
