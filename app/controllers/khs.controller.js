const { getMahasiswaId } = require("../middlewares/authJwt");
const { khs } = require("../models");
const db = require("../models");
const Khs = db.khs;
const fs = require("fs");
exports.submitKHS = (req, res) => {
  const khs = new Khs({
    semester_aktif: req.body.semester_aktif,
    sks: req.body.sks,
    sks_kumulatif: req.body.sks_kumulatif,
    ip: req.body.ip,
    ip_kumulatif: req.body.ip_kumulatif,
    status_konfirmasi: req.body.status_konfirmasi,
    file: req.file.path,
    mahasiswa: req.mahasiswaId,
  });

  Khs.countDocuments(
    {
      mahasiswa: khs.mahasiswa,
      semester_aktif: khs.semester_aktif,
    },
    function (err, count) {
      if (count === 0) {
        khs.save((err, khs) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "KHS was uploaded successfully!" });
        });
      } else {
        //delete khs file then update khs
        Khs.findOne(
          {
            mahasiswa: khs.mahasiswa,
            semester_aktif: khs.semester_aktif,
          },
          function (err, khs) {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            fs.unlink(khs.file, function (err) {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              Khs.updateOne(
                { _id: khs._id },
                {
                  $set: {
                    file: req.file.path,
                    semester_aktif: req.body.semester_aktif,
                    sks: req.body.sks,
                    sks_kumulatif: req.body.sks_kumulatif,
                    ip: req.body.ip,
                    ip_kumulatif: req.body.ip_kumulatif,
                    status_konfirmasi: req.body.status_konfirmasi,
                  },
                },
                function (err, khs) {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  res.send({ message: "KHS was updated successfully!" });
                }
              );
            });
          }
        );
      }
    }
  );
};

const getKHS = (req, res) => {
  Khs.find({ mahasiswa: req.mahasiswaId }, (err, khs_mahasiswa) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      const list_obj = [];
      khs_mahasiswa.forEach((khs) => {
        const newObj = {
          semester_aktif: khs.semester_aktif,
          sks: khs.sks,
          sks_kumulatif: khs.sks_kumulatif,
          ip: khs.ip,
          ip_kumulatif: khs.ip_kumulatif,
          status_konfirmasi: khs.status_konfirmasi,
          file: khs.file,
        };
        list_obj.push(newObj);
      });
      res.status(200).send(list_obj);
    }
  });
};

module.exports = {
  submitKHS,
  getKHS,
};
