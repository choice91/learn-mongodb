require("./db");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const feedRoutes = require("./routes/feedRouter");

const app = express();
const logger = morgan("dev");

app.set("port", process.env.PORT || 4000);

app.use(logger);
app.use(express.json());
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

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({ message });
});

app.listen(app.get("port"), () =>
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`)
);
