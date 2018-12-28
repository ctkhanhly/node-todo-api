//256 bits of the resulting hash
//1-way function, only 1 output for an input
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//salt our password: genSAlt
//password1 -> mmhnnm (hash)
//add a bunch of random characters to that hash
//passwordkahfiuqhriu2334
//=> hash same pw multiple times => different result, no1 can pre-compute 
//the table to look up the pw
//arguments: number of rounds to use to generate salt, callback
//bcrypt is inherently slow=> prevent brute-force attack
//bigger number, longer it takes, prevent brute-force
//adding unneccessary length to ur API for pw is good idea, not another
//prevent s.o from making a million requests/sec, a few hundred instead
//reduce the chance they can crack the pw
var password  = '1234abc!';
bcrypt.genSalt(10,(err,salt)=>{
    //the thing we wanna hash, salt, callback
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
        //number of rounds, length for hash and salt
        //dont need to have both salt value and pw in database thanks to bcrypt
        //salt is built-in
    })
})
//s.o generate a list of pw and hash  value and used as lookup table
//have all 15k of them in obj, key= pw, value = hash, just have to 
//find the pw that matches the hash
//hash

var hashedPW = '$2a$10$Mu1ylfef8WPNGO4uz.7NxeGRQuP8GpnbeqTJ2dLXWWIO6br.tBpi2';

//3rd argument: callback
bcrypt.compare(password, hashedPW,(err,res)=>{
    //res either true or false
    console.log(res);
})

/*
var data = {
    id: 10
};

//take the obj, data with user id: sign = hash it, return token value
//arguments: obj and secret, return a token to user when 
//they either sign up or log in - token = a hash = signature

var token = jwt.sign(data, '123abc');
console.log(token);

//take the token and the secret and make sure the data was not manipulated
//if token = token + '1' or secret = '123abc' + 'c' => verification error
var decoded = jwt.verify(token, '123abc');
console.log('decoded: ', decoded);



/*
var  message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);
//JWT: JASON WEB TOKEN

//id that matches the token
var data = {
    //this is the data we send back to the client
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}
//sult hash: add sth to the hash that is unique that changes the value
//password + some randomly generated value: salt
//different salting everytime => not getting the same hash twice

//now the client can change data, rehash, but they don't have the 
//secret salt => bad hash

//check that the token was not manipulated


//men in the middle simulation:
token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
    //data wasnt manipulated
    console.log('Data was not changed');
}else{
    console.log('Data was changed');
}

*/

//jsonwebtoken: 2 functions  1 to create token, the other is to verify it
