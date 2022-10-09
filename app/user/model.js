const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const HASH_ROUND = 10;

let userSchema = new mongoose.Schema({
    // kode sebagai NIM atau NIP
    kode: {
        type: String,
        required: [true, 'Kode wajib diisi dengan NIM/NIP'],
        maxlength: [18, 'Kode maksimal 18 karakter'],
    },
    userName: {
        type: String,
        required: [true, 'Username wajib diisi'],
        maxlength: [50, 'Username maksimal 50 karakter'],
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi'],
        maxlength: [50, 'Email maksimal 50 karakter'],
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi'],
        maxlength: [100, 'Password maksimal 100 karakter'],
    },
    role: {
        type: String,
        enum: ['admin', 'dosen', 'mahasiswa', 'departmen'],
        default: 'mahasiswa'
    },
    status: {
        type: String,
        enum: ['aktif', 'nonaktif'],
        default: 'aktif'
    }
}, {timestamps: true});

userSchema.path('email').validate(async (value) => {
    try {
        const count = await mongoose.models.User.countDocuments({ email: value });
        return !count;
    } catch (error) {
        throw error;
    }
}, attr => `${attr.value} has been registered`);

userSchema.path('kode').validate(async (value) => {
    try {
        const count = await mongoose.models.User.countDocuments({ kode: value });
        return !count;
    } catch (error) {
        throw error;
    }
}, attr => `${attr.value} has been registered`);

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model('User', userSchema);