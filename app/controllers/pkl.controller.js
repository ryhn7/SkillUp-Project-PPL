const db = require("../models");
const PKL = db.pkl;
const fs = require("fs");

exports.submitPKL = (req, res) => {
  const pkl = new PKL({
    nilai: req.body.nilai,
    semester: req.body.semester,
    status_konfirmasi: req.body.status_konfirmasi,
    status: req.body.status,
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
                    status: req.body.status,
                    semester: req.body.semester,
                    status_konfirmasi: req.body.status_konfirmasi,
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
