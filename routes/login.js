const express = require('express');
const { check } = require('express-validator');
var router = express.Router();
const LoginController = require("../controllers/login.controller");
const RegisterController = require("../controllers/register.controller");
/* GET users listing. */
router.post('/login', 
    [
        check('username', 'Username không được để trống').notEmpty(),
        check('password', 'Password không được để trống').notEmpty(),
      ],    
    LoginController.Login
);
router.post('/register', 
    [
        check('username', 'Username không được để trống').notEmpty(),
        check('password', 'Password không được để trống').notEmpty(),
      ],    
    RegisterController.Register
);
router.post('/verify', RegisterController.Verify);
router.post('/resend-code', RegisterController.generateNewCode);

module.exports = router;
