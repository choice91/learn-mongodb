const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res
      .status(200)
      .json({ ok: true, message: "Fetched posts successfully", posts });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      imageUrl: "images/bgimage.jpg",
      creator: { name: "LST" },
    });
    if (!post) {
      return res.json({ message: "Post created fail!" });
    }
    return res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ ok: true, message: "Post fetched", post });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
