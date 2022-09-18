const mongoose = require('mongoose');

let pklSchema = new mongoose.Schema({
    nim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
    },
    status: {
        type: String,
        enum: ['Belum', 'Tidak', 'Lulus'],
        default: 'Belum',
    },
    nilai: {
        type: String,
        maxlength: [1, 'Nilai maksimal 1 karakter'],
    },
    semester: {
        type: Number,
        maxlength: [2, 'Semester maksimal 2 karakter'],
    },
    konfirmasi: {
        type: String,
        enum: ['Belum', 'Sudah'],
        default: 'Belum',
    },
    uploadPkl: {
        type: String,
    },
}, {timestamps: true});

module.exports = mongoose.model('Pkl', pklSchema);