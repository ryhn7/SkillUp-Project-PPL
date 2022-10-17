const { createRemoteJWKSet } = require("jose");
const { khs } = require("../models");
const db = require("../models");
const Khs = db.khs;
const Mahasiswa = db.mahasiswa;

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

const getKHS = (req, res) => {
    Khs.find({ mahasiswa: req.mahasiswaId }, (err, data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            let list_obj = [];
            data.forEach((khs) => {
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

const getAllKHS = async (req, res) => {
    let array_mahasiswa = await Mahasiswa.find({});
    let array_khs = await Khs.find({});

    let result = [];
    for (let i = 0; i < array_mahasiswa.length; i++) {
        let khs_mahasiswa = [];
        for (let j = 0; j < array_khs.length; j++) {
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

module.exports = {
    submitKHS,
    getKHS,
    getAllKHS,
};
