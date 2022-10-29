const mongoose = require("mongoose");

const Dosen = mongoose.model(
    "Dosen",
    new mongoose.Schema({
        nip: {
            type: String,
            unique: true,
            required: [true, "NIP wajib diisi"],
            maxlength: [18, "NIP maksimal 18 karakter"],
        },
        name: {
            type: String,
            required: [true, "Nama wajib diisi"],
            maxlength: [50, "Nama maksimal 50 karakter"],
        },
        email: {
            type: String,
            unique: true,
            // required: [true, 'Email wajib diisi'],
            maxlength: [50, "Email maksimal 50 karakter"],
        },
        alamat: {
            type: String,
            // required: [true, 'Alamat wajib diisi'],
            maxlength: [100, "Alamat maksimal 100 karakter"],
        },
        phone: {
            type: String,
            // unique: true,
            // required: [true, 'No telepon wajib diisi'],
            maxlength: [12, "No telepon maksimal 12 karakter"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    })
);

module.exports = Dosen;
