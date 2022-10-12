const mongoose = require("mongoose");

const IRS = mongoose.model(
  "IRS",
  new mongoose.Schema({
    semester: String,
    sks: String,
    file: String,
    mahasiswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mahasiswa",
    },
  })
);

module.exports = IRS;
