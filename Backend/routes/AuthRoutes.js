

const {login,register, checkToken,logoutUser} = require('../controllers/AuthController')
const express = require('express')
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-token', checkToken);
router.post('/logout', logoutUser);

module.exports = router

