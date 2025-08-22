
'use strict'

const Product = require('../models/product.model');
const { validateData, 
        checkUpdate,
        searchProduct,
         checkCAT} = require('../utils/validate');



exports.addProduct = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            nameP: params.nameP,
            stock: params.stock,
            price: params.price,
            category: params.category,
        };
        const msg = validateData(data);
        if(!msg){
            const productExist = await searchProduct(params.nameP);
            if(!productExist){
        const product = new Product(data);
        await product.save();
        return res.send({message: 'Added Product', product});
            }else{
                res.send({message: 'Product already exist'});
        }
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}
exports.getProduct = async(req, res)=>{
    try{
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        if(!product) return res.send({message: 'Product not found'});
        return res.send({product});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProducts = async(req, res)=>{
    try{
        const products = await Product.find({});
        if(!products) return res.send({message: 'Products not found'});
        return res.send({products});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteProduct = async(req, res)=>{
    try{
        const productId = req.params.id
        const deleteP = await Product.findOneAndDelete({_id: productId})
        if(!deleteP) return res.send({message: 'Product not found'})
        return res.send({message: 'Deleted Product', deleteP})
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.updateProduct = async(req, res)=>{
    try{
        const params = req.body;
        const productId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'No parameters updated'});
        const productExist = await searchProduct(params.nameP);
        if(!productExist){
        const updateProduct = await Product.findOneAndUpdate({_id: productId}, params, {new: true}).populate('category').lean();
        if(!updateProduct) return res.send({message: 'Product not found'});
        updateProduct.category._id = undefined;
        return res.send({message: 'Updated Product', updateProduct});
        }else{
            res.send({message: 'Existing product'})
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProduct = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            nameP: params.nameP
        };
        const msg = validateData(data);
        if(!msg){
            const product = await Product.find({nameP: {$regex:params.nameP, $options: 'i'}});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchByCategory = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            category: params.category
        };
        const msg = validateData(data);
        if(!msg){
            const product = await Product.find({category: params.category});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.getProductsO = async(req, res)=>{
    try{
        const products = await Product.find({stock: 0})
        return res.send({products});
        
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.getProductsM = async(req, res)=>{
    try{
        
        const products = await Product.find( { stock: { $gte : 1 , $lte : 99} })
        return res.send({products});

    }catch(err){
        console.log(err);
        return err;
    }
}