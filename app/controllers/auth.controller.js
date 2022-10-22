const SECRET = process.env.SECRET;
const db = require("../models");
const User = db.user;
const Mahasiswa = db.mahasiswa;

//session

var bcrypt = require("bcryptjs");
var jose = require("jose");

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      // check if session is already set if yes then respond with 200
      if (req.session.user) {
        return res.status(200).send({
          message: "User already logged in",
        });
      } else {
        // set session
        req.session.user = user.username;
        req.session.save(function (err) {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
        });
      }

      if (user.roles.name == "mahasiswa") {
        // Get mahasiswa name from user.id
        const mahasiswa = await Mahasiswa.findOne(
          { user: user._id },
          (err, mahasiswa) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            return mahasiswa;
          }
        );

        var token = await new jose.SignJWT({
          id: user.id,
          role: user.roles.name,
          name: mahasiswa.name,
        })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .setIssuedAt()
          .setExpirationTime("12h")
          .sign(new TextEncoder().encode(SECRET));

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles.name,
          accessToken: token,
        });
      } else {
        var token = await new jose.SignJWT({
          id: user.id,
          role: user.roles.name,
        })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .setIssuedAt()
          .setExpirationTime("12h")
          .sign(new TextEncoder().encode(SECRET));

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles.name,
          accessToken: token,
        });
      }
    });
};

exports.signout = (req, res) => {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/");
    });
  });
};
