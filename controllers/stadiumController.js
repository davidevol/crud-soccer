const Stadium = require("./../models/stadiumModel");

const sourceDirectory = `${__dirname}/../dev-data/data/stadiums-simple.json`;

const stadiums = JSON.parse(fs.readFileSync(sourceDirectory));

exports.IsBodyOkay = (req, res, next) => {
  if (!(req.body.name && req.body.difficulty))
    return res.status(400).json({
      status: "fail",
      message: "missing name or difficulty",
    });
  next();
};

exports.IdCheck = (req, res, next) => {
  const id = parseInt(req.params.id);
  const stadium = stadiums.find((el) => el.id === id);

  if (id > stadiums.length - 1 || !stadium)
    return res.status(404).json({
      status: "fail",
      message: "this id does not exist",
    });
  next();
};

exports.getAllStadiums = (req, res) => {
  res.status(200).json({
    status: "sucess",
    length: stadiums.length,
    data: {
      stadiums,
    },
  });
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
