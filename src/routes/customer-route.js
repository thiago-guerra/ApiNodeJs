'use strict'

const express = require('express');
const routes = express.Router();
const customerController = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

routes.post('/', customerController.CreateCustomer);
routes.post('/authenticate', customerController.authenticate);
routes.post('/refresh-token', authService.authorize, customerController.refreshToken);

module.exports = routes;