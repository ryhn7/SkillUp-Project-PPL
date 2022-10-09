const config = require('../../config');
const jwt = require('jsonwebtoken');
const User = require('../user/model');

module.exports = {
    isHaveSession: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', 'Sesi telah habis, anda harus login terlebih dahulu');
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        } else {
            next();
        }
    },

    isAuth: async (req, res, next) => {
        const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

        if(!token) {
            // req.flash('alertMessage', 'Anda harus login terlebih dahulu');
            // req.flash('alertStatus', 'danger');
            // res.redirect('/');
            return res.status(403).send({ message: "No token provided!" });
        }

        try {
            const data = jwt.verify(token, config.jwtKey);
            req.user = await User.findOne({ _id: data.user.id });
            next();
            
        } catch (error) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
    },

    isLoginAdmin: async (req, res, next) => {
        try {
            if (req.user.role !== 'admin') {
                throw new Error('User not authorized, admin only');
            }

            next();

        } catch (error) {
            res.status(401).json({ error: `You are not authorized, admin only` });
        }
    },

    isLoginMhs: async (req, res, next) => {
        try {
            if (req.user.role !== 'mahasiswa') {
                throw new Error('User not authorized, mahasiswa only');
            }

            next();

        } catch (error) {
            res.status(401).json({ error: `You are not authorized, mahasiswa only` });
        }
    },

    isLoginDosen: async (req, res, next) => {
        try {
            if (req.user.role !== 'dosen') {
                throw new Error('User not authorized, dosen only');
            }

            next();

        } catch (error) {
            res.status(401).json({ error: `You are not authorized, dosen only` });
        }
    },

    isLoginDept: async (req, res, next) => {
        try {
            if (req.user.role !== 'departemen') {
                throw new Error('User not authorized, departemen only');
            }

            next();

        } catch (error) {
            res.status(401).json({ error: `You are not authorized, departemen only` });
        }
    }

}