const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    // 회원가입
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    return res
      .status(201)
      .json({ ok: true, message: "User created!", userId: user._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
