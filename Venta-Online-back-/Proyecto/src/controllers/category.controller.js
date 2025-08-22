
'use strict'

const Category = require('../models/category.model');
const { validateData, searchCategory,
    checkUpdate } = require('../utils/validate');
const Product = require('../models/product.model');



exports.addCategory = async (req, res) => {

    try {
        const params = req.body;
        const data = {
            nameCategory: params.nameCategory
        }
        const msg = validateData(data);
        if (!msg) {
            const existCategory = await searchCategory(params.nameCategory);
            if (!existCategory) {
                const category = new Category(data);
                await category.save();
                return res.send({ message: 'Added Category', category });
            } else {
                res.send({ message: 'Category already exist' })
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categorys = await Category.find();
        return res.send({ categorys });
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deleteCategory = await Category.findOneAndDelete({ _id: categoryId });
        const alreadyCategory = await Category.findOne({ nameCategory: 'Entretenimiento' });
        if (!alreadyCategory) {
            const defaultCa = {
                nameCategory: 'Entretenimiento'
            }
            const category = new Category(defaultCa);
            await category.save();
        }
        if (deleteCategory) {
            const bussqueda = await Category.findOne({ nameCategory: 'Entretenimiento' });
                const data = {
                    category: bussqueda.id
                }
                await Product.findOneAndUpdate({ category: categoryId }, data, { new: true });

        }
        if (!deleteCategory) return res.send({ message: 'Category Not Found' });
        return res.send({ message: 'Deleted Category', deleteCategory });
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const params = req.body;
        const categoryId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) return res.status(400).send({ message: 'Insert data to update' });
        const existCategory = await searchCategory(params.nameCategory);
        if (!existCategory) {
            const updateCategory = await Category.findOneAndUpdate({ _id: categoryId }, params, { new: true }).lean()
            if (!updateCategory) return res.send({ message: 'Product not found' });
            return res.send({ message: 'Updated Category', updateCategory });
        } else {
            res.send({ message: 'Category already exist' })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}