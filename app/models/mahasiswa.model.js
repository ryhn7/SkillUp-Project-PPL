const mongoose = require("mongoose");

const Mahasiswa = mongoose.model(
  "Mahasiswa",
  new mongoose.Schema({
    name: String,
    nim: String,
    email: String,
    alamat: String,
    avatar: String,
    kode_provinsi: String,
    kode_kabupaten: String,
    angkatan: String,
    doswal: String,
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
    noHP: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = Mahasiswa;
