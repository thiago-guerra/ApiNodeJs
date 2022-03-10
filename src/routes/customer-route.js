'use strict'

const express = require('express');
const routes = express.Router();
const customerController = require('../controllers/customer-controller');

routes.post('/', customerController.CreateCustomer);

module.exports = routes;