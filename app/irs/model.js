const mongoose = require('mongoose');

let irsSchema = new mongoose.Schema({
    nim: {
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
    uploadIrs: {
        type: String,
        required: [true, 'Upload IRS wajib diisi'],
    },
}, {timestamps: true});

module.exports = mongoose.model('Irs', irsSchema);