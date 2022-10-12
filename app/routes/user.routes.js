const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/all", controller.allAccess);

  app.get("/mahasiswa", [authJwt.verifyToken], controller.mahasiswaBoard);

  app.get(
    "/dosen",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.dosenBoard
  );

  app.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/departemen",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.departemenBoard
  );

  app.post(
    "/generate",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],
    controller.signup
  );

  app.get(
    "/list-user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.listUser
  );

  app.get(
    "/list-mahasiswa",
    [authJwt.verifyToken, authJwt.isAdmin || authJwt.isDepartemen],
    controller.listDataMahasiswa
  );
};
