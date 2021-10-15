const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    // 사용자가 입력한 비밀번호와 DB에 저장된 비밀번호를 비교
    const isEqual = await bcrypt.compare(password, user.password);
    // isEqual이 false이면 error발생
    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }
    // JWT 토큰 생성
    const payload = {
      email: loadedUser.email,
      userId: loadedUser._id.toString(),
    };
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, process.env.JWT_KEY, options);
    return res
      .status(200)
      .json({
        ok: true,
        message: "Login success",
        token,
        userId: loadedUser._id.toString(),
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
