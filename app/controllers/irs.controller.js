const db = require("../models");
const IRS = db.irs;
const Mahasiswa = db.mahasiswa;
//fs
const fs = require("fs");
const submitIRS = (req, res) => {
  //get user id from jwt

  const irs = new IRS({
    semester: req.body.semester,
    sks: req.body.sks,
    file: req.file.path,
    //get from logged mahasiswa objectid
    status_konfirmasi: req.body.status_konfirmasi,
    mahasiswa: req.mahasiswaId,
  });
  IRS.countDocuments(
    {
      mahasiswa: irs.mahasiswa,
      semester: irs.semester,
    },
    function (err, count) {
      if (count === 0) {
        irs.save((err, khs) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "IRS was uploaded successfully!" });
        });
      } else {
        //delete irs file then update irs
        IRS.findOne(
          {
            mahasiswa: irs.mahasiswa,
            semester: irs.semester,
          },
          function (err, irs) {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            fs.unlink(irs.file, function (err) {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              IRS.updateOne(
                { _id: irs._id },
                {
                  $set: {
                    file: req.file.path,
                    sks: req.body.sks,
                    status_konfirmasi: req.body.status_konfirmasi,
                  },
                },
                function (err, irs) {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  res.send({ message: "IRS was updated successfully!" });
                }
              );
            });
          }
        );
      }
    }
  );
};

const getIRS = (req, res) => {
  IRS.find({ mahasiswa: req.mahasiswaId }, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      let list_obj = [];
      data.forEach((irs) => {
        const newObj = {
          semester: irs.semester,
          sks: irs.sks,
          ip: irs.ip,
          status_konfirmasi: irs.status_konfirmasi,
          file: irs.file,
        };
        list_obj.push(newObj);
      });
      res.status(200).send(list_obj);
    }
  });
};

const getAllIRS = async (req, res) => {
  let array_mahasiswa = await Mahasiswa.find({});
  let array_irs = await IRS.find({});

  let result = [];
  for (let i = 0; i < array_mahasiswa.length; i++) {
    let irs_mahasiswa = [];
    for (let j = 0; j < array_irs.length; j++) {
      // cek tiap irs yang punya nilai mahasiswa == mahasiswa.id
      if (array_mahasiswa[i]._id.equals(array_irs[j].mahasiswa)) {
        let obj_irs = {
          semester: array_irs[j].semester,
          sks: array_irs[j].sks,
          file: array_irs[j].file,
          status_konfirmasi: array_irs[j].status_konfirmasi,
        };

        irs_mahasiswa.push(obj_irs);
      }
    }
    let obj_mahasiswa = {
      name: array_mahasiswa[i].name,
      nim: array_mahasiswa[i].nim,
      irs: irs_mahasiswa,
    };

    result.push(obj_mahasiswa);
  }

  res.status(200).send(result);
};

module.exports = {
  submitIRS,
  getIRS,
  getAllIRS,
};
