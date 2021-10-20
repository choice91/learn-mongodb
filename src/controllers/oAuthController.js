const jwt = require("jsonwebtoken");

exports.naverLogin = (req, res, next) => {
  const { email, _id } = req.user;
  try {
    const payload = {
      email: email,
      userId: _id,
    };
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, process.env.JWT_KEY, options);
    return res
      .status(200)
      .redirect(`http://localhost:3000/naver?token=${token}&userId=${_id}`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
