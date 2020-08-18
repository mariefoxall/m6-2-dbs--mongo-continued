const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const router = require("express").Router();
// const { delay } = require("./helpers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}
// console.log(seats);

const seatsArray = Object.values(seats);

console.log(seatsArray);

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("mongo_workshop_2");
    const r = await db.collection("seats").insertMany(seatsArray);
    assert.equal(seatsArray.length, r.insertedCount);
    console.log({ status: 201, data: seatsArray, message: "you did it!" });
  } catch (err) {
    console.log(err.stack);
    console.log({ status: 500, data: seatsArray, message: err.message });
  }
  client.close();
};

batchImport();
