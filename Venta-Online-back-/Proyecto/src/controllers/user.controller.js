'use strict'

const User = require('../models/user.model');
const { validateData, searchUser, encrypt, 
        checkPassword, checkPermission, checkUpdate} = require('../utils/validate');
const jwt = require('../services/jwt');
const Shopping = require('../models/cartShopping.model');


exports.test = (req, res)=>{
    return res.send({message: 'Function test is running'});
}

exports.register = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }
        const msg = validateData(data);

        if(!msg){          
            const userExist = await searchUser(params.username);
            if(!userExist){
                data.surname = params.surname;
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);
            
                let user = new User(data);
                await user.save();
                
                const users = await User.findOne({username: params.username});
                const dataS = {
                    user: users.id
                }
                let shopping = new Shopping(dataS);
                await shopping.save();

                return res.send({message: 'User created successfully'});
            }else{
                return res.send({message: 'Username already in use, choose another username'}); 
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const data = { 
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                const search = await User.findOne({username: data.username});
                const shopping = await Shopping.findOne({ user: search.id });
                return res.send({token,message: 'Login successfully', shopping});
                
            }else{
                return res.send({message: 'Username or password incorrect'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Unauthorized to update this user'});
        else{
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false) return res.status(400).send({message: 'This params can only update by admin'});
            const already = await searchUser(params.username);
            if(!already){
                const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new:true})
                .lean()
                return res.send({ userUpdated, message: 'User updated'});
            }else{
                return res.send({message: 'Username already taken'})
            } 
        }    
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.delete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'Unauthorized to delete this user'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(500).send({message: 'User not found or already deleted'});
        return res.send({userDeleted, message: 'Account deleted'});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.managementUser = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            role: params.role,
            password: params.password
        }
        const msg = validateData(data);

        if(!msg){          
            const userExist = await searchUser(params.username);
            if(!userExist){
                data.surname = params.surname;
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);    

                let user = new User(data);
                await user.save();
                return res.send({message: 'User created successfully'});
            }else{
                return res.send({message: 'Username already in use, choose another username'}); 
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.managementUpdate = async(req, res)=>{
    try{
        const params = req.body;
        const userId = req.params.id

        const checkRole = await User.findOne({_id: userId});
        if(!checkRole) return res.send({message: 'User not found'});      
        if(checkRole.role === 'ADMIN') 
        return res.status(403).send({message: 'Acction unauthorized'});
        const updateManagement = await User.findOneAndUpdate({_id: userId}, params, {new: true})
        return res.send({message: 'Updated Management', updateManagement});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.managementDelete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const checkRole = await User.findOne({_id: userId});
        if(!checkRole) return res.status(500).send({message: 'User not found or already deleted'});
        if(checkRole.role === 'ADMIN'){
        return res.status(403).send({message: 'Acction unauthorized'});
        } 
        else{
        const userDeleted = await User.findOneAndDelete({_id: userId});
        return res.send({message: 'Account deleted', userDeleted});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

