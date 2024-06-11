const schema = require("./schema");
const bcrypt = require("bcrypt");
const otpMail = require("../service/otpMail");

const createUser = async (req, resp) => {
  // for multipart/form-data
  const userData = JSON.parse(req.body.userDetails);
  const userDocument = req.files;

  // for json
  const { name, mobile, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    email: email,
    password: hassedPassword,
  };

  const response1 = await schema.userModel.findOne({ email });

  if (response1) {
    let result = { status: 0, message: "User Already Exist" };
    resp.send(result);
  } else {
    let response2 = new schema.userModel(data);
    let result = await response2.save();
    resp.send(result);
  }
};

const listingUser = async (req, resp) => {
  const { email, mobile, name, page, size } = req.body;
  const skip = page * 10;

  let filter = {};

  if (email) filter.email = email;
  if (mobile) filter.mobile = mobile;
  if (name) filter.name = name;

  const totalItems = await schema.userModel.countDocuments(filter);
  const response = await schema.userModel.find(filter).skip(skip).limit(size);

  if (response) {
    let result = {
      status: 1,
      message: "Success",
      totalItems: totalItems,
      data: response,
    };
    resp.send(result);
  } else {
    let result = { status: 0, message: "Failed" };
    resp.send(result);
  }
};

const updateUser = async (req, resp) => {
  const { email, mobile, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    password: hassedPassword,
  };

  const response = await schema.userModel.findOne({ email });

  if (response) {
    let result = await schema.userModel.updateOne(
      { email: email },
      { $set: data }
    );
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const changePassword = async (req, resp) => {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(confirmPassword, salt);

  const response = await schema.userModel.findOne({ email });

  if (response) {
    bcrypt.compare(currentPassword, response.password, async (err, result) => {
      if (result) {
        if (newPassword == confirmPassword) {
          let data = await schema.userModel.updateOne(
            { email: email },
            { $set: { password: hassedPassword } }
          );
          resp.send(data);
        } else {
          let data = { status: 0, message: "Password does not match" };
          resp.send(data);
        }
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

const deleteUser = async (req, resp) => {
  const { email } = req.body;
  const response = await schema.userModel.findOne({ email });

  if (response) {
    let result = await schema.userModel.deleteOne({ email });
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const loginUser = async (req, resp) => {
  const { email, password } = req.body;
  const response = await schema.userModel.findOne({ email });

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

  const response = await schema.userModel.findOne({ email });

  if (response) {
    otpMail.transporter.sendMail(mailOption, async (err, info) => {
      if (err) {
        console.log(err);
      } else {
        let result = await schema.userModel.updateOne(
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
  const response = await schema.userModel.findOne({ email });

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

const resetPassword = async (req, resp) => {
  const { email, newPassword, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(confirmPassword, salt);

  const response = await schema.userModel.findOne({ email });

  if (response) {
    if (newPassword === confirmPassword) {
      let data = await schema.userModel.updateOne(
        { email: email },
        { $set: { password: hassedPassword } }
      );
      resp.send(data);
    } else {
      let data = { status: 0, message: "Password does not match" };
      resp.send(data);
    }
  } else {
    let data = { status: 0, message: "Wrong Email" };
    resp.send(data);
  }
};

module.exports = {
  createUser,
  listingUser,
  updateUser,
  changePassword,
  deleteUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
};
