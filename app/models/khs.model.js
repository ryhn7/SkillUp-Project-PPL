const mongoose = require("mongoose");

const KHS = mongoose.model(
  "khs",
  new mongoose.Schema({
    semester_aktif: {
      type: Number,
      required: [true, "Semester aktif wajib diisi"],
      maxlength: [1, "Semester aktif maksimal 1 karakter"],
    },
    sks: {
      type: Number,
      required: [true, "SKS harus diisi"],
      maxlength: [2, "SKS maksimal 2 karakter"],
    },
    sks_kumulatif: {
      type: Number,
      required: [true, "SKS kumulatif wajib diisi"],
      maxlength: [3, "SKS kumulatif maksimal 3 karakter"],
    },
    ip: {
      type: Number,
      required: [true, "IP harus diisi"],
      maxlength: [3, "IP maksimal 3 karakter"],
    },
    ip_kumulatif: {
      type: Number,
      required: [true, "IP kumulatif harus diisi"],
      maxlength: [3, "IP kumulatif maksimal 3 karakter"],
    },
    status_konfirmasi: {
      type: String,
      required: [true, "Status konfirmasi harus diisi"],
      maxlength: [20, "Status konfirmasi maksimal 20 karakter"],
    },
    file: {
      type: String,
      // required: [true, "KHS harus diupload"],
    },
    mahasiswa: {
      type: mongoose.Schema.ObjectId,
      ref: "Mahasiswa",
    },
  })
);

module.exports = KHS;
