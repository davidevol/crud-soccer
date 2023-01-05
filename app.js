const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // middleware

const stadiums = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/stadiums-simple.json`)
);

app.get('/api/v1/stadiums', (req, res) => {
  res.status(200).json({
    status: 'sucess',
    length: stadiums.length,
    data: {
      stadiums,
    },
  });
});

app.get('/api/v1/stadiums/:id', (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.id);
    const stadium = stadiums.find(el => el.id === id);

    if (!stadium){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
      status: 'sucess',
      length: stadiums.length,
      data: {
        stadium
      },
    });
  });

app.post('/api/v1/stadiums', (req, res) => {
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
});

// listen
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});