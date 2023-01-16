const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const stadiumRouter = require("./routes/stadiumRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const requestLimiter = rateLimit({
  max: 100,
  message: "there are too many requests!",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use("/api", requestLimiter);

app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/stadiums", stadiumRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
