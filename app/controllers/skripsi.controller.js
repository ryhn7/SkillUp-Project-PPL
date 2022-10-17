const db = require("../models");
const Skripsi = db.skripsi;
//fs
const fs = require("fs");

exports.submitSkripsi = (req, res) => {
  // buat instance skripsi
  const skripsi = new Skripsi({
    nilai: req.body.nilai,
    tanggal: req.body.tanggal,
    lama_studi: req.body.lama_studi,
    status_konfirmasi: req.body.status_konfirmasi,
    file: req.file.path,
    mahasiswa: req.mahasiswaId,
    status: req.body.status,
  });

  Skripsi.countDocuments(
    {
      mahasiswa: skripsi.mahasiswa,
    },
    function (err, count) {
      if (count === 0) {
        skripsi.save((err, skripsi) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Skripsi was uploaded successfully!" });
        });
      } else {
        Skripsi.findOne(
          {
            mahasiswa: skripsi.mahasiswa,
          },
          function (err, skripsi) {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            fs.unlink(skripsi.file, function (err) {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              Skripsi.updateOne(
                { _id: skripsi._id },
                {
                  $set: {
                    file: req.file.path,
                    nilai: req.body.nilai,
                    status: req.body.status,
                    status_konfirmasi: req.body.status_konfirmasi,
                    lama_studi: req.body.lama_studi,
                    tanggal: req.body.tanggal,
                  },
                },
                function (err, skripsi) {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  res.send({ message: "Skripsi was updated successfully!" });
                }
              );
            });
          }
        );
      }
    }
  );
};
