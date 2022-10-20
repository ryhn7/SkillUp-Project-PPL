const { authJwt } = require("../middlewares");
const controller = require("../controllers/pkl.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/pkl",
    [authJwt.verifyToken, authJwt.getMahasiswaId, authJwt.isMahasiswa],
    controller.submitPKL
  );

  app.get(
    "/pkl",
    [authJwt.verifyToken, authJwt.getMahasiswaId, authJwt.isMahasiswa],
    controller.getPKL
  );

  app.get(
    "/all-pkl",
    [authJwt.verifyToken, authJwt.isDepartemen],
    controller.getRekapPKL
  );

  app.get(
    "/pkl/:nim",
    [
      authJwt.verifyToken,
      authJwt.isMahasiswaOrDosen,
      authJwt.getMahasiswaIdFromNim,
    ],
    controller.downloadPKL
  );
};
