const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Stadium = require("../models/stadiumModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked stadium
  const stadium = await Stadium.findById(req.params.stadiumId);
  console.log(stadium);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/my-stadiums/?stadium=${
      req.params.stadiumId
    }&user=${req.user.id}&price=${stadium.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/stadium/${stadium.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.stadiumId,
    line_items: [
      {
        name: `${stadium.name} Stadium`,
        description: stadium.summary,
        images: [
          `https://www.nastadiums.dev/img/stadiums/${stadium.imageCover}`,
        ],
        amount: stadium.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { stadium, user, price } = req.query;

  if (!stadium && !user && !price) return next();
  await Booking.create({ stadium, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
