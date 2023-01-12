const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const stadiumRouter = require("./routes/stadiumRoutes");

const app = express();

const requestLimiter = rateLimit({
  max: 100,
  message: "there are too many requests!",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(requestLimiter);

app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/stadiums", stadiumRouter);

module.exports = app;
