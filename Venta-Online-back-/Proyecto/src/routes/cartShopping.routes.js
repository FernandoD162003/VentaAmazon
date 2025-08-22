
'use strict'

const shoppingController = require('../controllers/cartShopping.controller');
const express = require('express');
const api = express.Router(); 
const mdAuth = require('../services/authenticated');


api.post('/addShopping', mdAuth.ensureAuth, shoppingController.addShopping )



module.exports = api;