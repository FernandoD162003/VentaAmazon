'use strict'

const categoryController = require('../controllers/category.controller');
const express = require('express');
const api = express.Router(); 
const mdAuth = require('../services/authenticated');


api.post('/addCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.addCategory);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.deleteCategory);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.updateCategory);


api.get('/getCategories', mdAuth.ensureAuth, categoryController.getCategories);






module.exports = api;