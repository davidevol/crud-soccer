const Stadium = require("./../models/stadiumModel");

exports.getAllStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find();
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

exports.changeStadium = (req, res) => {
  const id = parseInt(req.params.id);
  const stadium = stadiums.findIndex((el) => el.id === id);

  const newStad = Object.assign({ id }, req.body);
  stadiums[stadium] = newStad;

  fs.writeFile(sourceDirectory, JSON.stringify(stadiums), (err) => {
    res.status(200).json({
      status: "sucess",
      data: {
        stadium: newStad,
      },
    });
  });
};
