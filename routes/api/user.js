const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../model/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // update password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      console.log(user);
      res.status(200).json("Account has been Updated Successfully");
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    return res.status(403).json("You can only update your profile!");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      console.log(user);
      res.status(200).json("Account has been Deleted!!");
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    return res.status(403).json("You can only delete your profile!");
  }
});

// gat user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // if we dont want to show some property
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
