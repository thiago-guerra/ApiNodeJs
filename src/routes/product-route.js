'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const authService = require('../services/auth-service');

router.get('/', productController.get);
router.get('/:slug', productController.getBySlug);
router.get('/admin/:id', productController.getById);
router.get('/tags/:tag', productController.getByTag);
router.post('/', authService.isAdmin, productController.post);
router.put('/:id', authService.isAdmin, productController.put);
router.delete('/:id', authService.isAdmin, productController.delete);

module.exports = router;
