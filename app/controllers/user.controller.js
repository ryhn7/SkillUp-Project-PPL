const db = require("../models");
const csv = require("csvtojson");
const User = db.user;
const Role = db.role;
const Mahasiswa = db.mahasiswa;
const Skripsi = db.skripsi;
const PKL = db.pkl;
const Dosen = db.dosen;
const KHS = db.khs;
const IRS = db.irs;

var bcrypt = require("bcryptjs");
const {
  checkRolesExisted
} = require("../middlewares/verifyGenerate");
const pkl = require("../models/pkl.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.mahasiswaBoard = (req, res) => {
  res.status(200).send("Mahasiswa Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.dosenBoard = (req, res) => {
  res.status(200).send("dosen Content.");
};

exports.departemenBoard = (req, res) => {
  res.status(200).send("departemen Content.");
};

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.nim,
    password: bcrypt.hashSync(req.body.name.toLowerCase().split(" ")[0], 8),
  });

  const mahasiswa = new Mahasiswa({
    name: req.body.name,
    nim: req.body.nim,
    email: req.body.email,
    status: req.body.status,
    user: user._id,
    angkatan: req.body.angkatan,
    kodeWali: req.body.kodeWali,
    alamat: req.body.alamat,
    phone: req.body.phone,
    kodeKab: req.body.kodeKab,
  });

  // Save User in the database then save Mahasiswa
  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }
    Role.findOne({
      name: "mahasiswa"
    }, (err, role) => {
      //if error then delete user
      if (err) {
        User.findByIdAndRemove(user._id, (err) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }
        });
        res.status(500).send({
          message: err
        });
        return;
      }
      user.roles = [role._id];
      user.save((err) => {
        if (err) {
          res.status(500).send({
            message: err
          });
          return;
        }
        mahasiswa.save((err, mahasiswa) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }
          res.send({
            message: "User was registered successfully!"
          });
        });
      });
    });
  });
};

exports.listUser = (req, res) => {
  User.find({}, {
      password: 0
    })
    .populate("roles", "name")
    .exec(function (err, users) {
      var userMap = [];

      users.forEach(function (user) {
        userMap.push(user);
      });

      res.send(userMap);
    });
};

exports.listDataMahasiswa = (req, res) => {
  Mahasiswa.find({})
    .populate("status kodeWali", "name")
    .exec(function (err, mahasiswa) {
      var mahasiswaMap = [];

      mahasiswa.forEach(function (mahasiswa) {
        mahasiswaMap.push(mahasiswa);
      });

      res.send(mahasiswaMap);
    });
};

exports.signUpDosen = (req, res) => {
  const user = new User({
    username: req.body.nip,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.name.toLowerCase().split(" ")[0], 8),
  });

  const dosen = new Dosen({
    name: req.body.name,
    email: req.body.email,
    nip: req.body.nip,
    user: user._id,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }

    if (req.body.roles) {
      Role.find({
          name: {
            $in: req.body.roles
          },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({
                message: err
              });
              return;
            }

            res.send({
              message: "Dosen was registered successfully!",
            });
          });
        }
      );
    } else {
      //if roles is empty then assign mahasiswa role and make mahasiswa
      Role.findOne({
        name: "dosen"
      }, (err, role) => {
        if (err) {
          res.status(500).send({
            message: err
          });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }
          dosen.save((err) => {
            if (err) {
              res.status(500).send({
                message: err
              });
              return;
            }
            res.send({
              message: "Dosen was registered successfully!",
            });
          });
        });
      });
    }
  });
};

exports.listDosen = (req, res) => {
  Dosen.find({})
    .populate("roles", "name")
    .exec(function (err, dosen) {
      var dosenMap = [];

      dosen.forEach(function (dosen) {
        dosenMap.push(dosen);
      });

      res.send(dosenMap);
    });
};

