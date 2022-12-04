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

const fs = require("fs");
var bcrypt = require("bcryptjs");
const { checkRolesExisted } = require("../middlewares/verifyGenerate");
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
    status: req.body.status,
    user: user._id,
    angkatan: req.body.angkatan,
    kodeWali: req.body.kodeWali,
    alamat: req.body.alamat,
  });

  // Save User in the database then save Mahasiswa
  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    Role.findOne(
      {
        name: "mahasiswa",
      },
      (err, role) => {
        //if error then delete user
        if (err) {
          User.findByIdAndRemove(user._id, (err) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
              return;
            }
          });
          res.status(500).send({
            message: err,
          });
          return;
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
            return;
          }
          mahasiswa.save((err, mahasiswa) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
              return;
            }
            res.send({
              message: "User was registered successfully!",
            });
          });
        });
      }
    );
  });
};

exports.listUser = (req, res) => {
  User.find(
    {},
    {
      password: 0,
    }
  )
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
        message: err,
      });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: {
            $in: req.body.roles,
          },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({
                message: err,
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
      Role.findOne(
        {
          name: "dosen",
        },
        (err, role) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
            return;
          }

          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
              return;
            }
            dosen.save((err) => {
              if (err) {
                res.status(500).send({
                  message: err,
                });
                return;
              }
              res.send({
                message: "Dosen was registered successfully!",
              });
            });
          });
        }
      );
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
  // Find role id with name mahasiswa and save to variable
  Role.findOne(
    {
      name: "mahasiswa",
    },
    (err, role) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }
      // Read csv file
      csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
          // Loop through each row in csv file
          jsonObj.forEach((row) => {
            // Create new user
            const user = new User({
              username: row.nim,
              email: row.email,
              password: bcrypt.hashSync(
                row.name.toLowerCase().split(" ")[0],
                8
              ),
              roles: role._id,
            });

            // Find dosen with row.dosenWali (nip)
            Dosen.findOne(
              {
                nip: row.dosenWali,
              },
              (err, dosen) => {
                if (err) {
                  res.status(500).send({
                    message: err,
                  });
                  return;
                }
                // Create new mahasiswa
                const mahasiswa = new Mahasiswa({
                  name: row.name,
                  nim: row.nim,
                  user: user._id,
                  angkatan: row.angkatan,
                  status: row.status,
                  kodeWali: dosen._id,
                });

                // Save user and mahasiswa
                user.save((err, user) => {
                  if (err) {
                    res.status(500).send({
                      message: err,
                    });
                    return;
                  }
                  mahasiswa.save((err) => {
                    if (err) {
                      res.status(500).send({
                        message: err,
                      });
                      return;
                    }
                  });
                });
              }
            );
          });
          res.send({
            message: "User was registered successfully!",
          });
        })
        .then(() => {
          // Delete file
          fs.unlinkSync(req.file.path);
        });
    }
  );
};

