const mongoose = require("mongoose");

const IRS = mongoose.model(
  "IRS",
  new mongoose.Schema({
    semester: {
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
    konfirmasi: {
      type: String,
      enum: ["Belum", "Sudah"],
      default: "Belum",
    },
    mahasiswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mahasiswa',
    },
})
);

module.exports = IRS;
