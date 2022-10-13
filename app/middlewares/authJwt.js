const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Mahasiswa = db.mahasiswa;

//get mahasiswa id
getMahasiswaId = (req, res, next) => {
  Mahasiswa.findOne({
    user: req.userId,
  }).exec((err, mahasiswa) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    req.mahasiswaId = mahasiswa._id;
    next();
  });
};

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isMahasiswa = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "mahasiswa") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Mahasiswa Role!" });
        return;
      }
    );
  });
};

isDosen = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "dosen") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Dosen Role!" });
        return;
      }
    );
  });
};

isDepartemen = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "departemen") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Departemen Role!" });
        return;
      }
    );
  });
};

isMaster = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "departemen" || roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Departemen Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isDosen,
  isDepartemen,
  isMahasiswa,
  getMahasiswaId,
  isMaster,
};
module.exports = authJwt;
