const db = require("../models");
const { authJwt } = require("../middlewares");
const Skripsi = db.skripsi;
const Mahasiswa = db.mahasiswa;
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

exports.getSkripsi = (req, res) => {
  Skripsi.findOne({ mahasiswa: req.mahasiswaId }, (err, skripsi) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    filename = skripsi.file.split("\\").pop().split("/").pop();
    res.status(200).send({
      nilai: skripsi.nilai,
      tanggal: skripsi.tanggal,
      semester: skripsi.semester,
      status_konfirmasi: skripsi.status_konfirmasi,
      file: filename,
    });
  });
};

exports.getRekap = async (req, res) => {
  let result = [];

  const queryMhs = Mahasiswa.find({});
  const resultMhs = await queryMhs.exec();
  const querySkr = Skripsi.find();
  const resultSkr = await querySkr.exec();

  // console.log(resultSkr);

  for (let i = 0; i < resultMhs.length; i++) {
    let ck = false;
    for (let j = 0; j < resultSkr.length; j++) {
      if (resultMhs[i]._id.equals(resultSkr[j].mahasiswa)) {
        result.push({
          nama: resultMhs[i].name,
          nim: resultMhs[i].nim,
          angkatan: resultMhs[i].angkatan,
          status: "sudah",
        });
        ck = true;
        break;
      }
    }
    if (!ck) {
      result.push({
        nama: resultMhs[i].name,
        nim: resultMhs[i].nim,
        angkatan: resultMhs[i].angkatan,
        status: "belum",
      });
    }
  }
  res.status(200).send(result);
};
