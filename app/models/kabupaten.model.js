const mongoose = require("mongoose");

const Kabupaten = mongoose.model(
    "Kabupaten",
    new mongoose.Schema({
        id: Number,
        id_provinsi: String,
        nama: String
    })
);

module.exports = Kabupaten;