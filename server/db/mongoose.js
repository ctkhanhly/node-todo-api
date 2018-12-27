var mongoose = require('mongoose');

//promise isn't built-in in javascript, came  from  lib bluebird,
//idea developers had, ppl started using it so much that they added to 
//the language
//using built-in Promise rather than 3rd party
mongoose.Promise = global.Promise;

//connect to database before writing data to the database
//add MONGODB_URI:make sure our app connects to the actual database
//b/c connecting to local host will fail, causing the app to crash
//mongoose.connect(process.env.MONGOLAB_CRIMSON_URI || 'mongodb://localhost:27017/TodoApp');
//doesnt need || anymore b/c set NODE_ENV variable in server.js
mongoose.connect(process.env.MONGOLAB_CRIMSON_URI);
//mongoose: mongoose
module.exports  = {mongoose};