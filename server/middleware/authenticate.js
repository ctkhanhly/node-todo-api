var {User} = require('./../models/user');

//middleware
var authenticate = (req,res,next)=>{
    var key = 'x-auth'
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        //modify request
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=> res.status(401).send());
};

//authenticate: authenticate
module.exports = {authenticate};