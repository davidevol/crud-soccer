const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stadium = require("./../../models/stadiumModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected sucessful!"));

const stadiums = JSON.parse(
  fs.readFileSync(`${__dirname}/stadiums-simple.json`, "utf-8")
);

const importData = async () => {
  try {
    await Stadium.create(stadiums);
    console.log("sucess data");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Stadium.deleteMany();
    console.log("sucess deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}