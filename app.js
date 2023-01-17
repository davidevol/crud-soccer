const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const stadiumRouter = require("./routes/stadiumRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const requestLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "there are too many requests!",
});
app.use("/api", requestLimiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/stadiums", stadiumRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
