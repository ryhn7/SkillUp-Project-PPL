const { authJwt } = require("../middlewares");
const controller = require("../controllers/pkl.controller");
const { verifyToken, getMahasiswaId } = require("../middlewares/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post(
        "/pkl/submit",
        [authJwt.verifyToken, authJwt.getMahasiswaId, authJwt.isMahasiswa],
        controller.submitPKL
    )
}