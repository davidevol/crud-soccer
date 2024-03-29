const Review = require("./../models/reviewModel");
const factory = require("./../controllers/handlerFactory");

exports.setStadiumUserIds = (req, res, next) => {
  if (!req.body.stadium) req.body.stadium = req.params.stadiumId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
