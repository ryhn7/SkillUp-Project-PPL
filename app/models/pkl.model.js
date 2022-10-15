const mongoose = require("mongoose");

const pkl = mongoose.model(
  "pkl",
  new mongoose.Schema({
    status: {
      type: String,
      required: [true, 'Status wajib diisi'],
      maxlength: [15, 'Status maksimal 15 karakter'],
    },
    nilai: {
      type: String,
      maxlength: [1, 'Nilai maksimal 1 karakter'],
    },
    semester: {
      type: Number,
      maxlength: [2, 'Semester maksimal 1 karakter'],
    },
    status_konfirmasi: {
      type: String,
      maxlength: [20, 'Status konfirmasi  maksimal 20 karakter'],
    },
    file: {
      type: String,
      // maxlength: [100, 'Alamat maksimal 100 karakter'],
    },
    mahasiswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mahasiswa",
    },
  })
);

module.exports = pkl;
