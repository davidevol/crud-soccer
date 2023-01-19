const Stadium = require("./../models/stadiumModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

exports.aliasTopCheap = catchAsync(async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
});

exports.getAllStadiums = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Stadium.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const stadiums = await features.query;

  res.status(200).json({
    status: "success",
    length: stadiums.length,
    data: {
      stadiums,
    },
  });
});

exports.getStadium = catchAsync(async (req, res, next) => {
  const stadium = await Stadium.findById(req.params.id).params("reviews");

  res.status(200).json({
    status: "success",
    data: {
      stadium,
    },
  });
});

exports.createStadium = factory.createOne(Stadium)

exports.deleteStadium = factory.deleteOne(Stadium);

exports.updateStadium = factory.updateOne(Stadium);

exports.getStadiumStats = catchAsync(async (req, res, next) => {
  const stats = await Stadium.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Stadium.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        stadium: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
