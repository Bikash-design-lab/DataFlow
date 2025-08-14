const express = require("express")
const userRoute = express.Router();

const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/user.model");

// healthy test endpoint
userRoute.get("/home", (req, res) => {
  res.json({ message: "This is home endpoint route." });
});

// user signup
userRoute.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const isUser = await UserModel.findOne({ email })
    if (isUser) {
      return res.status(409).json({ message: "User already registered. Please sign in to continue." })
    }
    const user = await UserModel.create({ ...req.body })

    return res.status(200).json({ message: "Signup successful!", user });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error })
  }
})

// user signin
userRoute.post("/signin", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email, password: req.body.password })
    if (!user) {
      return res.status(409).json({ message: "No account found with this email. Please sign up first." })
    }
    const token = jwt.sign({ userID: user._id }, process.env.SECURED_KEY)
    return res.status(200).json({ message: "Signin successful! Welcome back.", user, token })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error })
  }
})


module.exports = { userRoute };
