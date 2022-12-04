const SECRET = process.env.SECRET;
const db = require("../models");
const Mahasiswa = db.mahasiswa;
var jose = require("jose");

exports.getProfil = (req, res) => {
  Mahasiswa.findById(req.mahasiswaId, (err, mahasiswa) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(mahasiswa);
  });
};

exports.updateProfil = (req, res) => {
  Mahasiswa.findByIdAndUpdate(
    req.mahasiswaId,
    req.body,
    { new: true },
    async (err, mahasiswa) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      let token = await new jose.SignJWT({
        id: req.userId,
        role: "mahasiswa",
        name: mahasiswa.name,
        email: mahasiswa.email,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(new TextEncoder().encode(SECRET));
      res.status(200).send(token);
    }
  );
};
