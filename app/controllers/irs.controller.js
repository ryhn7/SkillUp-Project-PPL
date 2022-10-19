const db = require("../models");
const IRS = db.irs;
//fs
const fs = require("fs");
exports.submitIRS = (req, res) => {
    //get user id from jwt

    const irs = new IRS({
        semester: req.body.semester,
        sks: req.body.sks,
        file: req.file.path,
        //get from logged mahasiswa objectid
        konfirmasi: req.body.konfirmasi,
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
                                        konfirmasi: req.body.konfirmasi,
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
                        });
                    }
                );
            }
        }
    );
};
