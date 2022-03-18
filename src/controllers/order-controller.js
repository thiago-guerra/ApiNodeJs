'use strict';

const ValidationContract = require('../validators/fluent-validator');
const OrderRepository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.ListOrders = ('/', async (req, res, next) => {
    try {
        var result = await OrderRepository.ListOrders();
        res.status(200).send(result);
    } catch (error) {
        ResponseError(error, res);
    }
});

exports.CreateOrder = ('/', async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await OrderRepository.CreateOrder({
            customer: data.id,
            number: guid.raw().substring(0,6),
            items: req.body.items
        });
        res.status(200).send({ Message: "Pedido cadastrado com sucesso." });
    } catch (error) {
        ResponseError(error, res);
    }
});

function ResponseError(error, res) {
    res.status(500).send({ message: 'Falha ao processar requisição.', data: error });
}

