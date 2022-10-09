var express = require('express');
var router = express.Router();
const {index} = require('./controller');

const {isHaveSession} = require('../middleware/auth');

router.use(isHaveSession);
router.get('/', index)

module.exports = router;
