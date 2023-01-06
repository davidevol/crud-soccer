const express = require('express');
const stadControl = require('./../controllers/stadiumController');

const router = express.Router();

router.route('/').get(stadControl.getAllStadiums).post(stadControl.addStadium);

router
  .route('/:id')
  .get(stadControl.getStadium)
  .delete(stadControl.deleteStadium)
  .patch(stadControl.changeStadium);

module.exports = router;
