const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// middleware

app.use(morgan('dev'));
app.use(express.json());
const stadiums = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/stadiums-simple.json`)
);

// route handlers

const getAllStadiums = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    length: stadiums.length,
    data: {
      stadiums,
    },
  });
};

const getStadium = (req, res) => {
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

const addStadium = (req, res) => {
  const newId = stadiums[stadiums.length - 1].id + 1; // fazendo de forma manual pela inexistencia de banco de dados!
  const newStad = Object.assign({ id: newId }, req.body);

  stadiums.push(newStad);

  fs.writeFile(
    `${__dirname}/dev-data/data/stadiums-simple.json`,
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

const deleteStadium = (req, res) => {
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

const changeStadium = (req, res) => {
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
    `${__dirname}/dev-data/data/stadiums-simple.json`,
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
};

// routes

app.route('/api/v1/stadiums').get(getAllStadiums).post(addStadium);

app
  .route('/api/v1/stadiums/:id')
  .get(getStadium)
  .delete(deleteStadium)
  .patch(changeStadium);

// start server

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
