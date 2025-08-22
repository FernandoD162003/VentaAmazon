'use strict'

const Shopping = require('../models/cartShopping.model');
const Product = require('../models/product.model');
const { validateStock,validateData } = require('../utils/validate');


exports.addShopping = async (req, res) => {
    try {
        const userId = req.user.sub
        const params = req.body;

        const addProduct = {
            product: params.product,
            amount: params.amount
        }
        
        const msg = validateData(addProduct);
        
        if (!msg) {
            const searchProduct = await Product.findOne({_id: addProduct.product});
            const searchId = await Shopping.findOne({ user: userId});
            const validate = await validateStock(searchProduct.id, addProduct.amount);
            if(validate != true) return res.send({message: 'Not many units in stock'});
            if (searchId) {
                const update = await Shopping.findOneAndUpdate({ _id: searchId.id }, { $push: { products: [{ product: addProduct.product, amount: addProduct.amount }]}});
                return res.send({ message: 'Added Product', update})
                
            }
        }else return res.send(msg)

    } catch (err) {
        console.log(err);
        return err;
    }
}