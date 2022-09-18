const mongoose = require('mongoose');

let kabupatenSchema = new mongoose.Schema({
    kodeKab:{
        type: String,
        unique: true,
        required: [true, 'Kode Kabupaten wajib diisi'],
        maxlength: [5, 'Kode Kabupaten maksimal 5 karakter'],
    },
    nama:{
        type: String,
        required: [true, 'Nama Kabupaten wajib diisi'],
        maxlength: [50, 'Nama Kabupaten maksimal 50 karakter'],
    },
    kodeProv:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provinsi',
    },
}, {timestamps: true});

module.exports = mongoose.model('Kabupaten', kabupatenSchema);