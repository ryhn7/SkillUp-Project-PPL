const db = require("../models");
const Khs = db.khs;

exports.submitKHS = (req, res) => {
  const khs = new Khs({
    semester_aktif: req.body.semester_aktif,
    sks: req.body.sks,
    sks_kumulatif: req.body.sks_kumulatif,
    ip: req.body.ip,
    ip_kumulatif: req.body.ip_kumulatif,
    status_konfirmasi: req.body.status_konfirmasi,
    // upload_khs: req.body.upload_khs,
    mahasiswa: req.mahasiswaId,
  });

  khs.save((err, khs) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "KHS was uploaded successfully!" });
  });
};

// semester aktif
// sks
// sks kumulatif
// ip
// ip kumulatif
// status konfirmasi
// upload khs
// nim
