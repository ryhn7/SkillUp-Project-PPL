const db = require("../models");
const Skripsi = db.skripsi;
const Mahasiswa = db.mahasiswa;
const Dosen = db.dosen;
const fs = require("fs");

exports.submitSkripsi = (req, res) => {
  let dataSkripsi = {
    nilai: req.body.nilai,
    semester: req.body.semester,
    status_konfirmasi: "belum",
    mahasiswa: req.mahasiswaId,
    tanggal: req.body.tanggal,
  };

  if (req.file) {
    dataSkripsi.file = req.file.path;
  }

  const skripsi = new Skripsi(dataSkripsi);

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

            // If there is new file, update the file
            if (req.file) {
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
                      semester: req.body.semester,
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

            // If there is no new file, update the data without file
            else {
              Skripsi.updateOne(
                { _id: skripsi._id },
                {
                  $set: {
                    nilai: req.body.nilai,
                    semester: req.body.semester,
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
            }
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
    if (skripsi) {
      let filename = skripsi.file.split("\\").pop().split("/").pop();
      filename = filename.split("-").slice(1).join("-");

      let tanggal = skripsi.tanggal;
      // Convert tanggal to string
      tanggal = tanggal.toString();
      // Convert tanggal to YYYY-MM-DD
      tanggal = tanggal.slice(4, 15);

      res.status(200).send({
        nilai: skripsi.nilai,
        tanggal: tanggal,
        semester: skripsi.semester,
        status_konfirmasi: skripsi.status_konfirmasi,
        file: filename,
      });
    }
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
          name: resultMhs[i].name,
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
        name: resultMhs[i].name,
        nim: resultMhs[i].nim,
        angkatan: resultMhs[i].angkatan,
        status_konfirmasi: "belum",
      });
    }
  }
  res.status(200).send(result);
};

exports.downloadSkripsi = (req, res) => {
  Skripsi.findOne(
    {
      mahasiswa: req.mahasiswaId,
    },
    //if file not found return 404
    function (err, skripsi) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!skripsi) {
        res.status(404).send({ message: "File not found!" });
        return;
      }
      const file = fs.createReadStream(skripsi.file);
      const filename = "Skripsi";
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      file.pipe(res);
    }
  );
};

exports.deleteAllSkripsi = (req, res) => {
  Skripsi.deleteMany({}, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(data);
  });
};

exports.waliSkripsi = async (req, res) => {
  let result = [];
  const dosen = await Dosen.findOne({ user: req.userId });
  const resultMhs = await Mahasiswa.find({ kodeWali: dosen._id });
  const resultSkr = await Skripsi.find({});
  for (let i = 0; i < resultMhs.length; i++) {
    let ck = false;
    for (let j = 0; j < resultSkr.length; j++) {
      if (resultMhs[i]._id.equals(resultSkr[j].mahasiswa)) {
        result.push({
          name: resultMhs[i].name,
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
        name: resultMhs[i].name,
        nim: resultMhs[i].nim,
        angkatan: resultMhs[i].angkatan,
        status_konfirmasi: "belum",
      });
    }
  }
  res.status(200).send(result);
};

exports.getVerifikasiSkripsi = async (req, res) => {
  const dosen = await Dosen.findOne({ user: req.userId });
  const resultMhs = await Mahasiswa.find({ kodeWali: dosen._id });
  const resultSkr = await Skripsi.find({});
  let result = [];
  for (let i = 0; i < resultSkr.length; i++) {
    for (let j = 0; j < resultMhs.length; j++) {
      if (resultSkr[i].mahasiswa.equals(resultMhs[j]._id)) {
        let tanggal = new Date(resultSkr[i].tanggal);
        tanggal = tanggal.toLocaleDateString("id-ID");
        result.push({
          name: resultMhs[j].name,
          nim: resultMhs[j].nim,
          angkatan: resultMhs[j].angkatan,
          semester: resultSkr[i].semester,
          nilai: resultSkr[i].nilai,
          tanggal: tanggal,
          status_konfirmasi: resultSkr[i].status_konfirmasi,
          file: resultSkr[i].file,
          id: resultSkr[i]._id,
        });
      }
    }
  }
  res.status(200).send(result);
};

exports.verifSkripsi = async (req, res) => {
  const dosen = await Dosen.findOne({ user: req.userId });
  const mahasiswa = await Mahasiswa.findOne({
    kodeWali: dosen._id,
    nim: req.params.nim,
  });
  console.log(mahasiswa._id);
  Skripsi.updateOne(
    { mahasiswa: mahasiswa._id },
    {
      $set: {
        status_konfirmasi: "sudah",
      },
    },
    function (err, pkl) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "PKL was verified successfully!" });
    }
  );
};
