const mongoose = require("mongoose");

const Status = mongoose.model(
  "Status",
  new mongoose.Schema({
    name: String,
  })
);

module.exports = Status;
