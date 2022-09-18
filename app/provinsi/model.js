const mongoose = require('mongoose');

let provinsiSchema = new mongoose.Schema({
    kodeProv:{
        type: String,
        unique: true,
        required: [true, 'Kode Provinsi wajib diisi'],
        maxlength: [2, 'Kode Provinsi maksimal 2 karakter'],
    },
    nama:{
        type: String,
        required: [true, 'Nama Provinsi wajib diisi'],
        maxlength: [50, 'Nama Provinsi maksimal 50 karakter'],
    },
}, {timestamps: true});

module.exports = mongoose.model('Provinsi', provinsiSchema);