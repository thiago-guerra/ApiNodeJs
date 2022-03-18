'use strict'

const ValidationContract = require('../validators/fluent-validator');
const CustomerRepository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.CreateCustomer = ('/', async (req, res, next) => {
    try {
        let validation = new ValidationContract();
        validation.isRequired(req.body.name, "O nome é obrigatório.");
        validation.isEmail(req.body.email, "Digite o e-mail válido.");
        validation.hasMinLen(req.body.name, 3, "O nome deve conter pelo menos 3 caracteres");
        validation.isRequired(req.body.password, "O password é obrigatório.");
        validation.isFixedLen(req.body.password, 4, "O password deve conter 4 dígitos");

        if (!validation.isValid()) {
            res.status(400).send(contract.erros());
            return;
        }

        if (await CustomerRepository.ExistsCustomer(req.body.email)) {
            res.status(400).send({ message: "Este já está sendo utilizado." });
            return;
        }

        await CustomerRepository.CreateCustomer({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: req.body.roles ? req.body.roles : ["user"]
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

exports.authenticate = ('/', async (req, res, next) => {
    try {
        let validation = new ValidationContract();
        validation.isEmail(req.body.email, "Digite o e-mail válido.");
        validation.isRequired(req.body.password, "O password é obrigatório.");
        validation.isFixedLen(req.body.password, 4, "O password deve conter 4 dígitos");

        if (!validation.isValid()) {
            res.status(400).send(contract.erros());
            return;
        }

        let customer = await CustomerRepository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(401).send({ message: "Usuário ou senha inválido." });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id, 
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });

    } catch (error) {
        ResponseError(error, res);
    }
});

exports.refreshToken = ('/', async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        
        let customer = await CustomerRepository.refreshToken(data.id);

        if (!customer) {
            res.status(404).send({ message: "Usuário não encontrado." });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
             email: customer.email,
             name: customer.name,
             roles: customer.roles
        });

        res.status(201).send({
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });

    } catch (error) {
        ResponseError(error, res);
    }
});

function ResponseError(error, res) {
    res.status(500).send({ message: 'Falha ao processar requisição.', data: error });
}

