var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        required: true,
        type: String,
        minLength: 1,
        trim: true
    }
});

module.exports = {User};