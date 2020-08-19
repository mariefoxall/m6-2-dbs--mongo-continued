"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("mongo_workshop_2");
    const seats = await db.collection("seats").find().toArray();
    const newSeats = {};

    seats.forEach((seat) => {
      newSeats[seat._id] = seat;
    });

    console.log(newSeats);

    console.log(seats);
    res.status(200).json({
      status: 200,
      seats: newSeats,
      // bookedSeats: state.bookedSeats,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration } = req.body;
  //   let lastBookingAttemptSucceeded = false;
  console.log(seatId);
  const _id = seatId;

  try {
    const query = { _id };
    const bookedSeat = { $set: { isBooked: true } };
    await client.connect();
    const db = client.db("mongo_workshop_2");
    const thisSeat = await db.collection("seats").findOne(query);
    console.log(thisSeat);

    if (thisSeat.isbooked) {
      return res.status(400).json({
        message: "This seat has already been booked!",
      });
    }

    const r = await db.collection("seats").updateOne(query, bookedSeat);
    // console.log("result", r);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    // res.status(200).json({ status: 200, data: seatId, ...req.body });
    // const isAlreadyBooked = !!state.bookedSeats[seatId];

    if (!creditCard || !expiration) {
      return res.status(400).json({
        status: 400,
        message: "Please provide credit card information!",
      });
    }

    // if (lastBookingAttemptSucceeded) {
    //   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    //   return res.status(500).json({
    //     message: "An unknown error has occurred. Please try your request again.",
    //   });
    // }

    // lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    // state.bookedSeats[seatId] = true;

    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, data: seatId, message: error.message });
  }
};

module.exports = { getSeats, bookSeat };
