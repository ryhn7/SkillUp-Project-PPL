const User = require('./model');
const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');


module.exports = {
    viewSignIn: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = { message: alertMessage, status: alertStatus };

            if (req.session.user === null || req.session.user === undefined) {
                res.render('admin/users/view_signin', {
                    alert,
                    title: 'Sign In'
                })
            } else {
                res.redirect('/dashboard');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },

    actionSignUp: async (req, res, next) => {
        try {
            const payload = req.body;

            let user = new User(payload);

            await user.save();

            delete user._doc.password;

            res.status(201).json({
                data: user,
                status: 'success'
            });


        } catch (error) {
            if (error && error.name == 'ValidationError') {
                res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors
                });
            }
            next(error);
        }
    },

    //     actionSignIn: async (req, res, next) => {
    //     const { email, password } = req.body;

    //     User.findOne({ email: email }).then((user) => {
    //         if (user) {
    //             if (user.status === 'aktif') {
    //                 const checkPassword = bcrypt.compareSync(password, user.password);
    //                 if (checkPassword) {
    //                     const token = jwt.sign({
    //                         user: {
    //                             id: user.id,
    //                             kode: user.kode,
    //                             email: user.email,
    //                             name: user.name,
    //                         }
    //                     }, config.jwtKey, {expiresIn: '1h'});

    //                     req.session.user = {
    //                         id: user._id,
    //                         email: user.email,
    //                         status: user.status,
    //                         name: user.name,
    //                     };

    //                     res.redirect(200,'/dashboard');
    // res.status(200).json({
    //     data: user,
    //     token: { token }
    // });

    //                 } else {
    //                     res.status(403).json({
    //                         message: 'Password is incorrect'
    //                     });
    //                 }
    //             } else {
    //                 res.status(403).json({
    //                     message: 'Account is not active'
    //                 });
    //             }
    //         } else {
    //             res.status(404).json({
    //                 message: 'Email not found'
    //             });
    //         }
    //     }).catch((error) => {
    //         res.status(500).json({
    //             message: error.message || `Internal Server Error`
    //         });
    //         next();
    //     });
    // },


    signIn: async (req, res, next) => {
        const { email, password } = req.body;

        User.findOne({ email: email }).then((user) => {

            if (user) {
                const checkPassword = bcrypt.compareSync(password, user.password);
                if (checkPassword) {
                    const token = jwt.sign({
                        user: {
                            id: user.id,
                            kode: user.kode,
                            email: user.email,
                            name: user.name,
                        }
                    }, config.jwtKey, {expiresIn: '1h'})

                    res.status(200).json({
                        data: user,
                        token: { token }
                    });

                } else {
                    res.status(403).json({
                        message: 'Password is incorrect'
                    });
                }

            } else {
                res.status(403).json({
                    message: 'Email is not registered'
                });
            }

        }).catch((error) => {
            res.status(500).json({
                message: error.message || `Internal Server Error`
            });
            next();
        });
    },

    actionSignIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const check = await User.findOne({ email: email });

            if (check) {
                if (check.status === 'aktif') {
                    const checkPassword = await bcrypt.compare(password, check.password);
                    if (checkPassword) {
                        req.session.user = {
                            id: check._id,
                            email: check.email,
                            status: check.status,
                            name: check.name,
                        };
                        res.redirect('/dashboard');
                    } else {
                        req.flash('alertMessage', 'Password salah');
                        req.flash('alertStatus', 'danger');
                        res.redirect('/');
                    }
                } else {
                    req.flash('alertMessage', 'Akun anda tidak aktif');
                    req.flash('alertStatus', 'danger');
                    res.redirect('/');
                }
            } else {
                req.flash('alertMessage', 'Email tidak terdaftar');
                req.flash('alertStatus', 'danger');
                res.redirect('/');
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },

    viewAdmin: (req, res) => {
        res.status(200).json({
            message: 'Welcome to admin page'
        });
    },

    actionLogout: async (req, res) => {
        try {
            req.session.destroy();
            res.redirect('/');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    }
};
