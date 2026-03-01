const userModel = require('../models/user.models');

const jwt = require('jsonwebtoken');


async function authuser(req,res,next){
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({
            message:'Unauthorized'
        });

    }
    try{
        const decoded  =  jwt.verify(token,process.env.Jwt_Secret);

        const user = await userModel.findById(decoded.id);

        req.user = user;

        next();

    }catch(err){
        return res.status.json({
            message:'Unauthorized'
        })
    }


}


module.exports = {authuser};