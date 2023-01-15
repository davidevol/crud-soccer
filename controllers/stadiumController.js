const Stadium = require("./../models/stadiumModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopCheap = catchAsync(async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
});

exports.getAllStadiums = catchAsync(async (req, res) => {
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

exports.getStadium = catchAsync(async (req, res) => {
  const stadium = await Stadium.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      stadium,
    },
  });
});

exports.addStadium = catchAsync(async (req, res) => {
  const newStadium = await Stadium.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      stadium: newStadium,
    },
  });
});

exports.deleteStadium = catchAsync(async (req, res) => {
  await Stadium.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

exports.changeStadium = catchAsync(async (req, res) => {
  const stadium = await Stadium.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      stadium,
    },
  });
});

exports.getStadiumStats = catchAsync(async (req, res) => {
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

exports.getMonthlyPlan = catchAsync(async (req, res) => {
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
