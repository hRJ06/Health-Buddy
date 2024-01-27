const express = require('express');
const { signup, login, addProduct, addImage, editProduct, getProducts, getRetailerDetails, getProductDetails, removeProductImage } = require('../controller/Retailer');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/addProduct',addProduct);
router.post('/addImage',addImage);
router.post('/editProduct',editProduct);
router.post('/getProducts',getProducts);
router.post('/getRetailerDetails',getRetailerDetails);
router.get('/product/:productId',getProductDetails);
router.put('/removeImage/:productId',removeProductImage)

module.exports = router;