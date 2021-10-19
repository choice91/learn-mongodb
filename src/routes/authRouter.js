const express = require("express");
const { body } = require("express-validator/check");

const {
  signup,
  emailVerified,
  login,
} = require("../controllers/authController");

const User = require("../models/user");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            return Promise.reject("Email address already exists!");
          }
        } catch (error) {
          console.log(error);
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);
router.get("/verification/:userId", emailVerified);
router.post("/login", login);

module.exports = router;
