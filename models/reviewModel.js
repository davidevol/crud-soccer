const mongoose = require("mongoose");
const Stadium = require("./stadiumModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    stadium: {
      type: mongoose.Schema.ObjectId,
      ref: "Stadium",
      required: [true, "Review must belong to a stadium."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ stadium: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (stadiumId) {
  const stats = await this.aggregate([
    {
      $match: { stadium: stadiumId },
    },
    {
      $group: {
        _id: "$stadium",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Stadium.findByIdAndUpdate(stadiumId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Stadium.findByIdAndUpdate(stadiumId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calculateAverageRatings(this.stadium);
});


reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calculateAverageRatings(this.r.stadium);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
