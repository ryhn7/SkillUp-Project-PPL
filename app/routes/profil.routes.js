const { authJwt } = require("../middlewares");
const controller = require("../controllers/profil.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/profil",
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    controller.getProfil
  );

  app.put(
    "/profil",
    [authJwt.verifyToken, authJwt.isMahasiswa, authJwt.getMahasiswaId],
    controller.updateProfil
  );
};
