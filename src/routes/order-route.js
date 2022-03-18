'use strict'

const express = require('express');
const routes = express.Router();
const OrderController = require('../controllers/order-controller');
const authService = require('../services/auth-service');

routes.get('/', authService.authorize, OrderController.ListOrders);
routes.post('/', authService.authorize, OrderController.CreateOrder);

module.exports = routes;
