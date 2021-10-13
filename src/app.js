require("./db");
const express = require("express");
const morgan = require("morgan");

const feedRoutes = require("./routes/feedRouter");

const app = express();
const logger = morgan("dev");

app.set("port", process.env.PORT || 4000);

app.use(logger);
app.use(express.json());

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

app.listen(app.get("port"), () =>
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`)
);
