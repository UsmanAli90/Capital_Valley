const { generateOTP, sendEmail } = require("../utils/utils");

const emailVerifications = {}; // { email: { otp, expires } }

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    emailVerifications[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    };
    await sendEmail(email, "Signup Verification Code", `Your code is ${otp}.`);
    res.status(200).json({ message: "Verification code sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending code." });
  }
};

const verifyCode = (req, res) => {
  const { email, code } = req.body;
  const record = emailVerifications[email];
  if (
    record &&
    record.otp === code &&
    record.expires > Date.now()
  ) {
    delete emailVerifications[email];
    return res.status(200).json({ message: "Email verified!" });
  }
  res.status(400).json({ message: "Invalid or expired code." });
};

module.exports = { sendVerificationCode, verifyCode };