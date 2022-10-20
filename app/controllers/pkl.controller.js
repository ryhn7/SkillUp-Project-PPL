const db = require("../models");
const PKL = db.pkl;
const Mahasiswa = db.mahasiswa;
const fs = require("fs");

exports.submitPKL = (req, res) => {
  const pkl = new PKL({
    nilai: req.body.nilai,
    semester: req.body.semester,
    status_konfirmasi: "belum",
    file: req.file.path,
    mahasiswa: req.mahasiswaId,
  });

  PKL.countDocuments(
    {
      mahasiswa: pkl.mahasiswa,
    },
    function (err, count) {
      if (count === 0) {
        pkl.save((err, pkl) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "PKL was uploaded successfully!" });
        });
      } else {
        //delete pkl file then update pkl
        PKL.findOne(
          {
            mahasiswa: pkl.mahasiswa,
          },
          function (err, pkl) {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            fs.unlink(pkl.file, function (err) {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              PKL.updateOne(
                { _id: pkl._id },
                {
                  $set: {
                    file: req.file.path,
                    nilai: req.body.nilai,
                    semester: req.body.semester,
                  },
                },
                function (err, pkl) {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  res.send({ message: "PKL was updated successfully!" });
                }
              );
            });
          }
        );
      }
    }
  );
};

exports.getPKL = (req, res) => {
  PKL.findOne({ mahasiswa: req.mahasiswaId }, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (data) {
      const filename = data.file.split("\\").pop().split("/").pop();
      res.status(200).send({
        nilai: data.nilai,
        semester: data.semester,
        status_konfirmasi: data.status_konfirmasi,
        file: filename,
      });
    }
  });
};

exports.getRekapPKL = async (req, res) => {
  let result = [];

  const queryMhs = Mahasiswa.find({});
  const resultMhs = await queryMhs.exec();
  const queryPKL = PKL.find();
  const resultPKL = await queryPKL.exec();

  for (let i = 0; i < resultMhs.length; i++) {
    let ck = false;
    for (let j = 0; j < resultPKL.length; j++) {
      if (resultMhs[i]._id.equals(resultPKL[j].mahasiswa)) {
        result.push({
          nama: resultMhs[i].name,
          nim: resultMhs[i].nim,
          angkatan: resultMhs[i].angkatan,
          status_konfirmasi: "sudah",
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
        status_konfirmasi: "belum",
      });
    }
  }

  res.status(200).send(result);
};

exports.downloadPKL = (req, res) => {
  PKL.findOne(
    {
      mahasiswa: req.mahasiswaId,
    },
    //if file not found return 404
    function (err, pkl) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!pkl) {
        res.status(404).send({ message: "File not found!" });
        return;
      }
      const file = fs.createReadStream(pkl.file);
      const filename = "PKL";
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      file.pipe(res);
    }
  );
};
