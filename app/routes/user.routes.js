const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller.js");
const { verifyGenerate } = require("../middlewares");

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
      verifyGenerate.checkDuplicateUsernameOrEmail,
      verifyGenerate.checkRolesExisted,
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
    [authJwt.verifyToken, authJwt.isMaster],
    controller.listDataMahasiswa
  );

  app.post(
    "/generate-dosen",
    [
      verifyGenerate.checkDuplicateUsernameOrEmail,
      verifyGenerate.checkRolesExisted,
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],
    controller.signUpDosen
  );

  app.get(
    "/list-dosen",
    [authJwt.verifyToken, authJwt.isMaster],
    controller.listDosen
  );
  app.post(
    "/batch-generate",
    [authJwt.verifyToken, authJwt.isMaster],
    controller.createBatchUser
  );

  app.get(
    "/rekap/dosen",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getRekapDosen
  );

  app.post(
    "/generate",
    [
      verifyGenerate.checkDuplicateUsernameOrEmail,
      verifyGenerate.checkRolesExisted,
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
    [authJwt.verifyToken, authJwt.isMaster],
    controller.listDataMahasiswa
  );

  app.post(
    "/generate-dosen",
    [
      verifyGenerate.checkDuplicateUsernameOrEmail,
      verifyGenerate.checkRolesExisted,
      authJwt.verifyToken,
      authJwt.isAdmin,
    ],
    controller.signUpDosen
  );

  app.get(
    "/list-dosen",
    [authJwt.verifyToken, authJwt.isMaster],
    controller.listDosen
  );
  app.post(
    "/batch-generate",
    [
      authJwt.verifyToken,
      authJwt.isMaster,
      verifyGenerate.checkDuplicateUsernameOrEmail,
    ],
    controller.createBatchUser
  );

  app.post(
    "/batch-dosen",
    [
      authJwt.verifyToken,
      verifyGenerate.checkDuplicateUsernameOrEmail,
      verifyGenerate.checkRolesExisted,
      authJwt.isMaster,
    ],
    controller.createBatchDosen
  );

  app.get(
    "/rekap/dosen",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getRekapDosen
  );

  app.get(
    "/rekap/count/dosen",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getRekapDosenCount
  );

  app.get(
    "/mahasiswa-dosen",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getMahasiswaDosen
  );

  app.get(
    "/rekap/departemen",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.getRekapAllMhs
  );

  app.get(
    "/rekap/count/departemen",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.getRekapAllMhsCount
  );

  app.get(
    "/dosen/mahasiswa/:nim",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getDetailMhsWali
  );

  app.get(
    "/departemen/mahasiswa/:nim",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.getAllInfoWithNIM
  );

  app.post("/changepassword", [authJwt.verifyToken], controller.changePassword);

  app.post(
    "/resetpassword",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.resetPassword
  );
};
