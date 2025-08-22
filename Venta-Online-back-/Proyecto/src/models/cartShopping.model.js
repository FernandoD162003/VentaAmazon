'use strict'

const mongoose = require('mongoose');

const shoppingSchema = mongoose.Schema({
    products: [
        {
            product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
            amount: Number
        }
    ],
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Shopping', shoppingSchema);
