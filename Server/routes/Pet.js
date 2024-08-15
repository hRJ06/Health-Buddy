const express = require('express');
const { getAppointments } = require('../controller/Pet');
const router = express.Router();

router.post('/getAppointments',getAppointments);

module.exports = router;