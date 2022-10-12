const db = require("../models");
const IRS = db.irs;
exports.submitIRS = (req, res) => {
  //get user id from jwt

  const irs = new IRS({
    semester: req.body.semester,
    sks: req.body.sks,
    file: req.file.path,
    //get from logged mahasiswa objectid
    mahasiswa: req.mahasiswaId,
  });
  irs.save((err, irs) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "IRS was uploaded successfully!" });
  });
};
