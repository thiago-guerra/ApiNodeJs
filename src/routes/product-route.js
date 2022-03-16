'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const authService = require('../services/auth-service');

router.get('/', productController.get);
router.get('/:slug', productController.getBySlug);
router.get('/admin/:id', productController.getById);
router.get('/tags/:tag', productController.getByTag);
router.post('/', authService.authorize, productController.post);
router.put('/:id', authService.authorize, productController.put);
router.delete('/:id', authService.authorize, productController.delete);

module.exports = router;
