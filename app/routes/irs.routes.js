const { authJwt } = require("../middlewares");
const controller = require("../controllers/irs.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/irs",
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    controller.submitIRS
  );

  app.get(
    "/irs",
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    controller.getIRS
  );

  app.get(
    "/all-irs",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.getAllIRS
  );

  //get /irs/:nim/:semester but only mahasiswa and dosen can access

  app.get(
    "/irs/:nim/:semester_aktif",
    [authJwt.verifyToken, authJwt.getMahasiswaIdFromNim, authJwt.isKodeWali],
    controller.downloadIRS
  );

  app.get(
    "/verifikasi/irs",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.waliIRS
  );

  app.put(
    "/verifikasi/irs/:nim/:semester_aktif",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.verifyIRS
  );
};