const mongoose = require('mongoose');

let mahasiswaSchema = new mongoose.Schema({
    nim: {
        type: String,
        unique: true,
        required: [true, 'NIM wajib diisi'],
        maxlength: [14, 'NIM maksimal 14 karakter'],
    },
    nama: {
        type: String,
        required: [true, 'Nama wajib diisi'],
        maxlength: [50, 'Nama maksimal 50 karakter'],
    },
    angkatan: {
        type: String,
        required: [true, 'Angkatan wajib diisi'],
        maxlength: [4, 'Angkatan maksimal 4 karakter'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Emailwajib diisi'],
        maxlength: [50, 'Email maksimal 50 karakter'],
    },
    alamat: {
        type: String,
        required: [true, 'Alamat wajib diisi'],
        maxlength: [100, 'Alamat maksimal 100 karakter'],
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'No telepon wajib diisi'],
        maxlength: [12, 'No telepon maksimal 12 karakter'],
    },
    kodeWali: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dosen',
    },
    kodeKab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kabupaten',
    },
}, {timestamps: true});

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);