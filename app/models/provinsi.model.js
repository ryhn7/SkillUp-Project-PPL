const mongoose = require("mongoose");

const Provinsi = mongoose.model(
    "Provinsi",
    new mongoose.Schema({
        id: Number,
        nama: String,
    })
);

module.exports = Provinsi;