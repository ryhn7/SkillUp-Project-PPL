var express = require('express');
var router = express.Router();
const { viewSignIn, viewAdmin, actionSignIn, actionSignUp, actionLogout, signIn } = require('./controller');
const {isAuth, isLoginAdmin, isLoginMhs} = require('../middleware/auth');


/* GET home page. */
router.get('/', viewSignIn);
router.get('/admin', isAuth, isLoginAdmin, viewAdmin);
router.post('/signin', signIn);
router.post('/', actionSignIn);
router.post('/signup', actionSignUp);
router.get('/logout', actionLogout);


module.exports = router;
