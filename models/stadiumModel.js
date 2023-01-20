const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const stadiumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A stadium must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A stadium name must have less or equal then 40 characters",
      ],
      minlength: [
        10,
        "A stadium name must have more or equal then 10 characters",
      ],
      // validate: [validator.isAlpha, 'Stadium name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A stadium must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A stadium must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A stadium must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A stadium must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current document on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A stadium must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A stadium must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretStadium: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

stadiumSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
stadiumSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "stadium",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
stadiumSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// stadiumSchema.pre('find', function(next) {
stadiumSchema.pre(/^find/, function (next) {
  this.find({ secretStadium: { $ne: true } });

  this.start = Date.now();
  next();
});

stadiumSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

stadiumSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Stadium = mongoose.model("Stadium", stadiumSchema);

module.exports = Stadium;
