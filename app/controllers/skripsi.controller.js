const db = require("../models");
const Skripsi = db.skripsi;

exports.submitSkripsi = (req, res) => {
  // buat instance skripsi
  const skripsi = new Skripsi({
    nilai: req.body.nilai,
    tanggal: req.body.tanggal,
    lama_studi: req.body.lama_studi,
    status_konfirmasi: req.body.status_konfirmasi,
    file: req.file.path,
    mahasiswa: req.mahasiswaId,
  });

  skripsi.save((err, skripsi) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Skripsi was uploaded succesfully" });
  });
};
