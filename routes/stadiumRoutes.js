const express = require("express");
const stadiumController = require("./../controllers/stadiumController");

const router = express.Router();

router.param("id", stadiumController.IdCheck);

router
  .route("/")
  .get(stadiumController.getAllStadiums)
  .post(stadiumController.addStadium);

router
  .route("/:id")
  .get(stadiumController.getStadium)
  .delete(stadiumController.deleteStadium)
  .patch(stadiumController.changeStadium);

module.exports = router;
