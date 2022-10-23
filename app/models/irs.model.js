const mongoose = require("mongoose");

const IRS = mongoose.model(
  "IRS",
  new mongoose.Schema({
    semester_aktif: {
      type: Number,
      required: [true, "Semester aktif wajib diisi"],
      maxlength: [2, "Semester aktif maksimal 2 karakter"],
    },
    sks: {
      type: Number,
      required: [true, "SKS wajib diisi"],
      maxlength: [2, "SKS maksimal 2 karakter"],
    },
    file: {
      type: String,
      required: [true, "Upload wajib diisi"],
    },
    status_konfirmasi: {
      type: String,
      enum: ["belum", "sudah"],
      default: "belum",
    },
    mahasiswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mahasiswa",
    },
  })
);

module.exports = IRS;
