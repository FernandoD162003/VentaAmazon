
'use strict'

const invoiceController = require('../controllers/invoice.controller');
const express = require('express');
const api = express.Router(); 
const mdAuth = require('../services/authenticated');


api.post('/buyNow', mdAuth.ensureAuth, invoiceController.buyNow);
api.get('/searchInvoice/:id', mdAuth.ensureAuth, invoiceController.searchInvoice);
api.get('/buyCart', mdAuth.ensureAuth, invoiceController.buyByCart);



module.exports = api;