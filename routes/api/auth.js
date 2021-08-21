const express = require("express");
const router = express.Router();
const User = require("../../model/User");

// Register
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const newUser = new User({
    username: username,
    email: email,
    password: password,
  });

  try {
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