exports.getRekapAllMhs = async (req, res) => {
  const curYear = 1900 + new Date().getYear();
  const list_pkl = await PKL.find({});
  const list_skripsi = await Skripsi.find({});
  let list_rekap = [];

  for (let i = 0; i < 5; i++) {
    const year = curYear - i;
    let lulus_skripsi = 0;
    let tidak_skripsi = 0;
    let lulus_pkl = 0;
    let tidak_pkl = 0;

    const list_mhs = await Mahasiswa.find({
      angkatan: year,
    });

    // cari pkl yang lulus dan tidak lulus
    for (let j = 0; j < list_mhs.length; j++) {
      for (let k = 0; k < list_pkl.length; k++) {
        if (list_mhs[j]._id.equals(list_pkl[k].mahasiswa)) {
          if (list_pkl[k].status_konfirmasi == "sudah") {
            lulus_pkl++;
          } else {
            tidak_pkl++;
          }
        }
      }
    }

    // cari skripsi yang lulus dan tidak lulus
    for (let j = 0; j < list_mhs.length; j++) {
      for (let k = 0; k < list_skripsi.length; k++) {
        if (list_mhs[j]._id.equals(list_skripsi[k].mahasiswa)) {
          if (list_skripsi[k].status_konfirmasi == "sudah") {
            lulus_skripsi++;
          } else {
            tidak_skripsi++;
          }
        }
      }
    }

    // konstanta untuk status mahasiswa
    const aktif = await Mahasiswa.count({
      status: "Aktif",
      angkatan: year,
    });
    const cuti = await Mahasiswa.count({
      status: "Cuti",
      angkatan: year,
    });
    const mangkir = await Mahasiswa.count({
      status: "Mangkir",
      angkatan: year,
    });
    const drop = await Mahasiswa.count({
      status: "Drop Out",
      angkatan: year,
    });
    const mengundurkan = await Mahasiswa.count({
      status: "Mengundurkan Diri",
      angkatan: year,
    });
    const lulus = await Mahasiswa.count({
      status: "Lulus",
      angkatan: year,
    });
    const meninggal = await Mahasiswa.count({
      status: "Meninggal Dunia",
      angkatan: year,
    });

    obj_rekap = {
      [year]: {
        status: {
          aktif,
          cuti,
          mangkir,
          do: drop,
          undur_diri: mengundurkan,
          lulus,
          meninggal_dunia: meninggal,
        },
        pkl: {
          lulus: lulus_pkl,
          belum: tidak_pkl,
        },
        skripsi: {
          lulus: lulus_skripsi,
          belum: tidak_skripsi,
        },
      },
    };

    list_rekap.push(obj_rekap);
  }
  res.status(200).send(list_rekap);
};

//   // create batch user for mahasiwa from csv file using csvtojson
//   const file = req.file.path;
//   csv()
//     .fromFile(file)
//     .then((jsonObj) => {
//       // console.log(jsonObj);
//       jsonObj.forEach((data) => {
//         const user = new User({
//           username: data.nim,
//           email: data.email,
//           password: bcrypt.hashSync(data.name.toLowerCase().split(" ")[0], 8),
//         });

//         const mahasiswa = new Mahasiswa({
//           name: data.name,
//           nim: data.nim,
//           user: user._id,
//           angkatan: data.angkatan,
//           kodeWali: data.kodeWali,
//         });

//         user.save((err, user) => {
//           if (err) {
//             res.status(500).send({
//               message: err,
//             });
//             // return;
//           }

//           if (req.body.roles) {
//             Role.find(
//               {
//                 name: {
//                   $in: req.body.roles,
//                 },
//               },
//               (err, roles) => {
//                 if (err) {
//                   res.status(500).send({
//                     message: err,
//                   });
//                   return;
//                 }

//                 user.roles = roles.map((role) => role._id);
//                 user.save((err) => {
//                   if (err) {
//                     res.status(500).send({
//                       message: err,
//                     });
//                     return;
//                   }
//                   // res.send({
//                   //   message: "User was registered successfully!",
//                   //   // data: user
//                   // });
//                 });
//               }
//             );
//           } else {
//             //if roles is empty then assign mahasiswa role and make mahasiswa
//             Role.findOne(
//               {
//                 name: "mahasiswa",
//               },
//               (err, role) => {
//                 if (err) {
//                   res.status(500).send({
//                     message: err,
//                   });
//                   return;
//                 }