// create batch generate user for mahasiswa using csv file
exports.createBatchUser = (req, res) => {
  // create batch user for mahasiwa from csv file using csvtojson
  const file = req.file.path;
  csv()
    .fromFile(file)
    .then((jsonObj) => {
      // console.log(jsonObj);
      jsonObj.forEach((data) => {
        const user = new User({
          username: data.nim,
          email: data.email,
          password: bcrypt.hashSync(data.name.toLowerCase().split(" ")[0], 8),
        });

        const mahasiswa = new Mahasiswa({
          name: data.name,
          nim: data.nim,
          email: data.email,
          user: user._id,
          angkatan: data.angkatan,
          kodeWali: data.kodeWali,
        });

        user.save((err, user) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }

          if (req.body.roles) {
            Role.find({
                name: {
                  $in: req.body.roles
                },
              },
              (err, roles) => {
                if (err) {
                  res.status(500).send({
                    message: err
                  });
                  return;
                }

                user.roles = roles.map((role) => role._id);
                user.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err
                    });
                    return;
                  }
                  // res.send({
                  //   message: "User was registered successfully!",
                  //   // data: user
                  // });
                });
              }
            );
          } else {
            //if roles is empty then assign mahasiswa role and make mahasiswa
            Role.findOne({
              name: "mahasiswa"
            }, (err, role) => {
              if (err) {
                res.status(500).send({
                  message: err
                });
                return;
              }

              user.roles = [role._id];
              user.save((err) => {
                if (err) {
                  res.status(500).send({
                    message: err
                  });
                  return;
                }
                mahasiswa.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err
                    });
                    return;
                  }
                });
              });
            });
          }
        });
      });
      res.status(200).json({
        message: "Mahasiswa was registered successfully!",
        data: jsonObj,
      });
    });
};

exports.createBatchDosen = (req, res) => {
  // create batch user for mahasiwa from csv file using csvtojson
  const file = req.file.path;
  csv()
    .fromFile(file)
    .then((jsonObj) => {
      // console.log(jsonObj);
      jsonObj.forEach((data) => {
        const user = new User({
          username: data.nip,
          email: data.email,
          password: bcrypt.hashSync("dosen", 8),
        });

        const dosen = new Dosen({
          name: data.name,
          email: data.email,
          nip: data.nip,
          user: user._id,
        });

        user.save((err, user) => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }

          if (req.body.roles) {
            Role.find({
                name: {
                  $in: req.body.roles
                },
              },
              (err, roles) => {
                if (err) {
                  res.status(500).send({
                    message: err
                  });
                  return;
                }

                user.roles = roles.map((role) => role._id);
                user.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err
                    });
                    return;
                  }
                });
              }
            );
          } else {
            Role.findOne({
              name: "dosen"
            }, (err, role) => {
              if (err) {
                res.status(500).send({
                  message: err
                });
                return;
              }

              user.roles = [role._id];
              user.save((err) => {
                if (err) {
                  res.status(500).send({
                    message: err
                  });
                  return;
                }
                dosen.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err
                    }); // kalau gaada error di table mahasiswa ini aman dijalanin
                    console.log(err);
                    return;
                  }
                });
              });
            });
          }
        });
      });
      res.status(200).json({
        message: "Dosen was registered successfully!",
        data: jsonObj,
      });
    });
};
exports.getRekapDosen = async (req, res) => {
  let result = [];
  let lulusPKL = 0;
  let belumPKL = 0;
  let lulusSkripsi = 0;
  let belumSkripsi = 0;

  const dosen = await Dosen.findOne({
    user: req.userId
  });
  const queryMhs = Mahasiswa.find({
    kodeWali: dosen._id
  });
  const resultMhs = await queryMhs.exec();
  const queryPKL = PKL.find();
  const resultPKL = await queryPKL.exec();
  const querySkripsi = Skripsi.find();
  const resultSkripsi = await querySkripsi.exec();
  // proses mencari rekap kelulusan PKL
  for (let i = 0; i < resultMhs.length; i++) {
    let ck = false;
    for (let j = 0; j < resultPKL.length; j++) {
      if (resultMhs[i]._id.equals(resultPKL[j].mahasiswa)) {
        if (resultPKL[j].status_konfirmasi === "sudah") {
          lulusPKL++;
        } else {
          belumPKL++;
        }
        ck = true;
        break;
      }
    }
    if (!ck) {
      belumPKL++;
    }
  }
  // proses mencari rekap kelulusan skripsi
  for (let i = 0; i < resultMhs.length; i++) {
    let ck = false;
    for (let j = 0; j < resultSkripsi.length; j++) {
      if (resultMhs[i]._id.equals(resultSkripsi[j].mahasiswa)) {
        if (resultSkripsi[j].status_konfirmasi === "sudah") {
          lulusSkripsi++;
        } else {
          belumSkripsi++;
        }
        ck = true;
        break;
      }
    }
    if (!ck) {
      belumSkripsi++;
    }
  }

  // proses mencari rekap status mhs sesuai doswal
  const resultAktif = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Aktif",
  });
  const resultCuti = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Cuti",
  });
  const resultMangkir = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Mangkir",
  });
  const resultDrop = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Drop Out",
  });
  const resultMengundurkan = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Undur Diri",
  });
  const resultLulus = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Lulus",
  });
  const resultMeninggal = await Mahasiswa.count({
    kodeWali: dosen._id,
    status: "Meninggal Dunia",
  });

  res.status(200).send({
    status: {
      aktif: resultAktif,
      cuti: resultCuti,
      mangkir: resultMangkir,
      do: resultDrop,
      undur_diri: resultMengundurkan,
      lulus: resultLulus,
      meninggal_dunia: resultMeninggal,
    },
    pkl: {
      lulus: lulusPKL,
      belum: belumPKL,
    },
    skripsi: {
      lulus: lulusSkripsi,
      belum: belumSkripsi,
    },
  });
};

