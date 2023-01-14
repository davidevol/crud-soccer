const Stadium = require("./../models/stadiumModel");

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
    const queryObject = { ...req.query };
    const excludedQueryFields = ["page", "sort", "limit", "fields"];
    excludedQueryFields.forEach((el) => delete queryObject[el]);

    // enable regular symbols to filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Stadium.find(JSON.parse(queryString));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pages
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberStadiums = await Stadium.countDocuments();
      if (skip >= numberStadiums) throw new Error("This page does not exist");
    }

    // Execute the query
    const stadiums = await query; // query.sort().select().skip().limit()

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
