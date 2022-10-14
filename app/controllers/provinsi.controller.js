const db = require("../models");
const Provinsi = db.provinsi;

exports.allProvinsi = (req, res) => {
    Provinsi.find({}, (err, provinsi) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(provinsi);
    });
};