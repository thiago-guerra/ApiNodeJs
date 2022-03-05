'use strict'

const mongoose = require('mongoose');
const ValidationContract = require('../validators/fluent-validator');
const ProductRepository = require('../repositories/product-repository');

exports.post = ('/', async (req, res, next) => {
    try {
        let contract = new ValidationContract();
        contract.hasMinLen(req.body.title, 3, "O título deve conter pelo menos 3 caracteres");
        contract.isRequired(req.body.slug, "O slug é obrigatório");
        contract.isRequired(req.body.price, "O preço é obrigatório");
        contract.hasMinLen(req.body.description, 5, "A descrição deve conter pelo menos 5 caracteres");
        contract.hasMaxLen(req.body.description, 50, "A descrição deve conter no máximo 50 caracteres");

        if (!contract.isValid()) {
            res.status(400).send(contract.erros());
            return;
        }

        await ProductRepository.CreateProduct(req.body);
        res.status(200).send({
            Message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        ResponseError(e, res);
    }
});

exports.get = async (req, res, next) => {
    try {
        var data = await ProductRepository.ListProducts('title price slug');
        res.status(200).send(data);
    } catch (e) {
        ResponseError(e, res);
    }
};

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await ProductRepository.GetBySlug(req.params.slug, 'title description price slug tags');
        res.status(200).send(data);
    } catch (e) {
        ResponseError(e, res);
    }
};

exports.getById = async (req, res, next) => {
    try {
        var data = await ProductRepository.GetById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        ResponseError(e, res);
    }
};

exports.getByTag = async (req, res, next) => {
    try {
        var data = await ProductRepository.GetByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        ResponseError(e, res);
    }
};

exports.put = ('/:id', async (req, res, next) => {
    try {
        var data = await ProductRepository.UpdateProduct(req.params.id, req.body);
        if (data)
            res.status(200).send({ message: "Produto atualizado com sucesso." });
        else
            res.status(404).send({ message: "Produto não encontrado" });
    } catch (e) {
        ResponseError(e, res);
    }
});

exports.delete = ('/:id', async (req, res, next) => {
    try {
        var data = await ProductRepository.DeleteProduct(req.params.id);
        if (data)
            res.status(200).send({ message: "Produto removido com sucesso." });
        else
            res.status(404).send({ message: "Produto não encontrado" });
    } catch (e) {
        ResponseError(e, res);
    }
});


function ResponseError(error, res) {
    res.status(500).send({ message: 'Falha ao processar requisição.', data: error });
}
