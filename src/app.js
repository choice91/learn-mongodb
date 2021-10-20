const express = require("express");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const passport = require("passport");
const passportConfig = require("./passport");
require("dotenv").config();
require("./db");

const feedRouter = require("./routes/feedRouter");
const authRouter = require("./routes/authRouter");
const oAuthRouter = require("./routes/oAuthRouter");

const app = express();
const logger = morgan("dev");

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("port", process.env.PORT || 4000);

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "../", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
passportConfig();

app.use("/feed", feedRouter);
app.use("/auth", authRouter);
app.use("/oauth", oAuthRouter);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({ message, data });
});

app.listen(app.get("port"), () =>
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`)
);
