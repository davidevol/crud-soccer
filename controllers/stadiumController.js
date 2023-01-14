const Stadium = require("./../models/stadiumModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopCheap = (req, res, next) => {
  try {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  next();
};

exports.getAllStadiums = async (req, res) => {
  try {
    const features = new APIFeatures(Stadium.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const stadiums = await features.query;

    res.status(200).json({
      status: "sucess",
      length: stadiums.length,
      data: {
        stadiums,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    res.status(200).json({
      status: "sucess",
      data: {
        stadium,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.addStadium = async (req, res) => {
  try {
    const newStadium = await Stadium.create(req.body);

    res.status(201).json({
      status: "sucess",
      data: {
        stadium: newStadium,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.changeStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "sucess",
      data: {
        stadium,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getStadiumStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
