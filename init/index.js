const mongoose = require("mongoose");
const initdata = require("../init/data");
const Listing = require("../models/listing");

let MONG_URL = "mongodb://127.0.0.1:27017/WonderLust";
main()
  .then((res) => {
    console.log("💻 Mongodb Connected");
  })
  .catch((err) => {
    console.error(err);
  });
async function main() {
  await mongoose.connect(MONG_URL);
}

let initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "65538f7c0ccee69468e1d175",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data was initalize");
};
initDB();
