const db = require("../models");
const fs = require("fs");
const { khs } = require("../models");
const e = require("cors");
const Khs = db.khs;
const Mahasiswa = db.mahasiswa;
const Dosen = db.dosen;

const submitKHS = (req, res) => {
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
                  res.send({
                    message: "KHS was updated successfully!",
                  });
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
  Khs.find({ mahasiswa: req.mahasiswaId }, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      let list_obj = [];
      data.forEach((khs) => {
        const filename = khs.file.split("\\").pop().split("/").pop();
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
            wali: array_mahasiswa[i].kodeWali,
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
            res.setHeader(
                "Content-disposition",
                "attachment; filename=" + filename
            );
            file.pipe(res);
        }
    );
};

const waliKHS = async (req, res) => {
    const dosen = await Dosen.findOne({ user: req.userId });
    const list_mhs = await Mahasiswa.find({ kodeWali: dosen._id });
    const list_khs = await Khs.find({});

    let result = [];
    for (let i = 0; i < list_mhs.length; i++) {
        let khs_mahasiswa = [];

        for (let j = 0; j < list_khs.length; j++) {
            // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
            if (list_mhs[i]._id.equals(list_khs[j].mahasiswa)) {
                let obj_khs = {
                    semester: list_khs[j].semester_aktif,
                    ip: list_khs[j].ip,
                    ipk: list_khs[j].ip_kumulatif,
                    status: list_khs[j].status_konfirmasi,
                };

                khs_mahasiswa.push(obj_khs);
            }
        }
        let obj_mahasiswa = {
            nama: list_mhs[i].name,
            nim: list_mhs[i].nim,
            angkatan: list_mhs[i].angkatan,
            khs: khs_mahasiswa,
        };

        result.push(obj_mahasiswa);
    }
    res.status(200).send(result);
};

const verifyKHS = async (req, res) => {
    const mhs = await Mahasiswa.findOne({ nim: req.params.nim });
    const dosen = await Dosen.findOne({ user: req.userId });

    if (!dosen._id.equals(mhs.kodeWali)) {
        res.status(403).send(`Anda bukan dosen wali dari ${mhs.nama}`);
        return;
    }

    Khs.findOneAndUpdate(
        { mahasiswa: mhs._id, semester_aktif: req.params.semester },
        { status_konfirmasi: req.body.status },
        (err, data) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send(data);
        }
    );
};

module.exports = {
    submitKHS,
    getKHS,
    getAllKHS,
    downloadKHS,
    waliKHS,
    verifyKHS,
};
