'use strict';

const mongoose = require('mongoose');
const customer = require('../models/customer');
const Customer = mongoose.model('Customer');

exports.CreateCustomer = async (data) => {
    let customer = new Customer(data);
    await customer.save();
}

exports.ExistsCustomer = async (email) => {
    var result = await Customer.findOne({ email: email });
    return result != null;
}

exports.authenticate = async (data) =>{
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

exports.refreshToken = async (id) =>{
    const res = await Customer.findById(id);
    return res;
}