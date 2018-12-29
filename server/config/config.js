var env = process.env.NODE_ENV || 'development';

if(env === 'test'|| env === 'development'){
    var config = require('./config.json');
    var envConfig = config [env];
    
    //Object.keys: get all keys and return as an array
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });
};

