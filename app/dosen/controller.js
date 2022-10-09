const Dosen = require('./model');

module.exports = {
    viewCreate: async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { nip, kodeWali, nama, email, alamat, phone } = req.body;

            let dosen = await Dosen({nip, kodeWali, nama, email, alamat, phone});
    
            await dosen.save();
    
            res.status(201).json({
                data: dosen,
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
        }
    },
};