//                 user.roles = [role._id];
//                 user.save((err) => {
//                   if (err) {
//                     res.status(500).send({
//                       message: err,
//                     });
//                     return;
//                   }
//                   mahasiswa.save((err) => {
//                     if (err) {
//                       res.status(500).send({
//                         message: err,
//                       });
//                       return;
//                     }
//                   });
//                 });
//               }
//             );
//           }
//         });
//       });
//       res.status(200).json({
//         message: "Mahasiswa was registered successfully!",
//         data: jsonObj,
//       });
//     });
// };

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
              message: err,
            });
            return;
          }

          if (req.body.roles) {
            Role.find(
              {
                name: {
                  $in: req.body.roles,
                },
              },
              (err, roles) => {
                if (err) {
                  res.status(500).send({
                    message: err,
                  });
                  return;
                }

                user.roles = roles.map((role) => role._id);
                user.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err,
                    });
                    return;
                  }
                });
              }
            );
          } else {
            Role.findOne(
              {
                name: "dosen",
              },
              (err, role) => {
                if (err) {
                  res.status(500).send({
                    message: err,
                  });
                  return;
                }

                user.roles = [role._id];
                user.save((err) => {
                  if (err) {
                    res.status(500).send({
                      message: err,
                    });
                    return;
                  }
                  dosen.save((err) => {
                    if (err) {
                      res.status(500).send({
                        message: err,
                      }); // kalau gaada error di table mahasiswa ini aman dijalanin
                      console.log(err);
                      return;
                    }
                  });
                });
              }
            );
          }
        });
      });
      res.status(200).json({
        message: "Dosen was registered successfully!",
        data: jsonObj,
      });
    });
};

exports.deleteAllMhs = async (req, res) => {
  const mhs = await Role.findOne({
    name: "mahasiswa",
  });
  // console.log(mhs._id);

  // const list_mhs = await User.find({ roles: mhs._id });

  // res.status(200).send(list_mhs);

  User.deleteMany(
    {
      roles: mhs._id,
    },
    (err, data) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }
      res.status(200).send(data);
    }
  );
};

exports.getRekapAllMhsCount = async (req, res) => {
  const curYear = 1900 + new Date().getYear();
  const list_pkl = await PKL.find({});
  const list_skripsi = await Skripsi.find({});
  let list_rekap = {};

  for (let i = 0; i < 5; i++) {
    const year = curYear - i;
    let lulus_skripsi = 0;
    let tidak_skripsi = 0;
    let lulus_pkl = 0;
    let tidak_pkl = 0;

    const list_mhs = await Mahasiswa.find({
      angkatan: year,
    });

    // cari pkl yang lulus dan tidak lulus
    for (let j = 0; j < list_mhs.length; j++) {
      for (let k = 0; k < list_pkl.length; k++) {
        if (list_mhs[j]._id.equals(list_pkl[k].mahasiswa)) {
          if (list_pkl[k].status_konfirmasi == "sudah") {
            lulus_pkl++;
          } else {
            tidak_pkl++;
          }
        }
      }
    }

    // cari skripsi yang lulus dan tidak lulus
    for (let j = 0; j < list_mhs.length; j++) {
      for (let k = 0; k < list_skripsi.length; k++) {
        if (list_mhs[j]._id.equals(list_skripsi[k].mahasiswa)) {
          if (list_skripsi[k].status_konfirmasi == "sudah") {
            lulus_skripsi++;
          } else {
            tidak_skripsi++;
          }
        }
      }
    }

    // konstanta untuk status mahasiswa
    const aktif = await Mahasiswa.count({
      status: "Aktif",
      angkatan: year,
    });
    const cuti = await Mahasiswa.count({
      status: "Cuti",
      angkatan: year,
    });
    const mangkir = await Mahasiswa.count({
      status: "Mangkir",
      angkatan: year,
    });
    const drop = await Mahasiswa.count({
      status: "Drop Out",
      angkatan: year,
    });
    const mengundurkan = await Mahasiswa.count({
      status: "Mengundurkan Diri",
      angkatan: year,
    });
    const lulus = await Mahasiswa.count({
      status: "Lulus",
      angkatan: year,
    });
    const meninggal = await Mahasiswa.count({
      status: "Meninggal Dunia",
      angkatan: year,
    });

    list_rekap[year] = {
      status: {
        aktif,
        cuti,
        mangkir,
        do: drop,
        undur_diri: mengundurkan,
        lulus,
        meninggal_dunia: meninggal,
      },
      pkl: {
        lulus: lulus_pkl,
        belum: tidak_pkl,
      },
      skripsi: {
        lulus: lulus_skripsi,
        belum: tidak_skripsi,
      },
    };
  }
  res.status(200).send(list_rekap);
};

