const mongoose = require('mongoose');

let khsSchema = new mongoose.Schema({
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
    sksKumulatif: {
        type: Number,
        required: [true, 'SKS kumulatif wajib diisi'],
        maxlength: [3, 'SKS kumulatif maksimal 3 karakter'],
    },
    ip: {
        type: Number,
        required: [true, 'Ip wajib diisi'],
        maxlength: [3, 'Ip maksimal 3 karakter'],
    },
    ipKumulatif: {
        type: Number,
        required: [true, 'Ip kumulatif wajib diisi'],
        maxlength: [3, 'Ip kumulatif maksimal 3 karakter'],
    },
    konfirmasi: {
        type: String,
        enum: ['Belum', 'Sudah'],
        default: 'Belum',
    },
    uploadKhs: {
        type: String,
        required: [true, 'Upload KHS wajib diisi'],
    },
}, {timestamps: true});

module.exports = mongoose.model('Khs', khsSchema);