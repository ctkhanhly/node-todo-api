const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    //when a mongoose model is converted into a json value
    var user = this;
    //convert mongoose model to regular obj where only variables available
    //in the document exists
    var userObject = user.toObject();
    return _.pick(userObject, ['_id','email']);
};

//UserSchema.methods is an obj, add any instance methods,
//have access to individual doc
//arrow functions don't have this keyword, this stores individual doc
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    //user.tokens.push({access,token}); //error depending on versions of mongoose
    //update the local model
    user.tokens = user.tokens.concat([{access,token}]);
    //save the local user model
    //return the Promise of then so in server.js can chain another Promise
    return user.save().then(()=>{
        return token;
        //this value will get passed as the success argument
        //for the next then call
    });
};

//mongoose.model(modelName, schema)
//this declaration has to be after defining methods!!!!!!!
var User = mongoose.model('User', UserSchema);

module.exports = {User};

//cannot add methods to user, so have to create a schema