exports.getRekapDosenCount = async (req, res) => {
  const curYear = 1900 + new Date().getYear();

  let result = [];
  result = [];

  let lulusPKL = 0;
  let belumPKL = 0;
  let lulusSkripsi = 0;
  let belumSkripsi = 0;

  let list_rekap = {};

  // const tahun = ["2018", "2019", "2020", "2021", "2022"];
  let dosen,
    queryMhs,
    resultMhs,
    queryPKL,
    resultPKL,
    querySkripsi,
    resultSkripsi,
    resultAktif,
    resultCuti,
    resultDrop,
    resultLulus,
    resultMangkir,
    resultMengundurkan,
    resultMeninggal;
  for (let i = 0; i < 5; i++) {
    const year = curYear - i;
    lulusPKL = 0;
    belumPKL = 0;
    lulusSkripsi = 0;
    belumSkripsi = 0;

    dosen = await Dosen.findOne({
      user: req.userId,
    });
    queryMhs = Mahasiswa.find({
      kodeWali: dosen._id,
      angkatan: year,
    });
    resultMhs = await queryMhs.exec();
    queryPKL = PKL.find();
    resultPKL = await queryPKL.exec();
    querySkripsi = Skripsi.find();
    resultSkripsi = await querySkripsi.exec();
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
    resultAktif = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Aktif",
      angkatan: year,
    });
    resultCuti = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Cuti",
      angkatan: year,
    });
    resultMangkir = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Mangkir",
      angkatan: year,
    });
    resultDrop = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Drop Out",
      angkatan: year,
    });
    resultMengundurkan = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Undur Diri",
      angkatan: year,
    });
    resultLulus = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Lulus",
      angkatan: year,
    });
    resultMeninggal = await Mahasiswa.count({
      kodeWali: dosen._id,
      status: "Meninggal Dunia",
      angkatan: year,
    });

    list_rekap[year] = {
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
    };
  }
  res.status(200).send(list_rekap);
};

