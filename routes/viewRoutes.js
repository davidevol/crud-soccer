const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getOverview);

router.get(
  "/stadium/:slug",
  authController.isLoggedIn,
  viewsController.getStadium
);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);

router.get("/me", authController.protect, viewsController.getAccount);

router.get(
  "/my-stadiums",
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyStadiums
);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
