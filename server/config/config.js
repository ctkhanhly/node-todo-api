var env = process.env.NODE_ENV || 'development';
//if on heroku, already set. on test, already set. if on development
//won't be set, so we set it with ||
//console.log('env ***',env);

if(env ==='development'){
    process.env.PORT = 3000;
    process.env.MONGOLAB_CRIMSON_URI = 'mongodb://localhost:27017/TodoApp'; 
    //if on heroku, this will be set
}else if(env ==='test'){
    process.env.PORT = 3000;
    process.env.MONGOLAB_CRIMSON_URI = 'mongodb://localhost:27017/TodoAppTest'; 
}