exports.getRekapDosen = async (req, res) => {
  let result = [];
  let lulusPKL = 0;
  let belumPKL = 0;
  let lulusSkripsi = 0;
  let belumSkripsi = 0;

  const dosen = await Dosen.findOne({
    user: req.userId,
  });
  const queryMhs = Mahasiswa.find({
    kodeWali: dosen._id,
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

exports.getRekapAllMhs = async (req, res) => {
  const lulus_skripsi = await Skripsi.count({
    status_konfirmasi: "sudah",
  });
  const tidak_skripsi = await Skripsi.count({
    status_konfirmasi: "belum",
  });
  const lulus_pkl = await PKL.count({
    status_konfirmasi: "sudah",
  });
  const tidak_pkl = await PKL.count({
    status_konfirmasi: "belum",
  });

  const aktif = await Mahasiswa.count({
    status: "Aktif",
  });
  const cuti = await Mahasiswa.count({
    status: "Cuti",
  });
  const mangkir = await Mahasiswa.count({
    status: "Mangkir",
  });
  const drop = await Mahasiswa.count({
    status: "Drop Out",
  });
  const mengundurkan = await Mahasiswa.count({
    status: "Mengundurkan Diri",
  });
  const lulus = await Mahasiswa.count({
    status: "Lulus",
  });
  const meninggal = await Mahasiswa.count({
    status: "Meninggal Dunia",
  });

  const list_mhs = await Mahasiswa.find({});
  const list_khs = [];

  for (let i = 0; i < list_mhs.length; i++) {
    khs = await KHS.find({
      mahasiswa: list_mhs[i]._id,
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
};

// dosen
exports.getDetailMhsWali = async (req, res) => {
  const dosen = await Dosen.findOne({
    user: req.userId,
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
    let semester;
    if (list_irs) {
      for (let i = 0; i < list_irs.length; i++) {
        list_semester.push(list_irs[i].semester_aktif);
      }
      semester = Math.max(...list_semester);
    }

    let obj_detail;

    if (pkl_mhs && skripsi_mhs) {
      obj_detail = {
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
        tanggal: skripsi_mhs.tanggal.toISOString().split("T")[0],
      };
    } else {
      obj_detail = {
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        angkatan: mahasiswa.angkatan,
        semester,
        sks: list_sks,
        nilai_pkl: "-",
        nilai_skripsi: "-",
        semester_PKL: "-",
        semester_skripsi: "-",
        ip: list_ip,
        ipk: list_ipk,
        tanggal: "-",
      };
    }
    res.status(200).send(obj_detail);
  }
};

//change password feature for user with error handling
exports.changePassword = async (req, res) => {
  const user = await User.findById(req.userId);
  const { oldPassword, newPassword } = req.body;

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Invalid Password!",
    });
  }

  user.password = bcrypt.hashSync(newPassword, 8);

  await user.save();

  res.status(200).send({
    message: "Password was updated successfully!",
  });
};

//reset password feature for user from admin with error handling
exports.resetPassword = async (req, res) => {
  const user = await User.findById(req.body.id);

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  //get user role
  const role = await Role.findById(user.roles);
  if (role.name == "dosen") {
    user.password = bcrypt.hashSync("dosen", 8);
  } //if user role is mahasiswa then reset password to mahasiswa firstname
  else if (role.name == "mahasiswa") {
    const mhs = await Mahasiswa.findOne({
      user: user._id,
    });
    user.password = bcrypt.hashSync(mhs.name.toLowerCase().split(" ")[0], 8);
  } else if (role.name == "departemen") {
    user.password = bcrypt.hashSync("departemen", 8);
  }

  await user.save();

  res.status(200).send({
    message: "Password was reset successfully!",
  });
};

// depratemen
exports.getAllInfoWithNIM = async (req, res) => {
  // pendefinisian
  const mahasiswa = await Mahasiswa.findOne({
    nim: req.params.nim,
  });

  if (mahasiswa) {
    const pkl = await PKL.findOne({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const skripsi = await Skripsi.findOne({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const irs = await IRS.find({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    const khs = await KHS.find({
      mahasiswa: mahasiswa._id,
      status_konfirmasi: "sudah",
    });
    // pendifinisian dan pengecekan array IRS dan KHS
    let listSKS = [];
    let listSKSK = [];
    let listIP = [];
    let listIPK = [];
    let sem = 0;
    if (irs) {
      irs.forEach((isian) => {
        sem = Math.max(isian.semester_aktif, sem);
      });
    }

    if (khs) {
      khs.forEach((kartu) => {
        if (kartu.status_konfirmasi === "sudah") {
          listSKS.push(kartu.sks);
          listSKSK.push(kartu.sks_kumulatif);
          listIP.push(kartu.ip);
          listIPK.push(kartu.ip_kumulatif);
        } else {
          listSKS.push("-");
          listSKSK.push("-");
          listIP.push("-");
          listIPK.push("-");
        }
      });
    }
    let i;
    for (i = 0; i < 14 - irs.length; i++) {
      listSKS.push("-");
    }
    for (i = 0; i < 14 - khs.length; i++) {
      listSKSK.push("-");
      listIP.push("-");
      listIPK.push("-");
    }

    // pendefinisian hasil
    let result;
    if (skripsi && pkl) {
      result = {
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
        tanggal: skripsi.tanggal.toISOString().split("T")[0],
      };
    } else {
      result = {
        name: mahasiswa.name,
        nim: mahasiswa.nim,
        angkatan: mahasiswa.angkatan,
        semester: sem,
        sks: listSKS,
        sks_kumulatif: listSKSK,
        nilai_pkl: "-",
        nilai_skripsi: "-",
        semester_PKL: "-",
        semester_skripsi: "-",
        ip: listIP,
        ipk: listIPK,
        tanggal: "-",
      };
    }
    res.status(200).send(result);
  }
};
