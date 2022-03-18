'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.ListProducts = async (fields) => {
    return await Product.find({ active: true }, fields);
}

exports.GetBySlug = async (slug, fields) => {
    return await Product.findOne({ slug: slug }, fields);
}

exports.GetById = async (id) => {
    return await Product.findById(id);
}

exports.GetByTag = async (tag) => {
    return await Product.find({ tags: tag, active: true });
}

exports.CreateProduct = async (data) => {
    let product = new Product(data);
    await product.save();
}

exports.UpdateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            description: data.description,
            price: data.price,
            slug: data.slug,
            image: data.image
        }
    });
}

exports.DeleteProduct = async (id) => {
    return await Product.findByIdAndRemove(id);
}



