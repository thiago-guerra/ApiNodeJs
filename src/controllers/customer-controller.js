'use strict'

const ValidationContract = require('../validators/fluent-validator');
const CustomerRepository = require('../repositories/customer-repository');

exports.CreateCustomer = ('/', async (req, res, next) => {
    try {
        let validation = new ValidationContract();
        validation.isRequired(req.body.name, "O nome é obrigatório.");
        validation.isEmail(req.body.email, "Digite o e-mail válido.");
        validation.hasMinLen(req.body.name, 3, "O nome deve conter pelo menos 3 caracteres");
        validation.isRequired(req.body.password, "O password é obrigatório.");
        validation.isFixedLen(req.body.password, 4, "O password deve conter 4 dígitos");
        if (!validation.isValid())
            res.status(400).send(contract.erros());

        await CustomerRepository.CreateCustomer(req.body);
        res.status(200).send({ data: "Cliente cadastrado com sucesso." });
    } catch (error) {
        ResponseError(error, res);
    }
});

function ResponseError(error, res) {
    res.status(500).send({ message: 'Falha ao processar requisição.', data: error });
}

