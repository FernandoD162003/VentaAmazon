
'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router(); 
const mdAuth = require('../services/authenticated');


api.post('/addProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.addProduct);
api.get('/getProducts', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProducts);
api.get('/getProductsO', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProductsO);
api.get('/getProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);


api.get('/getProductsM', mdAuth.ensureAuth, productController.getProductsM);
api.get('/searchProduct', mdAuth.ensureAuth, productController.searchProduct);
api.get('/searchByCategory', mdAuth.ensureAuth, productController.searchByCategory);


module.exports = api;