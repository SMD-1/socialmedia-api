const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../model/User");

// update user
router.patch("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // update password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err.message);
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

// get all Users
// router.get("/", async (req, res) => {
//   try {
//     const allUser = await User.find();
//     console.log(allUser);
//     res.status(200).json(allUser);
//   } catch (err) {
//     console.log(err);
//   }
// });

// get user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    // if we dont want to show some property
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// recent 5 user
router.get("/fiveMostrecent", async (req, res) => {
  try {
    const recentUser = await User.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(recentUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// recent user
router.get("/mostrecent", async (req, res) => {
  try {
    const recentUser = await User.find().sort({ createdAt: -1 });
    // console.log(recentUser.data);
    res.status(200).json(recentUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // console.log("user", user);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture, fullName } = friend;
      // console.log("friend", friend);
      friendList.push({ _id, username, profilePicture, fullName });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //req.body.userId is id of person whom you want to follow, params id is your id
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("You already follow the user");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    res.status(403).json("You cannot follow yourself!");
  }
});

// unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself!");
  }
});

module.exports = router;
