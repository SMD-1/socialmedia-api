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
  console.log(req.body);
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
    const result = await newUser.save();
    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    !user && res.status(404).send("User not found!");

    const checkPassword = await bcrypt.compare(password, user.password);
    !checkPassword && res.status(400).send("Wrong password!");
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
