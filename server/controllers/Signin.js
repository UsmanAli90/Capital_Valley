const User = require('../models/user');

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    console.log("USer email before finding is ",{email})

    
    const user = await User.findOne( {email} );
    console.log("Queried User:", user);



    console.log("Email:", email); 
    console.log("Password:", password); 
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      console.log("password is ", req.password)
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Sign-in successful", user: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signIn };
