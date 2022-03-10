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
