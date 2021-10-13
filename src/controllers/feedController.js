const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPost = (req, res) => {
  return res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/bgimage.jpg",
        creator: {
          name: "LST",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422) // 유효성 검사 실패 상태코드(422)
      .json({
        message: "Validation fail, entered data is incorrect.",
        errors: errors.array(),
      });
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
    console.log(error);
    return res.status(400).json({ message: "Server error!" });
  }
};
