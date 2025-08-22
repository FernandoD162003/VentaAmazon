
'use strict'

const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    amount: Number,
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Invoice', invoiceSchema);