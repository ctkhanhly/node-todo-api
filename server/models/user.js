const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
           validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
    
});

//override a method
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id','email']);
};

//sign
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
   
    user.tokens = user.tokens.concat([{access,token}]);
    
    return user.save().then(()=>{
        return token;
    });
};

//update method to update array
//remove any obj from the array that has the token property
//equal to the value that we passed in
UserSchema.methods.removeToken = function(token){
    //mongodb operator $pull: remove item from the array that
    //matches certain criteria
    //if token matches sth in that array => gets removed,
    //not just token property, the entire obj
    var user = this;
    return user.update({
        $pull: {
            //token: token
            tokens:{token}
        }
    });
    
};

//model method, UserSchema.statics is also an obj
//verify
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }
   
    //why not tokens[0].token?
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;

    //bcryptjs only supports callback, doesnt support promises
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err,res)=>{
                if(res){
                    return resolve(user);
                }else{
                    return reject();
                }
            });
            //reject => trigger catch ins server.js
        });
    });
};
//run code before an event, 1st argument- event: save, callback
//has to provide argument next
UserSchema.pre('save', function(next){
    var user = this;

    //check if pw was modified
    //save doc but never update pw, pw already hashed
    //prevent hashing hashed pw again
    //only encrypt if  it was just modified
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(user.password,salt, (err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
})
//mongoose.model(modelName, schema)
//this declaration has to be after defining methods!!!!!!!
var User = mongoose.model('User', UserSchema);

module.exports = {User};

//cannot add methods to user, so have to create a schema