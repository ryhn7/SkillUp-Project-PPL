var express = require('express');
var router = express.Router();
const { actionCreate } = require('./controller');

router.post('/create', actionCreate);

module.exports = router;

