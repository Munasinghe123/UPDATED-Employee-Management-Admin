
const express = require('express')
const router = express.Router();
const { searchEmployees,getAttendanceById, getFullLogs, getOtHours, allEmployees, updateWeeklyHours, getTodayCheckins, getAttendance, getAttendanceSummary, addEmployee, updateEmployee, disableEmployee } = require('../controllers/AdminController')
const authorizeRoles = require('../Middleware/RoleMiddleWare')
const verifyToken = require('../Middleware/VerifyAccessToken');

router.get(
    '/all-employees',
    verifyToken,
    authorizeRoles('admin'),
    allEmployees
)

router.get(
    '/today-checkins',
    verifyToken,
    authorizeRoles('admin'),
    getTodayCheckins
)

router.get(
    '/attendance',
    verifyToken,
    authorizeRoles('admin'),
    getAttendance
)

router.get(
    '/attendance-summary',
    verifyToken,
    authorizeRoles('admin'),
    getAttendanceSummary
)

router.post(
    '/employees',
    verifyToken,
    authorizeRoles('admin'),
    addEmployee
)

router.put(
    '/update-employee/:id',
    verifyToken,
    authorizeRoles('admin'),
    updateEmployee
)

router.put(
    '/disable-employee/:id',
    verifyToken,
    authorizeRoles('admin'),
    disableEmployee
)

router.get(
    '/getFullLogs',
    verifyToken,
    authorizeRoles('admin'),
    getFullLogs
)

router.get(
    '/getOtHours',
    verifyToken,
    authorizeRoles('admin'),
    getOtHours
)

router.get(
    '/getAttendenceById',
    verifyToken,
    authorizeRoles('admin'),
    getAttendanceById
)

router.get(
    '/searchEmployees',
    verifyToken,
    authorizeRoles('admin'),
    searchEmployees
)

module.exports = router