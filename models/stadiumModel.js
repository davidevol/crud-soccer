const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A stadium must have a name"],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A stadium must have a price"],
  },
});

const Stadium = mongoose.model("StadiumDB", stadiumSchema);

module.exports = Stadium;
