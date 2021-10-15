const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", "..", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    const count = await Post.find({}).countDocuments();
    totalItems = count;
    const posts = await Post.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({
      ok: true,
      message: "Fetched posts successfully",
      posts,
      totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
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
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const {
    body: { title, content },
    file: { path: imageUrl },
  } = req;
  try {
    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl.replace("\\", "/"),
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

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const {
    params: { postId },
    body: { title, content },
  } = req;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl.replace("\\", "/");
    post.content = content;
    await post.save();
    return res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    clearImage(post.imageUrl);
    const result = await Post.findByIdAndRemove(postId);
    console.log(result);
    return res.status(200).json({ message: "Delete post" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
