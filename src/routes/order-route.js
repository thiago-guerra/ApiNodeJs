'use strict'

const express = require('express');
const routes = express.Router();
const OrderController = require('../controllers/order-controller');

routes.get('/', OrderController.ListOrders);
routes.post('/', OrderController.CreateOrder);

module.exports = routes;
