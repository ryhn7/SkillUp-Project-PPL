const db = require("../models");
const User = db.user;
const Role = db.role;
const Mahasiswa = db.mahasiswa;
const Status = db.status;

var bcrypt = require("bcryptjs");

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
    email: req.body.email,
    password: bcrypt.hashSync(req.body.name.toLowerCase().split(" ")[0], 8),
  });

  const mahasiswa = new Mahasiswa({
    user: user._id,
    name: req.body.name,
    email: req.body.email,
    nim: req.body.nim,
    angkatan: req.body.angkatan,
    doswal: req.body.doswal,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "mahasiswa" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];

        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          //make new mahasiswa
          mahasiswa.save((err, user) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (req.body.status) {
              Status.find(
                {
                  name: { $in: req.body.status },
                },
                (err, status) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }

                  mahasiswa.status = status.map((status) => status._id);
                  mahasiswa.save((err) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                  });
                }
              );
              res.send({ message: "User was registered successfully!" });
            }
          });
        });
      });
    }
  });
};

exports.listUser = (req, res) => {
  User.find({}, { password: 0 }, function (err, users) {
    var userMap = [];

    users.forEach(function (user) {
      userMap.push(user);
    });

    res.send(userMap);
  });
};

exports.listDataMahasiswa = (req, res) => {
  let statusMap = {};
  Status.find({}, { name: 1 }, function (err, status) {
    status.forEach(function (status) {
      statusMap[status._id] = status.name;
    });
  }).then(() => {
    Mahasiswa.find({}, function (err, mahasiswa) {
      var mahasiswaMap = [];
      mahasiswa.forEach(function (mahasiswa) {
        mahasiswaMap.push({
          _id: mahasiswa._id,
          name: mahasiswa.name,
          nim: mahasiswa.nim,
          angkatan: mahasiswa.angkatan,
          doswal: mahasiswa.doswal,
          status: statusMap[mahasiswa.status],
          user: mahasiswa.user,
        });
      });
      res.send(mahasiswaMap);
    });
  });
};
