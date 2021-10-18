const express = require("express");
const { body } = require("express-validator/check");

// Controller
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/feedController");

// Middleware
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// URL: /feed
router.get("/posts", isAuth, getPosts);
router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);
router.get("/post/:postId", getPost);
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);
router.delete("/post/:postId", deletePost);

module.exports = router;
