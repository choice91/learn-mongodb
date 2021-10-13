const express = require("express");
const { body } = require("express-validator/check");

const { getPost, createPost } = require("../controllers/feedController");

const router = express.Router();

// URL: /feed
router.get("/posts", getPost);
router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

module.exports = router;