exports.deleteAllMhs = async (req, res) => {
  const mhs = await Role.findOne({
    name: "mahasiswa",
  });
  // console.log(mhs._id);

  // const list_mhs = await User.find({ roles: mhs._id });

  // res.status(200).send(list_mhs);

  User.deleteMany({
    roles: mhs._id
  }, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }
    res.status(200).send(data);
  });
};

exports.getRekapAllMhs = async (req, res) => {
  const lulus_skripsi = await Skripsi.count({
    status_konfirmasi: "sudah"
  });
  const tidak_skripsi = await Skripsi.count({
    status_konfirmasi: "belum"
  });
  const lulus_pkl = await PKL.count({
    status_konfirmasi: "sudah"
  });
  const tidak_pkl = await PKL.count({
    status_konfirmasi: "belum"
  });

  const aktif = await Mahasiswa.count({
    status: "Aktif"
  });
  const cuti = await Mahasiswa.count({
    status: "Cuti"
  });
  const mangkir = await Mahasiswa.count({
    status: "Mangkir"
  });
  const drop = await Mahasiswa.count({
    status: "Drop Out"
  });
  const mengundurkan = await Mahasiswa.count({
    status: "Mengundurkan Diri"
  });
  const lulus = await Mahasiswa.count({
    status: "Lulus"
  });
  const meninggal = await Mahasiswa.count({
    status: "Meninggal Dunia"
  });

  const list_mhs = await Mahasiswa.find({});
  const list_khs = [];

  for (let i = 0; i < list_mhs.length; i++) {
    khs = await KHS.find({
      mahasiswa: list_mhs[i]._id
    });

    const new_obj = {
      name: list_mhs[i].name,
      khs,
    };

    list_khs.push(new_obj);
  }

  const obj_rekap = {
    status: {
      aktif,
      cuti,
      mangkir,
      do: drop,
      undur_diri: mengundurkan,
      lulus,
      meninggal_dunia: meninggal,
    },

    skripsi: {
      lulus_skripsi,
      tidak_skripsi,
    },

    pkl: {
      lulus_pkl,
      tidak_pkl,
    },
  };

  res.status(200).send(obj_rekap);
};

exports.getMahasiswaDosen = async (req, res) => {
  const dosen = await Dosen.findOne({
    user: req.userId,
  });
  const mahasiswa = await Mahasiswa.find({
    kodeWali: dosen._id,
  });
  let listMahasiswa = [];
  mahasiswa.forEach((mhs) => {
    listMahasiswa.push(mhs);
  });
  res.status(200).send(listMahasiswa);
};

exports.listDataMahasiswa = async (req, res) => {
  const mahasiswa = await Mahasiswa.find({});
  let listAllMahasiswa = [];
  mahasiswa.forEach((mhs) => {
    listAllMahasiswa.push(mhs);
  });
  res.status(200).send(listAllMahasiswa);
};

exports.getInfoWithNIMDosen = async (req, res) => {
  const dosen = await Dosen.findOne({
    user: req.userId,
  });
  const mahasiswa = await Mahasiswa.findOne({
    nim: req.params.nim,
    kodeWali: dosen._id,
  });

  res.status(200).send(mahasiswa);
};

