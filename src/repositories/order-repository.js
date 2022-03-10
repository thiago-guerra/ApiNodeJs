'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.ListOrders = async () => {
    var result = await Order.find({}, 'number status customer items')
    .populate('customer', 'name')
    .populate('items.product', 'title');
    return result;
}

exports.CreateOrder = async (data) => {
    var order = new Order(data);
    await order.save();
}
