const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    insertTime: {
        type: Date,
        required: true
    },
})
module.exports = mongoose.model('cart', cartSchema)