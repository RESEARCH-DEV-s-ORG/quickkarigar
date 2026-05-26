const express = require('express');
const router = express.Router();
const {
    register
} = require('../controllers/auth/registerController');

const {
    login
} = require('../controllers/auth/loginController');
const {googleLogin} = require("../controllers/auth/googleController");

router.post(
    '/register',
    register
);

router.post(
    '/login',
    login
);

router.post('/googleLogin', googleLogin);

module.exports = router;