
'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameP: String,
    stock: Number,
    price: Number,
    category: {type: mongoose.Schema.ObjectId, ref: 'Category'}
});

module.exports = mongoose.model('Product', productSchema);