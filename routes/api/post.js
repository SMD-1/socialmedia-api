const express = require("express");
const imageKit = require("../../config/imgkit.js");
const fileUpload = require("express-fileupload");

const Post = require("../../model/Post");
const User = require("../../model/User");

const router = express.Router();
//this is to parse formdata file coming from frontend
router.use(fileUpload());

// router.get("/", (req, res) => {
//   res.send("This is post page");
// });

// create a post
router.post("/", async (req, res) => {
  try {
    if (req.files) {
      //upload img to imgkit to get img url
      var imgkitRes = await imageKit.upload({
        file: req.files.file.data,
        fileName: req.files.file.name,
      });
    }
    // now imgkitRes has url prop to access the image
    //so save that url in db
    const postToSave = {
      userId: req.body.userId,
      likes: req.body.likes,
      description: req.body.description,
      img: req.files ? imgkitRes.url : null,
    };
    const newPost = new Post(postToSave);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// update a post
router.patch("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated!");
    } else {
      res.status(403).json("You can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
    // console.log(err);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
    // console.log(err);
  }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("You liked the post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked!");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser?._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// get user's posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