exports.getInfoWithNIMDepartemen = async (req, res) => {
  const mahasiswa = await Mahasiswa.findOne({
    nim: req.params.nim,
  });
  res.status(200).send(mahasiswa);
}

// dosen
exports.getDetailMhsWali = async (req, res) => {
  const dosen = await Dosen.findOne({
    user: req.userId
  });
  // pertama ambil data mahasiswanya
  const mahasiswa = await Mahasiswa.findOne({
    nim: req.params.nim,
    kodeWali: dosen._id,
  });
  if (mahasiswa) {
    // ambil khs yang dari mhs tersebut dah sudah di verifikasi
    const list_khs = await KHS.find({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const list_irs = await IRS.find({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const pkl_mhs = await PKL.findOne({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const skripsi_mhs = await Skripsi.findOne({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });

    let list_sks = [];
    let list_ip = [];
    let list_ipk = [];
    let list_semester = [];

    // untuk khs
    if (list_khs) {
      for (let i = 0; i < 14; i++) {
        if (!list_khs[i]) {
          list_sks.push("-");
          list_ip.push("-");
          list_ipk.push("-");
        } else {
          list_sks.push(list_khs[i].sks);
          list_ip.push(list_khs[i].ip);
          list_ipk.push(list_khs[i].ip_kumulatif);
        }
      }
    }


    // untuk irs
    if (list_irs && skripsi_mhs) {
      for (let i = 0; i < list_irs.length; i++) {
        list_semester.push(list_irs[i].semester_aktif);
      }

      const semester = Math.max(...list_semester);
      const obj_detail = {
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        angkatan: mahasiswa.angkatan,
        semester,
        sks: list_sks,
        nilai_pkl: pkl_mhs.nilai,
        nilai_skripsi: skripsi_mhs.nilai,
        semester_PKL: pkl_mhs.semester,
        semester_skripsi: skripsi_mhs.semester,
        ip: list_ip,
        ipk: list_ipk,
        tanggal: skripsi_mhs.tanggal.toISOString().split('T')[0]
      };


      res.status(200).send(obj_detail);
    }

  }

};

// depratemen
exports.getAllInfoWithNIM = async (req, res) => {
  // pendefinisian
  const mahasiswa = await Mahasiswa.findOne({
    nim: req.params.nim
  })

  if (mahasiswa) {
  const pkl = await PKL.findOne({
    mahasiswa: mahasiswa._id,
    status_konfirmasi: "sudah"
  })
  const skripsi = await Skripsi.findOne({
    mahasiswa,
    status_konfirmasi: "sudah"
  })
  const irs = await IRS.find({
    mahasiswa
  })
  const khs = await KHS.find({
    mahasiswa
  })
    // pendifinisian dan pengecekan array IRS dan KHS
    let listSKS = []
    let listSKSK = []
    let listIP = []
    let listIPK = []
    let sem = 0
    if (irs) {
      irs.forEach((isian) => {
        if (isian.status_konfirmasi === "sudah") {
          listSKS.push(isian.sks)
        } else {
          listSKS.push("-")
        }
        sem = isian.semester_aktif
      })
    }

    if (khs) {
      khs.forEach((kartu) => {
        if (kartu.status_konfirmasi === "sudah") {
          listSKSK.push(kartu.sks_kumulatif)
          listIP.push(kartu.ip)
          listIPK.push(kartu.ip_kumulatif)
        } else {
          listSKSK.push("-")
          listIP.push("-")
          listIPK.push("-")
        }

      })
    }
    let i
    for (i = 0; i < 14 - irs.length; i++) {
      listSKS.push("-")
    }
    for (i = 0; i < 14 - khs.length; i++) {
      listSKSK.push("-")
      listIP.push("-")
      listIPK.push("-")
    }


    // pendefinisian hasil
    if(skripsi){
      const result = {
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        angkatan: mahasiswa.angkatan,
        semester: sem,
        sks: listSKS,
        sks_kumulatif: listSKSK,
        nilai_pkl: pkl.nilai,
        nilai_skripsi: skripsi.nilai,
        semester_PKL: pkl.semester,
        semester_skripsi: skripsi.semester,
        ip: listIP,
        ipk: listIPK,
        tanggal: skripsi.tanggal.toISOString().split('T')[0]
      }
      res.status(200).send(result)
    }
    
  }

}