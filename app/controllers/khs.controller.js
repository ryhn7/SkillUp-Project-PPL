const db = require("../models");
const fs = require("fs");
const Khs = db.khs;
const Mahasiswa = db.mahasiswa;

const submitKHS = (req, res) => {
  let dataKhs = {
    semester_aktif: req.body.semester_aktif,
    sks: req.body.sks,
    sks_kumulatif: req.body.sks_kumulatif,
    ip: req.body.ip,
    ip_kumulatif: req.body.ip_kumulatif,
    status_konfirmasi: "belum",
    mahasiswa: req.mahasiswaId,
  };

  if (req.file) {
    dataKhs.file = req.file.path;
  }

  const khs = new Khs(dataKhs);

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
            // If there is new file, update file
            if (req.file) {
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
                    },
                  },
                  function (err, khs) {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                    res.send({
                      message: "KHS was updated successfully!",
                    });
                  }
                );
              });
            } else {
              Khs.updateOne(
                { _id: khs._id },
                {
                  $set: {
                    semester_aktif: req.body.semester_aktif,
                    sks: req.body.sks,
                    sks_kumulatif: req.body.sks_kumulatif,
                    ip: req.body.ip,
                    ip_kumulatif: req.body.ip_kumulatif,
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
            }
          }
        );
      }
    }
  );
};

const getKHS = (req, res) => {
  Khs.find({ mahasiswa: req.mahasiswaId }, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      let list_obj = [];
      data.forEach((khs) => {
        let filename = khs.file.split("\\").pop().split("/").pop();
        filename = filename.split("-").slice(1).join("-");
        const newObj = {
          semester_aktif: khs.semester_aktif,
          sks: khs.sks,
          sks_kumulatif: khs.sks_kumulatif,
          ip: khs.ip,
          ip_kumulatif: khs.ip_kumulatif,
          status_konfirmasi: khs.status_konfirmasi,
          file: filename,
        };
        list_obj.push(newObj);
      });
      res.status(200).send(list_obj);
    }
  });
};

const getAllKHS = async (req, res) => {
  let array_mahasiswa = await Mahasiswa.find({});
  let array_khs = await Khs.find({});

  let result = [];
  for (let i = 0; i < array_mahasiswa.length; i++) {
    let khs_mahasiswa = [];
    for (let j = 0; j < array_khs.length; j++) {
      // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
      if (array_mahasiswa[i]._id.equals(array_khs[j].mahasiswa)) {
        let obj_khs = {
          semester: array_khs[j].semester_aktif,
          ip: array_khs[j].ip,
          ipk: array_khs[j].ip_kumulatif,
        };

        khs_mahasiswa.push(obj_khs);
      }
    }
    let obj_mahasiswa = {
      nama: array_mahasiswa[i].name,
      nim: array_mahasiswa[i].nim,
      khs: khs_mahasiswa,
    };

    result.push(obj_mahasiswa);
  }

  res.status(200).send(result);
};

const downloadKHS = (req, res) => {
  Khs.findOne(
    {
      mahasiswa: req.mahasiswaId,
      semester_aktif: req.params.semester,
    },
    //if file not found return 404
    function (err, khs) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!khs) {
        res.status(404).send({ message: "File not found!" });
        return;
      }
      const file = fs.createReadStream(khs.file);
      const filename = "KHS_" + khs.semester_aktif;
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      file.pipe(res);
    }
  );
};

module.exports = {
  submitKHS,
  getKHS,
  getAllKHS,
  downloadKHS,
};
