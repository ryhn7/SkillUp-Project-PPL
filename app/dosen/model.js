const mongoose = require('mongoose');

let dosenSchema = new mongoose.Schema({
    nip:{
        type: String,
        unique: true,
        required: [true, 'NIP wajib diisi'],
        maxlength: [18, 'NIP maksimal 18 karakter'],
    },
    kodeWali:{
        type: String,
        required: [true, 'Kode Wali wajib diisi'],
        maxlength: [5, 'Kode Wali maksimal 5 karakter'],
    },
    nama:{
        type: String,
        required: [true, 'Nama wajib diisi'],
        maxlength: [50, 'Nama maksimal 50 karakter'],
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Email wajib diisi'],
        maxlength: [50, 'Email maksimal 50 karakter'],
    },
    alamat:{
        type: String,
        required: [true, 'Alamat wajib diisi'],
        maxlength: [100, 'Alamat maksimal 100 karakter'],
    },
    phone:{
        type: String,
        unique: true,
        required: [true, 'No telepon wajib diisi'],
        maxlength: [12, 'No telepon maksimal 12 karakter'],
    },
}, {timestamps: true});

module.exports = mongoose.model('Dosen', dosenSchema);