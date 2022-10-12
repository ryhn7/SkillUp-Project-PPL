const mongoose = require("mongoose");

const IRS = mongoose.model(
  "IRS",
  new mongoose.Schema({
    nim: { // mau nim / mahasiswa, monggo penake
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mahasiswa',
  },
  smtAktif: {
      type: Number,
      required: [true, 'Semester aktif wajib diisi'],
      maxlength: [2, 'Semester aktif maksimal 2 karakter'],
  },
  sks: {
      type: Number,
      required: [true, 'SKS wajib diisi'],
      maxlength: [2, 'SKS maksimal 2 karakter'],
  },
  konfirmasi: {
      type: String,
      enum: ['Belum', 'Sudah'],
      default: 'Belum',
  },
  file: {
      type: String,
      required: [true, 'Upload IRS wajib diisi'],
  },
}, {timestamps: true})
);

module.exports = IRS;
