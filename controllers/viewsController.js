const Stadium = require("../models/stadiumModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get stadium data from collection
  const stadiums = await Stadium.find();

  // 2) Build template
  // 3) Render that template using stadium data from 1)
  res.status(200).render("overview", {
    title: "All Stadiums",
    stadiums,
  });
});

exports.getStadium = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested stadium (including reviews and guides)
  const stadium = await Stadium.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!stadium) {
    return next(new AppError("There is no stadium with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("stadium", {
    title: `${stadium.name} Stadium`,
    stadium,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.getMyStadiums = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find stadiums with the returned IDs
  const stadiumIDs = bookings.map((el) => el.stadium);
  const stadiums = await Stadium.find({ _id: { $in: stadiumIDs } });

  res.status(200).render("overview", {
    title: "My Stadiums",
    stadiums,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
