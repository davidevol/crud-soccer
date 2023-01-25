const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.ObjectId,
    ref: "Stadium",
    required: [true, "Booking must belong to a Stadium!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "stadium",
    select: "name",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
