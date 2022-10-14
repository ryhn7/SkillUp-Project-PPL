const db = require("../models");
const Mahasiswa = db.mahasiswa;

exports.getProfil = (req, res) => {
  Mahasiswa.findById(req.mahasiswaId, (err, mahasiswa) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(mahasiswa);
  });
};

exports.updateProfil = (req, res) => {
  Mahasiswa.findByIdAndUpdate(
    req.mahasiswaId,
    req.body,
    { new: true },
    (err, mahasiswa) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send(mahasiswa);
    }
  );
};
