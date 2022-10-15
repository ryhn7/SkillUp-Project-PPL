const db = require("../models");
const Skripsi = db.skripsi;

exports.submitSkripsi = (req, res) => {
    // buat instance skripsi
    const skripsi = new Skripsi({
        status: req.body.status, 
        nilai: req.body.nilai,
        tanggal: req.body.tanggal, 
        lama_studi: req.body.lama_studi, 
        status_konfirmasi: req.body.status_konfirmasi,
        file: req.file.path,
        mahasiswa: req.mahasiswaid
    });

    Skripsi.countDocuments({mahasiswa : skripsi.mahasiswa}, (err,count) => {
        // kalau tidak ada data di dalam database maka nillai dari count adalah 0
        if(count == 0){
            // skripsi save, menyimpan data entri baru 
            skripsi.save((err, skripsi) => {
                if (err) {
                    res
                        .status(500)
                        .send({message: err});
                    return;
                }
                res.send({message: "Skripsi was uploaded succesfully"})
            })
        }else{
            // kalau dia sudah ada di dalam database maka nilai akan di update
            Skripsi.findOneAndUpdate({
                mahasiswa: skripsi.mahasiswa
            },{
                status: skripsi.status,
                nilai: skripsi.nilai,
                tanggal: skripsi.tanggal,
                lama_studi: skripsi.lama_studi,
                status_konfirmasi: skripsi.status_konfirmasi,
                file: skripsi.file
            }, (err,data) => {
                if(err){
                    res.status(500).send({"message" : err});
                    return;
                }
                console.log(data);
                res.status(200).send({
                    "message" : "Skripsi is succesfully updated"
                })
            }) 
        }
    })
}

exports.deleteSkripsi = (req,res) => {

}