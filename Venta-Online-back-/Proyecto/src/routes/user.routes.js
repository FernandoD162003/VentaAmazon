'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router(); 
const mdAuth = require('../services/authenticated');

api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.update);
api.delete('/deleteUser/:id', mdAuth.ensureAuth, userController.delete);


api.post('/registerM', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.managementUser)
api.put('/updateM/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.managementUpdate);
api.delete('/deleteM/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.managementDelete);

module.exports = api;