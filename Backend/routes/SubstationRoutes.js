
const { addSubstation,getSubstations } = require("../controllers/SubstationController")
const authorizeRoles = require('../Middleware/RoleMiddleWare')
const verifyToken = require('../Middleware/VerifyAccessToken');
const express = require('express')
const router = express.Router();

router.post('/add', verifyToken, authorizeRoles('admin'), addSubstation);
router.get('/get', verifyToken, authorizeRoles('admin'), getSubstations);

module.exports = router