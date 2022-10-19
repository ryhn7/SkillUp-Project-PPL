const mongoose = require("mongoose");

const Skripsi = mongoose.model(
  "Skripsi",
  new mongoose.Schema({
    nilai: {
      type: String,
      required: [true, "nilai wajib di isi"],
      maxlength: [1, "max length 1"],
    },
    tanggal: {
      type: Date,
      required: [true, "tanggal harus di isi"],
    },
    semester: {
      type: Number,
      required: [true, "lama studi harus di isi"],
    },
    status_konfirmasi: {
      type: String,
      required: [true, "status konfirmasi harus di isi"],
    },
    file: {
      // belum tipe data varbinary sementara string
      type: String,
      // required: [true, "upload skripsi harus di isi"],
    },
    mahasiswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mahasiswa",
    },
  })
);

module.exports = Skripsi;
