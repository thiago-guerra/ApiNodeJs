'use strict'

const ValidationContract = require('../validators/fluent-validator');
const CustomerRepository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');

exports.CreateCustomer = ('/', async (req, res, next) => {
    try {
        let validation = new ValidationContract();
        validation.isRequired(req.body.name, "O nome é obrigatório.");
        validation.isEmail(req.body.email, "Digite o e-mail válido.");
        validation.hasMinLen(req.body.name, 3, "O nome deve conter pelo menos 3 caracteres");
        validation.isRequired(req.body.password, "O password é obrigatório.");
        validation.isFixedLen(req.body.password, 4, "O password deve conter 4 dígitos");
        
        if (!validation.isValid()){
            res.status(400).send(contract.erros());
            return;
        }

        if (await CustomerRepository.ExistsCustomer(req.body.email)){
            res.status(400).send({ message: "Este já está sendo utilizado." });
            return;
        }

        await CustomerRepository.CreateCustomer({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send(
            req.body.email,
            "Bem vindo ao Node Store",
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({ data: "Cliente cadastrado com sucesso." });
    } catch (error) {
        ResponseError(error, res);
    }
});

function ResponseError(error, res) {
    res.status(500).send({ message: 'Falha ao processar requisição.', data: error });
}

