const { authJwt } = require("../middlewares");
const controller = require("../controllers/skripsi.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/skripsi",
    // midleware jwt
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    // controller
    controller.submitSkripsi
  );

  app.get(
    "/skripsi",
    // midleware jwt
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    // controller
    controller.getSkripsi
  );

  app.get(
    "/all-skripsi",
    [authJwt.verifyToken, authJwt.isDepartemen],
    // controller
    controller.getRekap
  );

  app.get(
    "/skripsi/:nim",
    [authJwt.verifyToken, authJwt.getMahasiswaIdFromNim, authJwt.isKodeWali],
    // controller
    controller.downloadSkripsi
  );

  app.get(
    "/rekap/skripsi",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.waliSkripsi
  );

  app.get(
    "/verifikasi/skripsi",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.getVerifikasiSkripsi
  );

  app.post(
    "/verifikasi/skripsi/:nim",
    [authJwt.verifyToken, authJwt.isDosen],
    controller.verifSkripsi
  );
};
