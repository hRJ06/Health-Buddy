const Retailer = require('../model/Retailer');
const User = require('../model/User');
const Doctor = require('../model/Doctor');
const Product = require('../model/Product');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailSender = require('../util/mailSender');

const mongoose = require('mongoose');

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file,folder,quality) {
    const options = {folder};
    if(quality) {
        options.quality = quality;
    }
    /* Preferred Option */
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.signup = async (req, res) => {
    try {
        const {firstName, lastName, email, password, phoneNo, role, gstIn} = req.body;
        if(!firstName || !lastName || !email || !password || !phoneNo || !role || !gstIn) {
            return res.status(403).json({
                success: false,
                message: 'Please provide all required information'
            })
        }
        let existingUser = null;

        // Check if Retailer is already present
        existingUser = await Retailer.findOne({email: email});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Retailer already exists'
            })
        }
        existingUser = await Retailer.findOne({phoneNo: phoneNo});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Retailer already exists'
            })
        }

        // Check if User is already present
        existingUser = await User.findOne({email: email});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'User already exists'
            })
        }
        existingUser = await User.findOne({phoneNo: phoneNo});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'User already exists'
            })
        }

        // Check if Doctor is already present
        existingUser = await Doctor.findOne({email: email});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Doctor already exists'
            })
        }
        existingUser = await Doctor.findOne({phoneNo: phoneNo});
        if(existingUser) {
            return res.status(200).json({
                success: true,
                message: 'Doctor already exists'
            })
        }


        const file = req.files.imagefile;
        const supportedTypes = ['jpeg', 'jpg','png'];
        const fileType = file.name.split('.')[1].toLowerCase();
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid File Type'
            })
        }
        const response = await uploadFileToCloudinary(file,'Whisker Whisper');
        let hashedPassword = null;
        if(password) {
            try{
                hashedPassword = await bcrypt.hash(password,10);
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error in hashing password'
                })
            }
        }
        await Retailer.create({
            firstName, lastName, email, password: hashedPassword, phoneNo, role, gstIn, image: response.secure_url
        })
        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error signing User'
        })
    }
}
exports.login = async (req, res) => {
    try {
        const {email, phoneNo, password} = req.body;
        if((!email || !phoneNo) && !password) {
            return res.status(403).json({
                success: false,
                message: 'Please provide all details'
            })
        }
        let user = null;
        if(email) {
            user = await Retailer.findOne({email: email});
        }
        if(phoneNo) {
            user = await Retailer.findOne({phoneNo: phoneNo});
        }
        console.log(user);
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNo: user.phoneNo,
            id:user._id,
            role: user.role
        }

        if(await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '2h'})

            user.token = token;
            user.password = undefined;
            return res.status(200).json({
                success: true,
                token,
                user,
                message: 'User Logged In Successfully'
            })
        }
        else {
            return res.status(500).json({
                success: false,
                message: "Password doesn't match"
            })
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error logging in'
        })
    }
}
exports.resetPasswordToken = async(req, res) => {
    try {
        const {email} = req.body;
        const user = await Retailer.findOne({email: email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: `No user is registered with us for the mail ${email}`
            })
        }
        const token = crypto.randomBytes(20).toString('hex');
        await Retailer.findOneAndUpdate(
            {email: email},
            {
                resetToken: token,
                resetPasswordTokenExpires: Date.now() + 3600000
            }
        )
        const url = `http://localhost:3000/update-password/${token}`
        await mailSender(email,'Password Reset Instruction',`Your Link for email verification is ${url}. Please click the link to reset your password`);
        return res.status(200).json({
            success: true,
            message: 'Email to reset password was successfully sent'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error generating Reset Password Token'
        })
    }
}
exports.resetPassword = async(req, res) => {
    try {
        const {password, token} = req.body;
        const user = await Retailer.findOne({resetToken: token});
        if(!user) { 
            return res.status(404).json({
                success: false,
                message: 'No such user found'
            })
        }
        if(Date.now() > user.resetPasswordTokenExpires) {
            return res.status(403).json({
                success: false,
                message: 'Token Expired'
            })
        }
        const updatedPassword = await bcrypt.hash(password,10);
        await Retailer.findOneAndUpdate(
            {resetToken: token},
            {password: updatedPassword}
        )
        return res.status(200).json({
            success: true,
            message: 'Password Reset Successful'
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error in reset Password'
        })
    }
}
exports.addProduct = async(req, res) => {
    try {
        const {name, description, tag, type, token, price, quantity} = req.body;
        if(!name || !description || !tag || !type || !quantity) {
            return res.status(404).json({
                success: false,
                message: 'Please provide all details'
            })
        }
        let decode = null
        try {
            decode = jwt.verify(token,process.env.JWT_SECRET);
        }
        catch(err) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing'
            })
        }
        const product = await Product.create({name, description, tag, type, owner: decode.id, price, quantity});
        await Retailer.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(decode.id)},{
            $push: {
                products: product._id
            }
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Unable to add product'
        })
    }
}
exports.editProduct = async(req, res) => {
    try {
        const {name, description, price, quantity, productId} = req.body;
        const product = await Product.findById({_id: new mongoose.Types.ObjectId(productId)});
        if(name) {
            product.name = name;
            product.save();
        }
        if(description) {
            product.description = description;
            product.save();
        }
        if(price) {
            product.price = price;
            product.save();
        }
        if(quantity) {
            product.quantity = quantity;
            product.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully edited product details'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Unable to edit product'
        })
    }
}
exports.addImage = async(req, res) => {
    try {
        const file = req.files.imageFile;
        const supportedTypes = ['jpeg', 'jpg','png'];
        const fileType = file.name.split('.')[1].toLowerCase();
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid File Type'
            })
        }
        const response = await uploadFileToCloudinary(file,'Whisker Whisper');
        const {productId} = req.body;
        await Product.findByIdAndUpdate(
            {_id: new mongoose.Types.ObjectId(productId)},
            {
                $push: {
                    images: response.secure_url
                },
                status: 'Approved'
            }
        )
        return res.status(200).json({
            success: true,
            message: 'Successfully added image'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Unable to add image'
        })
    }
}
exports.getProducts = async(req, res) => {
    try {
        const {retailerId} = req.body;
        const products = await Product.find({owner: new mongoose.Types.ObjectId(retailerId)});
        return res.status(200).json({
            success: true,
            data: products,
            message: 'Successfully fetched all products'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Unable to get products'
        })
    }
}
exports.getRetailerDetails = async(req, res) => {
    try {
        const {token} = req.body;
        let decode = null;
        try {
            decode = jwt.verify(token,process.env.JWT_SECRET);
        }
        catch(err) {
            return res.status(500).json({
                success: false,
                message: 'Token missing'
            })
        }
        const retailer = await Retailer.findOne({_id : new mongoose.Types.ObjectId(decode.id)});
        return res.status(200).json({
            success: true,
            data: retailer,
            message: 'Retailer details fetched successfully'
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Unable to get Retailer Details'
        })
    }
}