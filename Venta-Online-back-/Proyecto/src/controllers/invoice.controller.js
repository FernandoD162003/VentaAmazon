
'use strict'

const Invoice = require('../models/invoice.model');
const Product = require('../models/product.model');
const Shopping = require('../models/cartShopping.model');
const { validateData, validateStock } = require('../utils/validate');


exports.buyNow = async (req, res) => {
    try {
        const params = req.body;

        const data = {
            amount: params.amount,
            product: params.product,
            user: req.user.sub
        }
        const msg = validateData(data);

        if (!msg) {
            const validate = await validateStock(data.product, params.amount);
            if (validate === true) {
                const invoice = new Invoice(data);
                await invoice.save();
                return res.send({ message: '¡Thanks for your purchase!, Invoice:', invoice });
            }
        else return res.send({ message: 'Not many units in stock' });

        } else return res.status(400).send(msg);
        
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.searchInvoice = async (req,res)=>{
    try{
        const invoiceId = req.params.id;
        const cartS = await Shopping.findOne({_id: invoiceId});
        return res.send(cartS); 
    }catch(err){
        console.log(err)
        return err
    }
}

exports.buyByCart = async (req, res) => {
    
    try {
            
        const userId = req.user.sub;
        const shopping = await Shopping.findOne({ user: userId });
        if (shopping) {
            for (var i = 0; i < shopping.products.length; i++) {
                const productId = shopping.products[i].product;
                const amount = shopping.products[i].amount;

                const product = await Product.findOne({ _id: productId});
                const subtraction = product.stock - amount;
                if (subtraction< 0) return res.send({ message: 'Not many units in stock' });

                const data = {
                    stock: subtraction
                }

                await Product.findOneAndUpdate({ _id: productId }, data, { new: true })
            }

            return res.send({ message: '¡Thanks for your purchase!, Invoice:', shopping });
        }else{
            return res.send({ message: 'Something went wrong'});
        }
        
    } catch (err) {
        console.log(err);
        return err;
    }
}





