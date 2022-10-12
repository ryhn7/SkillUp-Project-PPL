const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.mahasiswa = require("./mahasiswa.model");
db.status = require("./status.model");

db.ROLES = ["admin", "dosen", "mahasiswa", "departemen"];
db.STATUS = [
  "aktif",
  "cuti",
  "mangkir",
  "do",
  "undur diri",
  "lulus",
  "meninggal dunia",
];

module.exports = db;
