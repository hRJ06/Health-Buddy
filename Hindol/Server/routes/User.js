const express = require('express');
const { signup, login, addPet, bookAppointment, getAllProducts, getCategoryProducts, getNameProducts, getAllPets, getUserDetails, AddToCart, removeFromCart, updateProfilePicture, getAppointments, editUserDetails, cancelAppointment, getSlots, addReview } = require('../controller/User');
const router = express.Router();

router.post('/signup',signup); 
router.post('/login',login);  
router.post('/getUserDetails',getUserDetails);
router.post('/addpet',addPet);
router.post('/bookAppointment',bookAppointment);
router.post('/cancelAppointment',cancelAppointment);
router.post('/getAppointments',getAppointments);
router.get('/getAllProducts',getAllProducts);
router.post('/editUserDetails',editUserDetails);
router.post('/getCategoryProducts',getCategoryProducts); 
router.post('/getNameProducts',getNameProducts); 
router.post('/getAllPets', getAllPets);
router.post('/addToCart',AddToCart); 
router.post('/removeFromCart',removeFromCart);
router.post('/updateProfilePicture',updateProfilePicture);
router.post('/getSlots',getSlots);
router.post('/addReview',addReview);

module.exports = router;