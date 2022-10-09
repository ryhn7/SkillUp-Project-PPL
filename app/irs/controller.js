const Irs = require('./model');

module.exports = {
    viewCreate: async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { nim , smtAktif, sks, konfirmasi, uploadIrs } = req.body;
            let irs = await Irs ({nim, smtAktif, sks, konfirmasi, uploadIrs});

            await irs.save();


        } catch (error) {
            console.log(error);
        }
    },
}