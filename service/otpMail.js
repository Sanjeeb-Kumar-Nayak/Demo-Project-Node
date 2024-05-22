const nodeMailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "skn.tilu@gmail.com",
    pass: "tlmjmznltgayumjw",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

module.exports = {
  transporter,
  generateOTP,
};
