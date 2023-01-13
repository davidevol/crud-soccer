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

exports.getStadium = (req, res) => {
  const id = parseInt(req.params.id);
  const stadium = stadiums.find((el) => el.id === id);

  res.status(200).json({
    status: "sucess",
    length: stadiums.length,
    data: {
      stadium,
    },
  });
};

exports.addStadium = (req, res) => {
  const newId = stadiums[stadiums.length - 1].id + 1; // fazendo de forma manual pela inexistencia de banco de dados!
  const newStad = Object.assign({ id: newId }, req.body);

  stadiums.push(newStad);

  fs.writeFile(sourceDirectory, JSON.stringify(stadiums), (err) => {
    res.status(201).json({
      status: "sucess",
      data: {
        stadium: newStad,
      },
    });
  });
};

exports.deleteStadium = (req, res) => {
  const id = parseInt(req.params.id);

  stadiums.splice(id, 1);

  fs.writeFile(sourceDirectory, JSON.stringify(stadiums), (err) => {
    return res.status(204).end();
  });
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
