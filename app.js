const fs = require('fs');
const express = require('express');

const app = express();

const stadiums = JSON.parse(
fs.readFileSync(`${__dirname}/dev-data/data/stadiums-simple.json`));

app.get('/api/v1/stadiums', (req, res) =>{
    res.status(200).json({
        status: 'sucess',
        length: stadiums.length,
        data: {
            stadiums
        }
    });
});

// listen
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});