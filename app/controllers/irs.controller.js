const db = require("../models");
const IRS = db.irs;
const Mahasiswa = db.mahasiswa;
const fs = require("fs");
const Dosen = db.dosen;

const submitIRS = (req, res) => {
    let dataIrs = {
        semester_aktif: req.body.semester_aktif,
        sks: req.body.sks,
        status_konfirmasi: "belum",
        mahasiswa: req.mahasiswaId,
    };

    if (req.file) {
        dataIrs.file = req.file.path;
    }

    const irs = new IRS(dataIrs);

    IRS.countDocuments(
        {
            mahasiswa: irs.mahasiswa,
            semester_aktif: irs.semester_aktif,
        },
        function (err, count) {
            if (count === 0) {
                irs.save((err, irs) => {
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
                        semester_aktif: irs.semester_aktif,
                    },
                    function (err, irs) {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        // If there is new file, update file
                        if (req.file) {
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
                                        },
                                    },
                                    function (err, irs) {
                                        if (err) {
                                            res.status(500).send({
                                                message: err,
                                            });
                                            return;
                                        }
                                        res.send({
                                            message:
                                                "IRS was updated successfully!",
                                        });
                                    }
                                );
                            });
                        } else {
                            IRS.updateOne(
                                { _id: irs._id },
                                {
                                    $set: {
                                        sks: req.body.sks,
                                    },
                                },
                                function (err, irs) {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }
                                    res.send({
                                        message:
                                            "IRS was updated successfully!",
                                    });
                                }
                            );
                        }
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
                let filename = irs.file.split("\\").pop().split("/").pop();
                filename = filename.split("-").slice(1).join("-");
                const newObj = {
                    semester_aktif: irs.semester_aktif,
                    sks: irs.sks,
                    status_konfirmasi: irs.status_konfirmasi,
                    file: filename,
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
                    semester_aktif: array_irs[j].semester_aktif,
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
            angkatan: array_mahasiswa[i].angkatan,
            irs: irs_mahasiswa,
        };

        result.push(obj_mahasiswa);
    }

    res.status(200).send(result);
};

//download irs file dari database berdasarkan nim mahasiswa dan semester

const downloadIRS = (req, res) => {
    IRS.findOne(
        {
            mahasiswa: req.mahasiswaId,
            semester_aktif: req.params.semester_aktif,
        },
        //if file not found return 404
        function (err, irs) {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!irs) {
                res.status(404).send({ message: "File not found!" });
                return;
            }
            const file = fs.createReadStream(irs.file);
            const filename = "IRS_" + irs.semester_aktif;
            res.setHeader(
                "Content-disposition",
                "attachment; filename=" + filename
            );
            file.pipe(res);
        }
    );
};

const waliIRS = async (req, res) => {
    const dosen = await Dosen.findOne({ user: req.userId });
    const list_mhs = await Mahasiswa.find({ kodeWali: dosen._id });
    const list_irs = await IRS.find({});

    let result = [];
    for (let i = 0; i < list_mhs.length; i++) {
        let irs_mahasiswa = [];

        for (let j = 0; j < list_irs.length; j++) {
            // cek tiap irs yang punya nilai mahasiswa == mahasiswa.id
            if (list_mhs[i]._id.equals(list_irs[j].mahasiswa)) {
                let obj_irs = {
                    semester_aktif: list_irs[j].semester_aktif,
                    sks: list_irs[j].sks,
                    file: list_irs[j].file,
                    status_konfirmasi: list_irs[j].status_konfirmasi,
                };

                irs_mahasiswa.push(obj_irs);
            }
        }
        let obj_mahasiswa = {
            name: list_mhs[i].name,
            nim: list_mhs[i].nim,
            angkatan: list_mhs[i].angkatan,
            irs: irs_mahasiswa,
        };

        result.push(obj_mahasiswa);
    }
    res.status(200).send(result);
};

const verifyIRS = async (req, res) => {
    const mhs = await Mahasiswa.findOne({ nim: req.params.nim });
    const dosen = await Dosen.findOne({ user: req.userId });

    if (!dosen._id.equals(mhs.kodeWali)) {
        res.status(403).send(`Anda bukan dosen wali dari ${mhs.name}`);
        return;
    }

    IRS.findOneAndUpdate(
        { mahasiswa: mhs._id, semester_aktif: req.params.semester_aktif },
        { status_konfirmasi: req.body.status_konfirmasi },
        (err, data) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send("IRS verified");
        }
    );
};

module.exports = {
    verifyIRS,
    waliIRS,
    submitIRS,
    getIRS,
    getAllIRS,
    downloadIRS,
};
