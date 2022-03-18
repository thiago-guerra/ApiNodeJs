'use strict'

const ValidationContract = require('../validators/fluent-validator');
const ProductRepository = require('../repositories/product-repository');
const azureStorage = require('azure-storage');
const config = require('../config');
const guid = require('guid');

exports.post = ('/', async (req, res, next) => {
    try {
        let contract = new ValidationContract();
        contract.hasMinLen(req.body.title, 3, "O título deve conter pelo menos 3 caracteres");
        contract.isRequired(req.body.slug, "O slug é obrigatório");
        contract.isRequired(req.body.price, "O preço é obrigatório");
        contract.hasMinLen(req.body.description, 5, "A descrição deve conter pelo menos 5 caracteres");
        contract.hasMaxLen(req.body.description, 50, "A descrição deve conter no máximo 50 caracteres");
        contract.isRequired(req.body.image, "A imagem do produto é obrigatória.");

        if (!contract.isValid()) {
            res.status(400).send(contract.erros());
            return;
        }

        var filename = await SaveImageStorage('product-images', req.body.image);

        await ProductRepository.CreateProduct({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: `${config.baseUrlAzureStorage}/product-images/${filename}`
        });

        res.status(200).send({
            Message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
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
        await DeleteImageStorageProduct(req.params.id, (error, result, response) => {
            if (error)
                ResponseError(error, res);
        });

        let filename = null;
        if (req.body.image)
            filename = await SaveImageStorage('product-images', req.body.image);

        var data = await ProductRepository.UpdateProduct(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            slug: req.body.slug,
            image: `${config.baseUrlAzureStorage}/product-images/${filename}`
        });
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
        await DeleteImageStorageProduct(req.params.id, (error, result, response) => {
            if (error)
                ResponseError(error, res);
        });

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

async function SaveImageStorage(container, base64) {
    //Create blob service
    const blobsvc = azureStorage.createBlobService(config.containerStorageConnectionString);
    let filename = guid.raw().toString() + '.jpg';
    let matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    //Save image
    await blobsvc.createBlockBlobFromText(container, filename, buffer, { contentType: type },
        function (error, result, response) {
            if (error) {
                filename = 'default-product.jpg'
            }
        });

    return filename;
}

async function DeleteImageStorageProduct(productId, callback) {
    var prod = await ProductRepository.GetById(productId);

    if (prod && prod.image) {
        const blobsvc = azureStorage.createBlobService(config.containerStorageConnectionString);
        var url = `${config.baseUrlAzureStorage}/product-images/`;
        var filenameOld = prod.image.replace(url, "").trim();
        await blobsvc.deleteBlobIfExists("product-images", filenameOld, callback);
    }
}