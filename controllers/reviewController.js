const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.stadiumId) filter = { stadium: req.params.stadiumId };

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setStadiumUserIds = (req, res, next) => {
  if (!req.body.stadium) req.body.stadium = req.params.stadiumId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review)

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
