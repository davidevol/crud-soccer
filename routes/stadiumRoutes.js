const express = require("express");
const stadiumController = require("./../controllers/stadiumController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:stadiumId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(stadiumController.aliasTopStadiums, stadiumController.getAllStadiums);

router.route("/stadium-stats").get(stadiumController.getStadiumStats);

router
  .route("/stadium-within/:distance/center/:latlng/unit/:unit")
  .get(stadiumController.getStadiumsWithin);

router
  .route("/distances/:latlng/unit/:unit")
  .get(stadiumController.getDistances);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    stadiumController.getMonthlyPlan
  );

router
  .route("/")
  .get(stadiumController.getAllStadiums)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    stadiumController.createStadium
  );

router
  .route("/:id")
  .get(stadiumController.getStadium)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    stadiumController.updateStadium
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    stadiumController.deleteStadium
  );

module.exports = router;
