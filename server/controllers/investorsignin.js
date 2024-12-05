const investoruser= require('../models/Investordb')


const InvestorsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const investoruser1 = await investoruser.findOne({ email });

    if (!investoruser1) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (investoruser1.password !== password) {
      console.log("password is ", req.password)
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Sign-in successful", user: investoruser1.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { InvestorsignIn };
