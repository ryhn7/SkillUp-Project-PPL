const mongoose = require("mongoose");

const Mahasiswa = mongoose.model(
  "Mahasiswa",
  new mongoose.Schema({
    nim: {
      type: String,
      unique: true,
      required: [true, "NIM wajib diisi"],
      maxlength: [14, "NIM maksimal 14 karakter"],
    },
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
      maxlength: [50, "Nama maksimal 50 karakter"],
    },
    angkatan: {
      type: String,
      required: [true, "Angkatan wajib diisi"],
      maxlength: [4, "Angkatan maksimal 4 karakter"],
    },
    email: {
      type: String,
      unique: true,
      maxlength: [50, "Email maksimal 50 karakter"],
    },
    alamat: {
      type: String,
      maxlength: [100, "Alamat maksimal 100 karakter"],
    },
    phone: {
      type: String,
      unique: true,
      maxlength: [12, "No telepon maksimal 12 karakter"],
    },
    kodeWali: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dosen",
    },
    kodeKab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kabupaten",
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Status wajib diisi"],
      ref: "Status",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = Mahasiswa;
