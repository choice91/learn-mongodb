const express = require("express");
const { body } = require("express-validator/check");

const {
  getPosts,
  createPost,
  getPost,
} = require("../controllers/feedController");

const router = express.Router();

// URL: /feed
router.get("/posts", getPosts);
router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);
router.get("/post/:postId", getPost);

module.exports = router;
