const express = require("express");
const stadiumController = require("./../controllers/stadiumController");
const authController = require("./../controllers/authController")

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(stadiumController.aliasTopCheap, stadiumController.getAllStadiums);

router.route("/stadium-stats").get(stadiumController.getStadiumStats);
router.route("/monthly-plan/:year").get(stadiumController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, stadiumController.getAllStadiums)
  .post(stadiumController.addStadium);

router
  .route("/:id")
  .get(stadiumController.getStadium)
  .delete(stadiumController.deleteStadium)
  .patch(stadiumController.changeStadium);

module.exports = router;
