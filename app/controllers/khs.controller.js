const db = require("../models");
const Khs = db.khs;

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
                Khs.findOneAndUpdate(
                    {
                        mahasiswa: khs.mahasiswa,
                        semester_aktif: khs.semester_aktif,
                    },
                    {
                        sks: khs.sks,
                        sks_kumulatif: khs.sks_kumulatif,
                        ip: khs.ip,
                        ip_kumulatif: khs.ip_kumulatif,
                        status_konfirmasi: khs.status_konfirmasi,
                        file: khs.file,
                    },
                    function (err, data) {
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
};
