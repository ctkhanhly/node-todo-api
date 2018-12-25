var mongoose = require('mongoose');

//promise isn't built-in in javascript, came  from  lib bluebird,
//idea developers had, ppl started using it so much that they added to 
//the language
//using built-in Promise rather than 3rd party
mongoose.Promise = global.Promise;

//connect to database before writing data to the database
mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose: mongoose
module.exports  = {mongoose};