const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");

// get
router.get("/register", (req, res) => {
  res.send("auth page");
});

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // save user
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log("error", err.message);
    res.status(409).json({ message: err.message, statusCode: err.code });
    // console.log(err.status);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ msg: "User not found!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(401).json({ msg: "Password didn't match" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error!" });
  }
});

module.exports = router;
