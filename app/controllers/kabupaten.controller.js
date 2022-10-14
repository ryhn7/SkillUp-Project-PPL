const db = require("../models");
const Kabupaten = db.kabupaten;

exports.getKabupatenByProvId = (req, res) => {
    Kabupaten.find({ id_provinsi: req.params.prov_id }, (err, kabupaten) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(kabupaten);
    });
};