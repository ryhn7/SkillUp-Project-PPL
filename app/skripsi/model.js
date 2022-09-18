const mongoose = require('mongoose');

let skripsiSchema = new mongoose.Schema({
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
    tglSidangSkripsi: {
        type: Date,
    },
    lamaStudi: {
        type: Number,
    },
    uploadSkripsi: {
        type: String,
    },
}, {timestamps: true});

module.exports = mongoose.model('Skripsi', skripsiSchema);