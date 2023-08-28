const express = require('express');
const { placeOrder , cancelOrder, generateOTP, confirmOrder, changeState} = require('../controller/Order');
const router = express.Router();

router.post('/placeOrder',placeOrder);
router.post('/cancelOrder',cancelOrder);
router.post('/generateOTP',generateOTP);
router.post('/confirmOrder',confirmOrder);
router.post('/changeState',changeState);

module.exports = router;