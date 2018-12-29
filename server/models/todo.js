//dont have to load mongoose.js, can load plain mongoose lib
var mongoose = require('mongoose');
//mongoose will automatically lowercase and pluralize todo
var Todo = mongoose.model('Todo', {
    text: {
        //can be a number,boolean too, mongoose cast ur number in quotes
        type: String,
        //validators
        required: true,
        minLength: 1,//2
        //if all empty spaces in the str->  error since minLength =1
        trim: true//1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        //only set when the task is completed
        default: null
    },
    //no need for createdAt timeStamp - built in to id
    //id of user who created the todo, user indeed has 
    //_: ObjectID
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports =  {Todo};

