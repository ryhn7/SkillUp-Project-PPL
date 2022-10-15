const { mahasiswa, pkl } = require('../models');
const db = require('../models');
const { findByIdAndUpdate } = require('../models/user.model');
const pklRoutes = require('../routes/pkl.routes');
const PKL = db.pkl

exports.submitPKL = (req, res) => {
    const pkl = new PKL({
        status: req.body.status,
        nilai: req.body.nilai,
        semester: req.body.semester,
        status_konfirmasi: req.body.status_konfirmasi,
        file: req.file.path,
        mahasiswa: req.mahasiswaId
    })
    PKL.countDocuments({ mahasiswa: pkl.mahasiswa }, function (err, count) {
        //console.log('there are %d entry using this account before', count);
        if (count == 0) {
            pkl.save((err, pkl) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return
                }
                res.send({ message: 'PKL was uploaded successfully!' })
            })
        } else {
            PKL.findOneAndUpdate({ mahasiswa: pkl.mahasiswa }, {
                status: pkl.status,
                nilai: pkl.nilai,
                semester: pkl.semester,
                status_konfirmasi: pkl.status_konfirmasi,
                file: pkl.upload_pkl,
            }, function (err, data){
                if(err){
                    res.status(500).send({ message: err });
                    return
                }
                res.send({ message: 'PKL was updated successfully!' })
            })
            
        }
    });

}

exports.getPKL = (req, res) => {
    PKL.findOne({mahasiswa: req.mahasiswaId}, (err, data) => {
        if(err){
            res.status(500).send({ message: err });
            return
        }
        res.status(200).send({
            status: data.status,
            nilai: data.nilai,
            semester: data.semester,
            status_konfirmasi: data.status_konfirmasi,
            file: data.upload_pkl,
        })
    })
}