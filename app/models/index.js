const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.mahasiswa = require("./mahasiswa.model");
db.status = require("./status.model");
db.provinsi = require("./provinsi.model");
db.kabupaten = require("./kabupaten.model");
db.irs = require("./irs.model");
db.pkl = require("./pkl.model");
db.khs = require("./khs.model");
db.skripsi = require("./skripsi.model");


db.ROLES = ["admin", "dosen", "mahasiswa", "departemen"];
db.STATUS = [
  "Aktif",
  "Cuti",
  "Mangkir",
  "Drop Out",
  "Mengundurkan Diri",
  "Lulus",
  "Meninggal Dunia",
];

module.exports = db;
