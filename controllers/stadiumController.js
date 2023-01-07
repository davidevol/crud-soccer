const fs = require('fs');

const stadiums = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/stadiums-simple.json`)
);



exports.checkID = (req, res, next, val) => {
  console.log(`Stadium id is: ${val}`);
  
  const id = parseInt(req.params.id);
  const stadium = stadiums.find((el) => el.id === id);

  if (!stadium) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
}

exports.changeStadium = (req, res) => {
  const id = parseInt(req.params.id);
  const stadium = stadiums.findIndex((el) => el.id === id);

  if (stadium.id == stadiums.find((el) => el.id === id)) {
    return res.status(404).json({
      status: 'fail',
      message: 'this ID does not exist',
    });
  } 

  const newStad = Object.assign({ id }, req.body);
  stadiums[stadium] = newStad;

  fs.writeFile(
    `${__dirname}/../dev-data/data/stadiums-simple.json`,
    JSON.stringify(stadiums),
    (err) => {
      res.status(200).json({
        status: 'sucess',
        data: {
          stadium: newStad,
        },
      });
      res.status(200).json(newStad);
    }
  );
  next();
};

exports.getAllStadiums = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    length: stadiums.length,
    data: {
      stadiums,
    },
  });
};

exports.getStadium = (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  const stadium = stadiums.find((el) => el.id === id);

  if (!stadium) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'sucess',
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

  fs.writeFile(
    `${__dirname}/../dev-data/data/stadiums-simple.json`,
    JSON.stringify(stadiums),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          stadium: newStad,
        },
      });
    }
  );
};

exports.deleteStadium = (req, res) => {
  const id = parseInt(req.params.id);
  const stadium = stadiums.find((el) => el.id === id);

  if (!stadium) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  stadiums.splice(id, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/stadiums-simple.json`,
    JSON.stringify(stadiums),
    (err) => {
      return res.status(200).json({
        status: 'sucess',
        data: {
          data: null,
        },
      });
    }
  );
};

